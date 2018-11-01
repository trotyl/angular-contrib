import { Directive, ElementRef, Renderer2 } from '@angular/core';

const NG_HOST_ELEMENTS = new WeakMap<Renderer2, WeakSet<Element>>();

@Directive({
  selector: 'ng-host',
})
export class NgHost {
  constructor(element: ElementRef, renderer: Renderer2) {
    transferInitialAttributes(renderer, element.nativeElement);

    if (!NG_HOST_ELEMENTS.has(renderer)) {
      NG_HOST_ELEMENTS.set(renderer, new WeakSet<Element>());
      interceptRenderer(renderer);
    }

    NG_HOST_ELEMENTS.get(renderer)!.add(element.nativeElement);
  }
}

function transferInitialAttributes(renderer: Renderer2, element: HTMLElement) {
  const parent = renderer.parentNode(element);

  for (let i = 0; i < element.classList.length; i++) {
    const className = element.classList[i];
    renderer.addClass(parent, className);
  }
  renderer.removeAttribute(element, 'class');

  for (let i = 0; i < element.style.length; i++) {
    const style = element.style[i];
    const value: string|null = (element.style as any)[style];
    renderer.setStyle(parent, style, value);
  }
  renderer.removeAttribute(element, 'style');

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    renderer.setAttribute(parent, attr.name, attr.value);
    renderer.removeAttribute(element, attr.name);
  }
}

function interceptRenderer(renderer: Renderer2): void {
  const addClass = renderer.addClass;
  const removeAttribute = renderer.removeAttribute;
  const removeClass = renderer.removeClass;
  const removeStyle = renderer.removeStyle;
  const setAttribute = renderer.setAttribute;
  const setProperty = renderer.setProperty;
  const setStyle = renderer.setStyle;

  renderer.addClass = function (el: any, ...restArgs: any[]): void {
    addClass.call(this, targetOf(this, el), ...restArgs);
  };

  renderer.removeAttribute = function (el: any, ...restArgs: any[]): void {
    removeAttribute.call(this, targetOf(this, el), name, ...restArgs);
  };

  renderer.removeClass = function (el: any, ...restArgs: any[]): void {
    removeClass.call(this, targetOf(this, el), ...restArgs);
  };

  renderer.removeStyle = function (el: any, ...restArgs: any[]): void {
    removeStyle.call(this, targetOf(this, el), ...restArgs);
  };

  renderer.setAttribute = function (el: any, ...restArgs: any[]): void {
    setAttribute.call(this, targetOf(this, el), ...restArgs);
  };

  renderer.setProperty = function (el: any, ...restArgs: any[]): void {
    setProperty.call(this, targetOf(this, el), ...restArgs);
  };

  renderer.setStyle = function (el: any, ...restArgs: any[]): void {
    setStyle.call(this, targetOf(this, el), ...restArgs);
  };
}

function targetOf(renderer: Renderer2, node: string | any): any {
  if (typeof node !== 'string' &&
      NG_HOST_ELEMENTS.has(renderer) &&
      NG_HOST_ELEMENTS.get(renderer)!.has(node)) {
    return renderer.parentNode(node);
  }
  return node;
}
