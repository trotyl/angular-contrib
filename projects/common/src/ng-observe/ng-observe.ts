import { Directive, forwardRef, ElementRef, Injectable, OnInit, OnDestroy, Renderer2, Component, Output, EventEmitter } from '@angular/core';
import { RenderInterceptor } from '@angular-contrib/core';

const observers = new WeakMap<Node, () => void>();
const observeStarts = new WeakMap<Node, Node>();
const observeEnds = new WeakMap<Node, Node>();

function differentInArray<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return true;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return true;
    }
  }

  return false;
}

@Injectable()
export class ObserveContentInterceptor implements RenderInterceptor {
  appendChild(parent: Node, newChild: Node, renderer: Renderer2): void {
    renderer.appendChild(parent, newChild);

    const observer = observers.get(parent);
    if (observer != null) {
      observer();
    }
  }

  insertBefore(parent: Node, newChild: Node, refChild: Node, renderer: Renderer2): void {
    renderer.insertBefore(parent, newChild, refChild);

    const observer = observers.get(parent);
    if (observer != null) {
      observer();
    }
  }

  removeChild(parent: Node, oldChild: Node, isHostElement: boolean | undefined, renderer: Renderer2): void {
    renderer.removeChild(parent, oldChild, isHostElement);

    const observer = observers.get(parent);
    if (observer != null) {
      observer();
    }
  }
}

@Component({
  selector: 'ng-observe:not([start]):not([end])',
  template: `<ng-content></ng-content>`,
})
export class NgObserve implements OnInit, OnDestroy {
  @Output() contentChange = new EventEmitter();

  content: Node[] = [];

  constructor(
    private host: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.updateContent();
    observers.set(this.host.nativeElement, () => this.updateContent());
  }

  ngOnDestroy(): void {
    observers.delete(this.host.nativeElement);
  }

  updateContent(): void {
    const el = this.host.nativeElement as HTMLElement;
    this.content = Array.from(this.renderer.childNodes(el));
    this.contentChange.emit(this.content);
  }
}

@Component({
  selector: 'ng-observe[start]',
  template: `<ng-content></ng-content>`,
  providers: [
    { provide: NgObserve, useExisting: forwardRef(() => NgObserveStart) }
  ],
})
export class NgObserveStart implements OnInit, OnDestroy {
  @Output() contentChange = new EventEmitter();

  content: Node[] = [];
  parent: Node;

  constructor(
    private host: ElementRef,
    private renderer: Renderer2,
  ) {
    const parent = renderer.parentNode(host.nativeElement);
    this.parent = parent;
    observeStarts.set(parent, this.host.nativeElement);
  }

  ngOnInit(): void {
    this.updateContent();
    observers.set(this.parent, () => this.updateContent());
  }

  ngOnDestroy(): void {
    observers.delete(this.host.nativeElement);
  }

  updateContent(): void {
    const childNodes = this.renderer.childNodes(this.parent);
    const start = this.host.nativeElement;
    const end = observeEnds.get(start);
    const content: Node[] = [];
    let postStart = false;

    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode === start) {
        postStart = true;
        continue;
      }
      if (childNode === end) {
        break;
      }
      if (postStart) {
        content.push(childNode);
      }
    }

    if (differentInArray(content, this.content)) {
      this.content = content;
      this.contentChange.emit(this.content);
    }
  }
}

@Directive({
  selector: 'ng-observe[end]'
})
export class NgObserveEnd {
  constructor(
    host: ElementRef,
    renderer: Renderer2,
  ) {
    const parent = renderer.parentNode(host.nativeElement) as Node;
    const start = observeStarts.get(parent);

    if (start != null) {
      observeStarts.delete(parent);
      observeEnds.set(start, host.nativeElement);
    }
  }
}
