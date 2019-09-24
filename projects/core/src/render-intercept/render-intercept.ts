import { Renderer2, RendererStyleFlags2, InjectionToken, Component } from '@angular/core';

export interface RenderInterceptor {
  createElement?(name: string, namespace: string | undefined, renderer: Renderer2): Element;
  createComment?(value: string, renderer: Renderer2): Comment;
  createText?(value: string, renderer: Renderer2): Text;
  appendChild?(parent: Node, newChild: Node, renderer: Renderer2): void;
  insertBefore?(parent: Node, newChild: Node, refChild: Node, renderer: Renderer2): void;
  removeChild?(parent: Node, oldChild: Node, isHostElement: boolean | undefined, renderer: Renderer2): void;
  selectRootElement?(selectorOrNode: string | Node, preserveContent: boolean | undefined, renderer: Renderer2): Element;
  parentNode?(node: Node, renderer: Renderer2): Node;
  childNodes?(node: Node, renderer: Renderer2): NodeList;
  nextSibling?(node: Node, renderer: Renderer2): Node;
  setAttribute?(el: Element, name: string, value: string, namespace: string | undefined, renderer: Renderer2): void;
  removeAttribute?(el: Element, name: string, namespace: string | undefined, renderer: Renderer2): void;
  addClass?(el: Element, name: string, renderer: Renderer2): void;
  removeClass?(el: Element, name: string, renderer: Renderer2): void;
  setStyle?(el: Element, style: string, value: string | number, flags: RendererStyleFlags2 | undefined, renderer: Renderer2): void;
  removeStyle?(el: Element, style: string, flags: RendererStyleFlags2 | undefined, renderer: Renderer2): void;
  setProperty?(el: Element, name: string, value: unknown, renderer: Renderer2): void;
  setValue?(node: Node, value: string, renderer: Renderer2): void;
  listen?(target: EventTarget, eventName: string, callback: (event: Event) => boolean | void, renderer: Renderer2): () => void;
}

export const RENDER_INTERCEPTORS = new InjectionToken<RenderInterceptor[]>('RenderInterceptors');

export class InterceptingRenderer implements Renderer2 {
  destroyNode = null;

  get data(): Record<string, any> {
    return this.delegate.data;
  }

  constructor(
    private delegate: Renderer2,
    private interceptor: RenderInterceptor,
  ) {}

  destroy(): void {
    this.delegate.destroy();
  }

  createElement(name: string, namespace?: string): Element {
    if (this.interceptor.createElement != null) {
      return this.interceptor.createElement(name, namespace, this.delegate);
    }
    return this.delegate.createElement(name, namespace);
  }

  createComment(value: string): Comment {
    if (this.interceptor.createComment != null) {
      return this.interceptor.createComment(value, this.delegate);
    }
    return this.delegate.createComment(value);
  }

  createText(value: string): Text {
    if (this.interceptor.createText != null) {
      return this.interceptor.createText(value, this.delegate);
    }
    return this.delegate.createText(value);
  }

  appendChild(parent: Node, newChild: Node): void {
    if (this.interceptor.appendChild != null) {
      return this.interceptor.appendChild(parent, newChild, this.delegate);
    }
    return this.delegate.appendChild(parent, newChild);
  }

  insertBefore(parent: Node, newChild: Node, refChild: Node): void {
    if (this.interceptor.insertBefore != null) {
      return this.interceptor.insertBefore(parent, newChild, refChild, this.delegate);
    }
    return this.delegate.insertBefore(parent, newChild, refChild);
  }

  removeChild(parent: Node, oldChild: Node, isHostElement?: boolean): void {
    if (this.interceptor.removeChild != null) {
      return this.interceptor.removeChild(parent, oldChild, isHostElement, this.delegate);
    }
    return this.delegate.removeChild(parent, oldChild, isHostElement);
  }

  selectRootElement(selectorOrNode: string | Node, preserveContent?: boolean): Element {
    if (this.interceptor.selectRootElement != null) {
      return this.interceptor.selectRootElement(selectorOrNode, preserveContent, this.delegate);
    }
    return this.delegate.selectRootElement(selectorOrNode, preserveContent);
  }

  parentNode(node: Node): Node {
    if (this.interceptor.parentNode != null) {
      return this.interceptor.parentNode(node, this.delegate);
    }
    return this.delegate.parentNode(node);
  }

  childNodes(node: Node): NodeList {
    if (this.interceptor.childNodes != null) {
      return this.interceptor.childNodes(node, this.delegate);
    }
    return this.delegate.childNodes(node);
  }

  nextSibling(node: Node): Node {
    if (this.interceptor.nextSibling != null) {
      return this.interceptor.nextSibling(node, this.delegate);
    }
    return this.delegate.nextSibling(node);
  }

  setAttribute(el: Element, name: string, value: string, namespace?: string): void {
    if (this.interceptor.setAttribute != null) {
      return this.interceptor.setAttribute(el, name, value, namespace, this.delegate);
    }
    return this.delegate.setAttribute(el, name, value, namespace);
  }

  removeAttribute(el: Element, name: string, namespace?: string): void {
    if (this.interceptor.removeAttribute != null) {
      return this.interceptor.removeAttribute(el, name, namespace, this.delegate);
    }
    return this.delegate.removeAttribute(el, name, namespace);
  }

  addClass(el: Element, name: string): void {
    if (this.interceptor.addClass != null) {
      return this.interceptor.addClass(el, name, this.delegate);
    }
    return this.delegate.addClass(el, name);
  }

  removeClass(el: Element, name: string): void {
    if (this.interceptor.removeClass != null) {
      return this.interceptor.removeClass(el, name, this.delegate);
    }
    return this.delegate.removeClass(el, name);
  }

  setStyle(el: Element, style: string, value: string | number, flags?: RendererStyleFlags2): void {
    if (this.interceptor.setStyle != null) {
      return this.interceptor.setStyle(el, style, value, flags, this.delegate);
    }
    return this.delegate.setStyle(el, style, value, flags);
  }

  removeStyle(el: Element, style: string, flags?: RendererStyleFlags2): void {
    if (this.interceptor.removeStyle != null) {
      return this.interceptor.removeStyle(el, style, flags, this.delegate);
    }
    return this.delegate.removeStyle(el, style, flags);
  }

  setProperty(el: Element, name: string, value: unknown): void {
    if (this.interceptor.setProperty != null) {
      return this.interceptor.setProperty(el, name, value, this.delegate);
    }
    return this.delegate.setProperty(el, name, value);
  }

  setValue(node: Node, value: string): void {
    if (this.interceptor.setValue != null) {
      return this.interceptor.setValue(node, value, this.delegate);
    }
    return this.delegate.setValue(node, value);
  }

  listen(target: EventTarget, eventName: string, callback: (event: Event) => boolean | void): () => void {
    if (this.interceptor.listen != null) {
      return this.interceptor.listen(target, eventName, callback, this.delegate);
    }
    return this.delegate.listen(target, eventName, callback);
  }
}

export function createInterceptingRenderer(renderer: Renderer2, interceptors: RenderInterceptor[]) {
  let result = renderer;

  for (let i = 0; i < interceptors.length; i++) {
    result = new InterceptingRenderer(result, interceptors[i]);
  }

  return result;
}

@Component({
  selector: 'ng-renderer-retriever',
  template: '',
})
export class RendererRetriever {
  constructor(
    public renderer: Renderer2,
  ) {}
}
