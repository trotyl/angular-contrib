import { IterableChanges, IterableChangeRecord } from '@angular/core';
import { FastIterableDiffer, FastIterableDifferFactory } from './fast-iterable-differ';
import { stringify } from './utils';

class ItemWithId {
  constructor(private id: string) { }

  toString() { return `{id: ${this.id}}`; }
}

class ComplexItem {
  constructor(private id: string, private color: string) { }

  toString() { return `{id: ${this.id}, color: ${this.color}}`; }
}

describe('FastIterableDiffer', function () {
  let differ: FastIterableDiffer<any>;

  beforeEach(() => {
    differ = new FastIterableDiffer((index, item) => item);
  });

  it('should support only array', () => {
    const f = new FastIterableDifferFactory();
    expect(f.supports([])).toBe(true);
    expect(f.supports(new Set())).toBe(false);
    expect(f.supports(new Map())).toBe(false);
    expect(f.supports(null)).toBe(false);
  });

  it('should detect additions', () => {
    const l: any[] = [];
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({ collection: [] }));

    l.push('a');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['a[null->0]'],
      additions: ['a[null->0]'],
    }));

    l.push('b');
    differ.check(l);
    expect(iterableDifferToString(differ))
      .toEqual(iterableChangesAsString(
        { collection: ['a', 'b[null->1]'], previous: ['a'], additions: ['b[null->1]'] }));
  });

  it('should support changing the reference', () => {
    let l = [0];
    differ.check(l);

    l = [1, 0];
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['1[null->0]', '0[0->1]'],
      previous: ['0[0->1]'],
      additions: ['1[null->0]'],
      moves: ['0[0->1]'],
    }));

    l = [2, 1, 0];
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['2[null->0]', '1[0->1]', '0[1->2]'],
      previous: ['1[0->1]', '0[1->2]'],
      additions: ['2[null->0]'],
      moves: ['1[0->1]', '0[1->2]'],
    }));
  });

  it('should handle swapping element', () => {
    const l = [1, 2];
    differ.check(l);

    l.length = 0;
    l.push(2);
    l.push(1);
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['2[1->0]', '1[0->1]'],
      previous: ['1[0->1]', '2[1->0]'],
      moves: ['2[1->0]', '1[0->1]'],
    }));
  });

  it('should handle incremental swapping element', () => {
    const l = ['a', 'b', 'c'];
    differ.check(l);

    l.splice(1, 1);
    l.splice(0, 0, 'b');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['b[1->0]', 'a[0->1]', 'c'],
      previous: ['a[0->1]', 'b[1->0]', 'c'],
      moves: ['b[1->0]', 'a[0->1]'],
    }));

    l.splice(1, 1);
    l.push('a');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['b', 'c[2->1]', 'a[1->2]'],
      previous: ['b', 'a[1->2]', 'c[2->1]'],
      moves: ['c[2->1]', 'a[1->2]'],
    }));
  });

  it('should detect changes in list', () => {
    const l: any[] = [];
    differ.check(l);

    l.push('a');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['a[null->0]'],
      additions: ['a[null->0]'],
    }));

    l.push('b');
    differ.check(l);
    expect(iterableDifferToString(differ))
      .toEqual(iterableChangesAsString(
        { collection: ['a', 'b[null->1]'], previous: ['a'], additions: ['b[null->1]'] }));

    l.push('c');
    l.push('d');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['a', 'b', 'c[null->2]', 'd[null->3]'],
      previous: ['a', 'b'],
      additions: ['c[null->2]', 'd[null->3]'],
    }));

    l.splice(2, 1);
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['a', 'b', 'd[3->2]'],
      previous: ['a', 'b', 'c[2->null]', 'd[3->2]'],
      moves: ['d[3->2]'],
      removals: ['c[2->null]'],
    }));

    l.length = 0;
    l.push('d');
    l.push('c');
    l.push('b');
    l.push('a');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['d[2->0]', 'c[null->1]', 'b[1->2]', 'a[0->3]'],
      previous: ['a[0->3]', 'b[1->2]', 'd[2->0]'],
      additions: ['c[null->1]'],
      moves: ['d[2->0]', 'b[1->2]', 'a[0->3]'],
    }));
  });

  it('should ignore [NaN] != [NaN]', () => {
    const l = [NaN];
    differ.check(l);
    differ.check(l);
    expect(iterableDifferToString(differ))
      .toEqual(iterableChangesAsString({ collection: [NaN], previous: [NaN] }));
  });

  it('should detect [NaN] moves', () => {
    const l: any[] = [NaN, NaN];
    differ.check(l);

    l.unshift('foo');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['foo[null->0]', 'NaN[0->1]', 'NaN[1->2]'],
      previous: ['NaN[0->1]', 'NaN[1->2]'],
      additions: ['foo[null->0]'],
      moves: ['NaN[0->1]', 'NaN[1->2]'],
    }));
  });

  it('should remove and add same item', () => {
    const l = ['a', 'b', 'c'];
    differ.check(l);

    l.splice(1, 1);
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['a', 'c[2->1]'],
      previous: ['a', 'b[1->null]', 'c[2->1]'],
      moves: ['c[2->1]'],
      removals: ['b[1->null]'],
    }));

    l.splice(1, 0, 'b');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['a', 'b[null->1]', 'c[1->2]'],
      previous: ['a', 'c[1->2]'],
      additions: ['b[null->1]'],
      moves: ['c[1->2]'],
    }));
  });

  it('should support duplicates', () => {
    differ = new FastIterableDiffer();
    const l = ['a', 'a', 'a', 'b', 'b'];
    differ.check(l);

    l.splice(0, 1);
    differ.check(l);
    // expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
    //   collection: ['a', 'a', 'b[3->2]', 'b[4->3]'],
    //   previous: ['a', 'a', 'a[2->null]', 'b[3->2]', 'b[4->3]'],
    //   moves: ['b[3->2]', 'b[4->3]'],
    //   removals: ['a[2->null]'],
    // }));
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['a', 'a', 'b', 'b'],
      previous: ['a', 'a', 'a', 'b', 'b[4->null]'],
      removals: ['b[4->null]'],
      identityChanges: ['b'],
    }));
  });

  it('should support insertions/moves', () => {
    differ = new FastIterableDiffer();
    const l = ['a', 'a', 'b', 'b'];
    differ.check(l);

    l.splice(0, 0, 'b');
    differ.check(l);
    // expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
    //   collection: ['b[2->0]', 'a[0->1]', 'a[1->2]', 'b', 'b[null->4]'],
    //   previous: ['a[0->1]', 'a[1->2]', 'b[2->0]', 'b'],
    //   additions: ['b[null->4]'],
    //   moves: ['b[2->0]', 'a[0->1]', 'a[1->2]'],
    // }));
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['b', 'a', 'a', 'b', 'b[null->4]'],
      previous: ['a', 'a', 'b', 'b'],
      additions: ['b[null->4]'],
      identityChanges: ['b', 'a'],
    }));
  });

  it('should not report unnecessary moves', () => {
    const l = ['a', 'b', 'c'];
    differ.check(l);

    l.length = 0;
    l.push('b');
    l.push('a');
    l.push('c');
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['b[1->0]', 'a[0->1]', 'c'],
      previous: ['a[0->1]', 'b[1->0]', 'c'],
      moves: ['b[1->0]', 'a[0->1]'],
    }));
  });

  // https://github.com/angular/angular/issues/17852
  it('support re-insertion', () => {
    differ = new FastIterableDiffer();
    const l = ['a', '*', '*', 'd', '-', '-', '-', 'e'];
    differ.check(l);
    l[1] = 'b';
    l[5] = 'c';
    differ.check(l);
    // expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
    //   collection: ['a', 'b[null->1]', '*[1->2]', 'd', '-', 'c[null->5]', '-[5->6]', 'e'],
    //   previous: ['a', '*[1->2]', '*[2->null]', 'd', '-', '-[5->6]', '-[6->null]', 'e'],
    //   additions: ['b[null->1]', 'c[null->5]'],
    //   moves: ['*[1->2]', '-[5->6]'],
    //   removals: ['*[2->null]', '-[6->null]'],
    // }));
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['a', 'b', '*', 'd', '-', 'c', '-', 'e'],
      previous: ['a', '*', '*', 'd', '-', '-', '-', 'e'],
      identityChanges: ['b', 'c'],
    }));
  });

  describe('forEachOperation', () => {
    function stringifyItemChange(record: any, p: number, c: number, originalIndex: number) {
      const suffix = originalIndex == null ? '' : ' [o=' + originalIndex + ']';
      const value = record.item;
      if (record.currentIndex == null) {
        return `REMOVE ${value} (${p} -> VOID)${suffix}`;
      } else if (record.previousIndex == null) {
        return `INSERT ${value} (VOID -> ${c})${suffix}`;
      } else {
        return `MOVE ${value} (${p} -> ${c})${suffix}`;
      }
    }

    function modifyArrayUsingOperation(
      arr: number[], endData: any[], prev: number, next: number, value: number) {
      if (prev == null) {
        arr.splice(next, 0, value);
      } else if (next == null) {
        value = arr[prev];
        arr.splice(prev, 1);
      } else {
        value = arr[prev];
        arr.splice(prev, 1);
        arr.splice(next, 0, value);
      }
      return value;
    }

    it('should trigger a series of insert/move/remove changes for inputs that have been diffed',
      () => {
        const startData = [0, 1, 2, 3, 4, 5];
        const endData = [6, 2, 7, 0, 4, 8];

        differ = differ.diff(startData)!;
        differ = differ.diff(endData)!;

        const operations: string[] = [];
        differ.forEachOperation((record: any, prev: number, next: number) => {
          modifyArrayUsingOperation(startData, endData, prev, next, record.item);
          operations.push(stringifyItemChange(record, prev, next, record.previousIndex));
        });

        // expect(operations).toEqual([
        //   'INSERT 6 (VOID -> 0)', 'MOVE 2 (3 -> 1) [o=2]', 'INSERT 7 (VOID -> 2)',
        //   'REMOVE 1 (4 -> VOID) [o=1]', 'REMOVE 3 (4 -> VOID) [o=3]',
        //   'REMOVE 5 (5 -> VOID) [o=5]', 'INSERT 8 (VOID -> 5)',
        // ]);
        expect(operations).toEqual([
          'REMOVE 1 (1 -> VOID) [o=1]', 'REMOVE 3 (2 -> VOID) [o=3]', 'REMOVE 5 (3 -> VOID) [o=5]',
          'INSERT 8 (VOID -> 3)', 'INSERT 7 (VOID -> 0)',
          'MOVE 2 (2 -> 0) [o=2]', 'INSERT 6 (VOID -> 0)',
        ]);

        expect(startData).toEqual(endData);
      });

    it('should consider inserting/removing/moving items with respect to items that have not moved at all',
      () => {
        const startData = [0, 1, 2, 3];
        const endData = [2, 1];

        differ = differ.diff(startData)!;
        differ = differ.diff(endData)!;

        const operations: string[] = [];
        differ.forEachOperation((record: any, prev: number, next: number) => {
          modifyArrayUsingOperation(startData, endData, prev, next, record.item);
          operations.push(stringifyItemChange(record, prev, next, record.previousIndex));
        });

        // expect(operations).toEqual([
        //   'REMOVE 3 (3 -> VOID) [o=3]',
        //   'REMOVE 0 (0 -> VOID) [o=0]',
        //   'MOVE 2 (1 -> 0) [o=2]',
        // ]);
        expect(operations).toEqual([
          'REMOVE 0 (0 -> VOID) [o=0]',
          'REMOVE 3 (2 -> VOID) [o=3]',
          'MOVE 2 (1 -> 0) [o=2]',
        ]);

        expect(startData).toEqual(endData);
      });

    it('should be able to manage operations within a criss/cross of move operations', () => {
      const startData = [1, 2, 3, 4, 5, 6];
      const endData = [3, 6, 4, 9, 1, 2];

      differ = differ.diff(startData)!;
      differ = differ.diff(endData)!;

      const operations: string[] = [];
      differ.forEachOperation((record: any, prev: number, next: number) => {
        modifyArrayUsingOperation(startData, endData, prev, next, record.item);
        operations.push(stringifyItemChange(record, prev, next, record.previousIndex));
      });

      // expect(operations).toEqual([
      //   'REMOVE 5 (4 -> VOID) [o=4]',
      //   'MOVE 3 (2 -> 0) [o=2]',
      //   'MOVE 6 (4 -> 1) [o=5]',
      //   'MOVE 4 (3 -> 2) [o=3]',
      //   'INSERT 9 (VOID -> 3)',
      // ]);
      expect(operations).toEqual([
        'REMOVE 5 (4 -> VOID) [o=4]',
        'INSERT 9 (VOID -> 0)',
        'MOVE 4 (4 -> 0) [o=3]',
        'MOVE 6 (5 -> 0) [o=5]',
        'MOVE 3 (5 -> 0) [o=2]',
      ]);

      expect(startData).toEqual(endData);
    });

    it('should skip moves for multiple nodes that have not moved', () => {
      const startData = [0, 1, 2, 3, 4];
      const endData = [4, 1, 2, 3, 0, 5];

      differ = differ.diff(startData)!;
      differ = differ.diff(endData)!;

      const operations: string[] = [];
      differ.forEachOperation((record: any, prev: number, next: number) => {
        modifyArrayUsingOperation(startData, endData, prev, next, record.item);
        operations.push(stringifyItemChange(record, prev, next, record.previousIndex));
      });

      // expect(operations).toEqual([
      //   'MOVE 4 (4 -> 0) [o=4]',
      //   'MOVE 1 (2 -> 1) [o=1]',
      //   'MOVE 2 (3 -> 2) [o=2]',
      //   'MOVE 3 (4 -> 3) [o=3]',
      //   'INSERT 5 (VOID -> 5)',
      // ]);
      expect(operations).toEqual([
        'INSERT 5 (VOID -> 5)',
        'MOVE 0 (0 -> 4) [o=0]',
        'MOVE 4 (3 -> 0) [o=4]',
      ]);

      expect(startData).toEqual(endData);
    });

    it('should not fail', () => {
      const startData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const endData = [10, 11, 1, 5, 7, 8, 0, 5, 3, 6];

      differ = differ.diff(startData)!;
      differ = differ.diff(endData)!;

      const operations: string[] = [];
      differ.forEachOperation((record: any, prev: number, next: number) => {
        modifyArrayUsingOperation(startData, endData, prev, next, record.item);
        operations.push(stringifyItemChange(record, prev, next, record.previousIndex));
      });

      // expect(operations).toEqual([
      //   'MOVE 10 (10 -> 0) [o=10]', 'MOVE 11 (11 -> 1) [o=11]', 'MOVE 1 (3 -> 2) [o=1]',
      //   'MOVE 5 (7 -> 3) [o=5]', 'MOVE 7 (9 -> 4) [o=7]', 'MOVE 8 (10 -> 5) [o=8]',
      //   'REMOVE 2 (7 -> VOID) [o=2]', 'INSERT 5 (VOID -> 7)', 'REMOVE 4 (9 -> VOID) [o=4]',
      //   'REMOVE 9 (10 -> VOID) [o=9]',
      // ]);
      expect(operations).toEqual([
        'REMOVE 2 (2 -> VOID) [o=2]', 'REMOVE 4 (3 -> VOID) [o=4]', 'REMOVE 9 (7 -> VOID) [o=9]',
        'MOVE 5 (3 -> 2) [o=5]', 'MOVE 8 (6 -> 0) [o=8]', 'MOVE 7 (6 -> 0) [o=7]',
        'INSERT 5 (VOID -> 0)', 'MOVE 1 (4 -> 0) [o=1]', 'MOVE 11 (9 -> 0) [o=11]',
        'MOVE 10 (9 -> 0) [o=10]',
      ]);

      expect(startData).toEqual(endData);
    });

    it('should trigger nothing when the list is completely full of replaced items that are tracked by the index',
      () => {
        differ = new FastIterableDiffer((index: number) => index);

        const startData = [1, 2, 3, 4];
        const endData = [5, 6, 7, 8];

        differ.diff(startData);
        differ.diff(endData);

        const operations: string[] = [];
        differ.forEachOperation((record: any, prev: number, next: number) => {
          modifyArrayUsingOperation(startData, endData, prev, next, record.item);
          operations.push(stringifyItemChange(record, prev, next, record.previousIndex));
        });

        expect(operations).toEqual([]);
      });
  });

  describe('diff', () => {
    it('should return self when there is a change', () => {
      expect(differ.diff(['a', 'b'])).toBe(differ);
    });

    it('should return null when there is no change', () => {
      differ.diff(['a', 'b']);
      expect(differ.diff(['a', 'b'])).toEqual(null);
    });

    it('should treat null as an empty list', () => {
      differ.diff(['a', 'b']);
      expect(iterableDifferToString(differ.diff(null!)!)).toEqual(iterableChangesAsString({
        previous: ['a[0->null]', 'b[1->null]'],
        removals: ['a[0->null]', 'b[1->null]'],
      }));
    });

    it('should throw when given an invalid collection', () => {
      expect(() => differ.diff('invalid' as any)).toThrowError(/Error trying to diff 'invalid'/);
    });
  });
});

