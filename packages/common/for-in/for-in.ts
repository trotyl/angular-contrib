import { NgForOf } from '@angular/common';
import { Directive, DoCheck, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[ngFor][ngForIn]',
})
export class NgForIn extends NgForOf<string> implements DoCheck, OnChanges {
  @Input() ngForIn: { [key: string]: any } | Map<string, any> | null;

  private previousKeys: string[];

  ngOnChanges(changes: SimpleChanges): void {
    if ('ngForIn' in changes) {
      const change = changes['ngForIn'];
      const keys = this.keysOf(change.currentValue);
      this.ngForOf = keys;
      changes['ngForOf'] = new SimpleChange(this.previousKeys, keys, change.isFirstChange());
      this.previousKeys = keys;
    }
    if (super.ngOnChanges) {
      super.ngOnChanges(changes);
    }
  }

  ngDoCheck(): void {
    this.ngForOf = this.keysOf(this.ngForIn);
    super.ngDoCheck();
  }

  private keysOf(map: { [key: string]: any } | Map<string, any> | null): string[] {
    if (map == null) return [];
    if (map instanceof Map) return Array.from(map.keys());
    return Object.keys(map).sort();
  }
}
