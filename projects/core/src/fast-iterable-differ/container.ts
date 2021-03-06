import { IterableChangeRecord } from '@angular/core';
import { Container, ItemNode, Operation } from './definitions';

export class DiffContainer implements Container {
  operations: Operation[] = [];
  identityChanges: IterableChangeRecord<any>[] = [];
  list: ItemNode[];

  constructor(list: ItemNode[]) {
    this.list = list.slice();
  }

  append(node: ItemNode): void {
    let previousIndex = null;
    if (node.to != null) {
      previousIndex = node.to;
      this.remove(node, false);
    }
    node.to = this.list.length;
    if (node.link != null) {
      node.link.to = this.list.length;
    }
    this.operations.push({
      node,
      previousIndex,
      currentIndex: node.to,
    });
    this.list.push(node);
  }

  remove(nodeToRemove: ItemNode, isOperation: boolean = true): void {
    this.assertActive(nodeToRemove);
    for (let i = nodeToRemove.to! + 1; i < this.list.length; i++) {
      const node = this.list[i];
      node.to!--;
      if (node.link != null) {
        node.link.to!--;
      }
    }
    if (isOperation) {
      this.operations.push({
        node: nodeToRemove,
        previousIndex: nodeToRemove.to,
        currentIndex: null,
      });
    }
    this.list.splice(nodeToRemove.to!, 1);
    if (isOperation) {
      nodeToRemove.to = null;
      if (nodeToRemove.link != null) {
        nodeToRemove.link.to = null;
      }
    }
  }

  insertBefore(newNode: ItemNode, nextNode: ItemNode): void {
    this.assertActive(nextNode);
    const previousIndex = newNode.to;
    let currentIndex = nextNode.to!;
    if (previousIndex != null) {
      this.list.splice(previousIndex, 1);
      if (previousIndex < currentIndex) {
        currentIndex--;
        nextNode.to!--;
        for (let i = previousIndex; i <= currentIndex; i++) {
          const node = this.list[i];
          node.to!--;
          if (node.link != null) {
            node.link.to!--;
          }
        }
      } else {
        for (let i = currentIndex; i < previousIndex; i++) {
          const node = this.list[i];
          node.to!++;
          if (node.link != null) {
            node.link.to!++;
          }
        }
      }
    } else {
      for (let i = currentIndex; i < this.list.length; i++) {
        const node = this.list[i];
        node.to!++;
        if (node.link != null) {
          node.link.to!++;
        }
      }
    }
    newNode.to = currentIndex;
    if (newNode.link != null) {
      newNode.link.to = currentIndex;
    }
    this.list.splice(currentIndex, 0, newNode);
    this.operations.push({
      node: newNode,
      previousIndex,
      currentIndex,
    });
  }

  checkIdentity(lastNode: ItemNode, newNode: ItemNode): void {
    this.assertActive(lastNode);
    if (!Object.is(lastNode.item, newNode.item)) {
      this.identityChanges.push({
        item: newNode.item,
        trackById: newNode.key,
        previousIndex: lastNode.index,
        currentIndex: newNode.index,
      });
    }
    newNode.from = lastNode.from;
    newNode.to = lastNode.to;
    lastNode.link = newNode;
    newNode.link = lastNode;
  }

  reset(): void {
    this.list = [];
    this.operations = [];
    this.identityChanges = [];
  }

  private assertActive(node: ItemNode): void {
    if (node.to == null) { throw new Error(`Expected item ${node.item} to be in list`); }
  }
}