describe('trackBy function by id', function () {
  let differ: any;

  const trackByItemId = (index: number, item: any): any => item.id;

  const buildItemList = (list: string[]) => list.map((val) => new ItemWithId(val));

  beforeEach(() => { differ = new FastIterableDiffer(trackByItemId); });

  it('should treat the collection as dirty if identity changes', () => {
    differ.diff(buildItemList(['a']));
    expect(differ.diff(buildItemList(['a']))).toBe(differ);
  });

  it('should treat seen records as identity changes, not additions', () => {
    let l = buildItemList(['a', 'b', 'c']);
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: [`{id: a}[null->0]`, `{id: b}[null->1]`, `{id: c}[null->2]`],
      additions: [`{id: a}[null->0]`, `{id: b}[null->1]`, `{id: c}[null->2]`],
    }));

    l = buildItemList(['a', 'b', 'c']);
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: [`{id: a}`, `{id: b}`, `{id: c}`],
      identityChanges: [`{id: a}`, `{id: b}`, `{id: c}`],
      previous: [`{id: a}`, `{id: b}`, `{id: c}`],
    }));
  });

  it('should have updated properties in identity change collection', () => {
    let l = [new ComplexItem('a', 'blue'), new ComplexItem('b', 'yellow')];
    differ.check(l);

    l = [new ComplexItem('a', 'orange'), new ComplexItem('b', 'red')];
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: [`{id: a, color: orange}`, `{id: b, color: red}`],
      identityChanges: [`{id: a, color: orange}`, `{id: b, color: red}`],
      //   previous: [`{id: a, color: orange}`, `{id: b, color: red}`],
      previous: [`{id: a, color: blue}`, `{id: b, color: yellow}`],
    }));
  });

  it('should track moves normally', () => {
    let l = buildItemList(['a', 'b', 'c']);
    differ.check(l);

    l = buildItemList(['b', 'a', 'c']);
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['{id: b}[1->0]', '{id: a}[0->1]', '{id: c}'],
      // identityChanges: ['{id: b}[1->0]', '{id: a}[0->1]', '{id: c}'],
      identityChanges: ['{id: c}', '{id: a}[0->1]', '{id: b}[1->0]'],
      previous: ['{id: a}[0->1]', '{id: b}[1->0]', '{id: c}'],
      moves: ['{id: b}[1->0]', '{id: a}[0->1]'],
    }));

  });

  it('should track duplicate reinsertion normally', () => {
    let l = buildItemList(['a', 'a']);
    differ.check(l);

    l = buildItemList(['b', 'a', 'a']);
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['{id: b}[null->0]', '{id: a}[0->1]', '{id: a}[1->2]'],
      // identityChanges: ['{id: a}[0->1]', '{id: a}[1->2]'],
      identityChanges: ['{id: a}[1->2]', '{id: a}[0->1]'],
      previous: ['{id: a}[0->1]', '{id: a}[1->2]'],
      moves: ['{id: a}[0->1]', '{id: a}[1->2]'],
      additions: ['{id: b}[null->0]'],
    }));

  });

  it('should track removals normally', () => {
    const l = buildItemList(['a', 'b', 'c']);
    differ.check(l);

    l.splice(2, 1);
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['{id: a}', '{id: b}'],
      previous: ['{id: a}', '{id: b}', '{id: c}[2->null]'],
      removals: ['{id: c}[2->null]'],
    }));
  });
});

