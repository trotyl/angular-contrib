import { Component, Input } from '@angular/core';

@Component({
  selector: 'ng-let[data]',
  template: ``,
})
export class NgLet<T = unknown> {
  @Input() data!: T;
}
