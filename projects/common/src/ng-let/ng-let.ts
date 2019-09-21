import { Component, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'ng-let[data]',
  template: ``,
})
export class NgLet<T = unknown> implements OnInit {
  @Input() data!: T;

  constructor(
    private renderer: Renderer2,
    private host: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.renderer.removeChild(this.renderer.parentNode(this.host.nativeElement), this.host.nativeElement);
  }
}
