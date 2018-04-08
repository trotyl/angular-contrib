import { Directive, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[ngInit]',
})
export class NgInit implements OnInit {
  @Output() ngInit = new EventEmitter<void>();

  ngOnInit(): void {
    this.ngInit.emit();
  }
}
