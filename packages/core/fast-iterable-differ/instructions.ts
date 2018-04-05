// Diffing instructions inspired by inferno (https://github.com/infernojs/inferno)

import { Container, ItemNode } from './definitions';
import { looseIdentical } from './utils';

export function patchChildren(container: Container, lastChildren: ItemNode[], nextChildren: ItemNode[], keyed: boolean) {
  const lastLength = lastChildren.length;
  const nextLength = nextChildren.length;

  // Fast path's for both algorithms
  if (lastLength === 0) {
    if (nextLength > 0) {
      AppendAllNodes(container, nextChildren);
    }
  } else if (nextLength === 0) {
    removeAllNodes(container, lastChildren);
  } else if (keyed) {
    patchKeyedChildren(container, lastChildren, nextChildren, lastLength, nextLength);
  } else {
    patchNonKeyedChildren(container, lastChildren, nextChildren, lastLength, nextLength);
  }
}

function patchNonKeyedChildren(container: Container, lastChildren: ItemNode[], nextChildren: ItemNode[], lastChildrenLength: number, nextChildrenLength: number) {
  const commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
  let i = 0;

  for (; i < commonLength; i++) {
    const nextChild = nextChildren[i];
    patchItem(container, lastChildren[i], nextChild);
  }
  if (lastChildrenLength < nextChildrenLength) {
    for (i = commonLength; i < nextChildrenLength; i++) {
      append(container, nextChildren[i]);
    }
  } else if (lastChildrenLength > nextChildrenLength) {
    for (i = commonLength; i < lastChildrenLength; i++) {
      remove(container, lastChildren[i]);
    }
  }
}

