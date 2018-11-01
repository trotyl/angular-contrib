import { Injectable, IterableChanges, IterableChangeRecord, IterableDiffer, IterableDifferFactory, TrackByFunction } from '@angular/core';
import { DiffContainer } from './container';
import { ItemNode, Operation } from './definitions';
import { patchChildren } from './instructions';
import { stringify } from './utils';

export class FastIterableDiffer<T> implements IterableDiffer<T>, IterableChanges<T> {
  private current: ItemNode[] = [];
  private previous: ItemNode[] = [];
  private operations: Operation[] = [];
  private identityChanges: IterableChangeRecord<any>[] = [];

  constructor(private trackByFn: TrackByFunction<T>|null = null) { }

  diff(collection: T[]): this | null {
    if (collection == null) collection = [];
    if (!Array.isArray(collection)) {
      throw new Error(`Error trying to diff '${stringify(collection)}'. Only arrays are allowed`);
    }

    if (this.check(collection)) {
      return this;
    } else {
      return null;
    }
  }

  forEachItem(fn: (record: IterableChangeRecord<T>) => void): void {
    for (let i = 0; i < this.current.length; i++) {
      const { item, key: trackById, from: previousIndex, to: currentIndex } = this.current[i];
      fn({ item, trackById, previousIndex, currentIndex });
    }
  }

  forEachOperation(fn: (record: IterableChangeRecord<T>, previousIndex: number | null, currentIndex: number | null) => void): void {
    for (let i = 0; i < this.operations.length; i++) {
      const { node, previousIndex: operationPreviousIndex, currentIndex: operationCurrentIndex } = this.operations[i];
      const { item, key: trackById, from: previousIndex, to: currentIndex } = node;
      fn({ item, trackById, previousIndex, currentIndex }, operationPreviousIndex, operationCurrentIndex);
    }
  }

  forEachPreviousItem(fn: (record: IterableChangeRecord<T>) => void): void {
    for (let i = 0; i < this.previous.length; i++) {
      const { item, key: trackById, from: previousIndex, to: currentIndex } = this.previous[i];
      fn({ item, trackById, previousIndex, currentIndex });
    }
  }

  forEachAddedItem(fn: (record: IterableChangeRecord<T>) => void): void {
    for (let i = 0; i < this.current.length; i++) {
      const { item, key: trackById, from: previousIndex, to: currentIndex } = this.current[i];
      if (previousIndex == null) {
        fn({ item, trackById, previousIndex, currentIndex });
      }
    }
  }

  forEachMovedItem(fn: (record: IterableChangeRecord<T>) => void): void {
    for (let i = 0; i < this.current.length; i++) {
      const { item, key: trackById, from: previousIndex, to: currentIndex } = this.current[i];
      if (previousIndex != null && currentIndex != null && previousIndex !== currentIndex) {
        fn({ item, trackById, previousIndex, currentIndex });
      }
    }
  }

  forEachRemovedItem(fn: (record: IterableChangeRecord<T>) => void): void {
    for (let i = 0; i < this.previous.length; i++) {
      const { item, key: trackById, from: previousIndex, to: currentIndex } = this.previous[i];
      if (currentIndex == null) {
        fn({ item, trackById, previousIndex, currentIndex });
      }
    }
  }

  forEachIdentityChange(fn: (record: IterableChangeRecord<T>) => void): void {
    for (let i = 0; i < this.identityChanges.length; i++) {
      fn(this.identityChanges[i]);
    }
  }

  check(next: T[]): boolean {
    this.reset();

    const lastChildren: ItemNode[] = new Array(this.current.length);
    for (let i = 0; i < lastChildren.length; i++) {
      const { item } = this.current[i];
      lastChildren[i] = {
        item,
        key: this.trackByFn ? this.trackByFn(i, item) : null,
        from: i,
        to: i,
        index: i,
        link: null,
      };
    }

    const nextChildren: ItemNode[] = new Array(next.length);
    for (let i = 0; i < nextChildren.length; i++) {
      const item = next[i];
      nextChildren[i] = {
        item,
        key: this.trackByFn ? this.trackByFn(i, item) : null,
        from: null,
        to: null,
        index: i,
        link: null,
      };
    }

    const container = new DiffContainer(lastChildren);
    patchChildren(container, lastChildren, nextChildren, this.trackByFn != null);
    this.operations = container.operations;
    this.identityChanges = container.identityChanges;

    this.previous = lastChildren;
    this.current = nextChildren;

    return this.operations.length + this.identityChanges.length > 0;
  }

  private reset(): void {
    this.operations = [];
  }
}

@Injectable()
export class FastIterableDifferFactory implements IterableDifferFactory {
  supports(objects: any): boolean {
    return Array.isArray(objects);
  }

  create<T>(trackByFn?: TrackByFunction<T>): IterableDiffer<T> {
    return new FastIterableDiffer<T>(trackByFn);
  }
}
