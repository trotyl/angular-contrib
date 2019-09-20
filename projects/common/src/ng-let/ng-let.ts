import { Component, Input } from '@angular/core';

@Component({
  selector: 'ng-let[data]',
  template: `<ng-content></ng-content>`,
})
export class NgLet<T = unknown> {
  @Input() data!: T;
}