function patchKeyedChildren(container: Container, a: ItemNode[], b: ItemNode[], aLength: number, bLength: number) {
  let aEnd = aLength - 1;
  let bEnd = bLength - 1;
  let aStart = 0;
  let bStart = 0;
  let i: number;
  let j: number;
  let aNode: ItemNode = a[aStart];
  let bNode: ItemNode = b[bStart];
  let nextNode: ItemNode|null;
  let nextPos: number;

  // Step 1
  // tslint:disable-next-line
  outer: {
    // Sync nodes with the same key at the beginning.
    while (looseIdentical(aNode.key, bNode.key)) {
      patchItem(container, aNode, bNode);
      aStart++;
      bStart++;
      if (aStart > aEnd || bStart > bEnd) {
        break outer;
      }
      aNode = a[aStart];
      bNode = b[bStart];
    }

    aNode = a[aEnd];
    bNode = b[bEnd];

    // Sync nodes with the same key at the end.
    while (looseIdentical(aNode.key, bNode.key)) {
      patchItem(container, aNode, bNode);
      aEnd--;
      bEnd--;
      if (aStart > aEnd || bStart > bEnd) {
        break outer;
      }
      aNode = a[aEnd];
      bNode = b[bEnd];
    }
  }

  if (aStart > aEnd) {
    if (bStart <= bEnd) {
      nextPos = bEnd + 1;
      nextNode = nextPos < bLength ? b[nextPos] : null;
      while (bStart <= bEnd) {
        bNode = b[bStart];
        bStart++;
        insertOrAppend(container, bNode, nextNode);
      }
    }
  } else if (bStart > bEnd) {
    while (aStart <= aEnd) {
      remove(container, a[aStart++]);
    }
  } else {
    const aLeft: number = aEnd - aStart + 1;
    const bLeft: number = bEnd - bStart + 1;
    const sources = new Array(bLeft);
    for (i = 0; i < bLeft; i++) {
      sources[i] = -1;
    }
    // Keep track if its possible to remove whole DOM using textContent = '';
    let canRemoveWholeContent: boolean = aLeft === aLength;
    let moved: boolean = false;
    let pos: number = 0;
    let patched: number = 0;

    // When sizes are small, just loop them through
    if (bLeft <= 4 || aLeft * bLeft <= 16) {
      for (i = aStart; i <= aEnd; i++) {
        aNode = a[i];
        if (patched < bLeft) {
          for (j = bStart; j <= bEnd; j++) {
            bNode = b[j];
            if (looseIdentical(aNode.key, bNode.key)) {
              sources[j - bStart] = i;
              if (canRemoveWholeContent) {
                canRemoveWholeContent = false;
                while (i > aStart) {
                  remove(container, a[aStart++]);
                }
              }
              if (pos > j) {
                moved = true;
              } else {
                pos = j;
              }
              patchItem(container, aNode, bNode);
              patched++;
              break;
            }
          }
          if (!canRemoveWholeContent && j > bEnd) {
            remove(container, aNode);
          }
        } else if (!canRemoveWholeContent) {
          remove(container, aNode);
        }
      }
    } else {
      const keyIndex: Map<any, number> = new Map();

      // Map keys by their index in array
      for (i = bStart; i <= bEnd; i++) {
        keyIndex.set(b[i].key, i);
      }

      // Try to patch same keys
      for (i = aStart; i <= aEnd; i++) {
        aNode = a[i];

        if (patched < bLeft) {
          j = keyIndex.get(aNode.key)!;

          if (j != null) {
            if (canRemoveWholeContent) {
              canRemoveWholeContent = false;
              while (i > aStart) {
                remove(container, a[aStart++]);
              }
            }
            bNode = b[j];
            sources[j - bStart] = i;
            if (pos > j) {
              moved = true;
            } else {
              pos = j;
            }
            patchItem(container, aNode, bNode);
            patched++;
          } else if (!canRemoveWholeContent) {
            remove(container, aNode);
          }
        } else if (!canRemoveWholeContent) {
          remove(container, aNode);
        }
      }
    }
    // fast-path: if nothing patched remove all old and add all new
    if (canRemoveWholeContent) {
      removeAllNodes(container, a);
      AppendAllNodes(container, b);
    } else {
      if (moved) {
        const seq = lis_algorithm(sources);
        j = seq.length - 1;
        for (i = bLeft - 1; i >= 0; i--) {
          if (sources[i] === -1) {
            pos = i + bStart;
            bNode = b[pos];
            nextPos = pos + 1;
            insertOrAppend(container, bNode, nextPos < bLength ? b[nextPos] : null);
          } else if (j < 0 || i !== seq[j]) {
            pos = i + bStart;
            bNode = b[pos];
            nextPos = pos + 1;
            insertOrAppend(container, bNode, nextPos < bLength ? b[nextPos] : null);
          } else {
            j--;
          }
        }
      } else if (patched !== bLeft) {
        // when patched count doesn't match b length we need to insert those new ones
        // loop backwards so we can use insertBefore
        for (i = bLeft - 1; i >= 0; i--) {
          if (sources[i] === -1) {
            pos = i + bStart;
            bNode = b[pos];
            nextPos = pos + 1;
            insertOrAppend(container, bNode, nextPos < bLength ? b[nextPos] : null);
          }
        }
      }
    }
  }
}

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(arr: number[]): number[] {
  const p = arr.slice();
  const result: number[] = [0];
  let i;
  let j;
  let u;
  let v;
  let c;
  const len = arr.length;

  for (i = 0; i < len; i++) {
    const arrI = arr[i];

    if (arrI !== -1) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }

      u = 0;
      v = result.length - 1;

      while (u < v) {
        // tslint:disable-next-line:no-bitwise
        c = ((u + v) / 2) | 0;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }

      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }

  u = result.length;
  v = result[u - 1];

  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }

  return result;
}

function patchItem(container: Container, lastVNode: ItemNode, nextVNode: ItemNode) {
  container.checkIdentity(lastVNode, nextVNode);
}

function AppendAllNodes(container: Container, children: ItemNode[]) {
  for (let i = 0, len = children.length; i < len; i++) {
    append(container, children[i]);
  }
}

export function removeAllNodes(container: Container, children: ItemNode[]) {
  for (let i = children.length - 1; i >= 0; i--) {
    container.remove(children[i]);
  }
}

export function append(container: Container, node: ItemNode) {
  container.append(node);
}

export function remove(container: Container, node: ItemNode, index?: number) {
  container.remove(node);
}

export function insertOrAppend(container: Container, newNode: ItemNode, nextNode: ItemNode|null, nextPos?: number, existingPos?: number) {
  if (nextNode == null) {
    append(container, newNode);
  } else {
    container.insertBefore(newNode, nextNode);
  }
}