describe('trackBy function by index', function () {
  let differ: FastIterableDiffer<string>;

  const trackByIndex = (index: number, item: any): number => index;

  beforeEach(() => { differ = new FastIterableDiffer(trackByIndex); });

  it('should track removals normally', () => {
    differ.diff(['a', 'b', 'c', 'd']);
    differ.diff(['e', 'f', 'g', 'h']);
    differ.diff(['e', 'f', 'h']);

    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({
      collection: ['e', 'f', 'h'],
      // previous: ['e', 'f', 'h', 'h[3->null]'],
      previous: ['e', 'f', 'g', 'h[3->null]'],
      removals: ['h[3->null]'],
      identityChanges: ['h'],
    }));
  });
});


function iterableDifferToString<V>(iterableChanges: IterableChanges<V>) {
  const collection: string[] = [];
  iterableChanges.forEachItem((record: IterableChangeRecord<V>) => collection.push(icrAsString(record)));

  const previous: string[] = [];
  iterableChanges.forEachPreviousItem((record: IterableChangeRecord<V>) => previous.push(icrAsString(record)));

  const additions: string[] = [];
  iterableChanges.forEachAddedItem((record: IterableChangeRecord<V>) => additions.push(icrAsString(record)));

  const moves: string[] = [];
  iterableChanges.forEachMovedItem((record: IterableChangeRecord<V>) => moves.push(icrAsString(record)));

  const removals: string[] = [];
  iterableChanges.forEachRemovedItem((record: IterableChangeRecord<V>) => removals.push(icrAsString(record)));

  const identityChanges: string[] = [];
  iterableChanges.forEachIdentityChange((record: IterableChangeRecord<V>) => identityChanges.push(icrAsString(record)));

  return iterableChangesAsString({
    collection,
    previous,
    additions,
    moves,
    removals,
    identityChanges,
  });
}

function icrAsString<V>(icr: IterableChangeRecord<V>): string {
  return icr.previousIndex === icr.currentIndex ?
    stringify(icr.item) :
    stringify(icr.item) + '[' + stringify(icr.previousIndex) + '->' + stringify(icr.currentIndex) + ']';
}

function iterableChangesAsString({ collection = [] as any, previous = [] as any, additions = [] as any, moves = [] as any, removals = [] as any, identityChanges = [] as any }): string {
  return (
    'collection: ' + collection.join(', ') + '\n' +
    'previous: ' + previous.join(', ') + '\n' +
    'additions: ' + additions.join(', ') + '\n' +
    'moves: ' + moves.join(', ') + '\n' +
    'removals: ' + removals.join(', ') + '\n' +
    'identityChanges: ' + identityChanges.join(', ') + '\n'
  );
}
