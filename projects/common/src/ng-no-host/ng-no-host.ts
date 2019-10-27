import { RenderInterceptor } from '@angular-contrib/core';
import { Renderer2 } from '@angular/core';

function isNoHostAttribute(name: string): boolean {
  return (
    name.length === 8 &&
    (name[0] === 'N' || name[0] === 'n') &&
    (name[1] === 'G' || name[1] === 'g') &&
    (name[2] === 'N' || name[2] === 'n') &&
    (name[3] === 'O' || name[3] === 'o') &&
    (name[4] === 'H' || name[4] === 'h') &&
    (name[5] === 'O' || name[5] === 'o') &&
    (name[6] === 'S' || name[6] === 's') &&
    (name[7] === 'T' || name[7] === 't')
  );
}

export class NoHostInterceptor implements RenderInterceptor {
  private markersMap = new WeakMap<Node, [Comment, Comment]>();
  private pendingInitElements = new WeakSet<Node>();

  setAttribute(el: Element, name: string, value: string, namespace: string | undefined, renderer: Renderer2): void {
    if (!this.markersMap.has(el) && isNoHostAttribute(name)) {
      const startMarker = renderer.createComment(`ngNoHostStart`) as Comment;
      const endMarker = renderer.createComment(`ngNoHostEnd`) as Comment;
      this.markersMap.set(el, [startMarker, endMarker]);

      const parent = renderer.parentNode(el);
      if (parent != null) {
        renderer.insertBefore(parent, startMarker, el);
        renderer.insertBefore(parent, endMarker, el);
        this.extractChildNodes(el, startMarker, endMarker, renderer);
        renderer.removeChild(parent, el);
      } else {
        this.pendingInitElements.add(el);
      }
    }

    renderer.setAttribute(el, name, value, namespace);
  }

  removeAttribute(el: Element, name: string, namespace: string | undefined, renderer: Renderer2): void {
    if (this.markersMap.has(el) && isNoHostAttribute(name) && !this.pendingInitElements.has(el)) {
      const [startMarker, endMarker] = this.markersMap.get(el)!;
      this.markersMap.delete(el);

      const parent = renderer.parentNode(startMarker);
      renderer.insertBefore(parent, el, startMarker);
      this.restoreChildNodes(el, startMarker, endMarker, renderer);
      renderer.removeChild(parent, startMarker);
      renderer.removeChild(parent, endMarker);
    }

    renderer.removeAttribute(el, name, namespace);
  }

  appendChild(parent: Node, newChild: Node, renderer: Renderer2): void {
    if (this.markersMap.has(parent) && !this.pendingInitElements.has(parent)) {
      const [, endMarker] = this.markersMap.get(parent)!;
      renderer.insertBefore(renderer.parentNode(endMarker), newChild, endMarker);
      return;
    }

    if (this.markersMap.has(newChild)) {
      const el = newChild as Element;
      const [startMarker, endMarker] = this.markersMap.get(el)!;
      const notInited = this.pendingInitElements.has(el);

      if (!notInited) {
        this.restoreChildNodes(el, startMarker, endMarker, renderer);
      }

      renderer.appendChild(parent, startMarker);
      renderer.appendChild(parent, endMarker);
      this.extractChildNodes(el, startMarker, endMarker, renderer);

      if (notInited) {
        this.pendingInitElements.delete(el);
      }

      return;
    }

    renderer.appendChild(parent, newChild);
  }

  insertBefore(parent: Node, newChild: Node, refChild: Node, renderer: Renderer2): void {
    if (this.markersMap.has(parent) && !this.pendingInitElements.has(parent)) {
      const [startMarker] = this.markersMap.get(parent)!;
      renderer.insertBefore(renderer.parentNode(startMarker), newChild, refChild);
      return;
    }

    if (this.markersMap.has(newChild)) {
      const el = newChild as Element;
      const [startMarker, endMarker] = this.markersMap.get(el)!;
      const notInited = this.pendingInitElements.has(el);

      if (!notInited) {
        this.restoreChildNodes(el, startMarker, endMarker, renderer);
      }

      renderer.insertBefore(parent, startMarker, refChild);
      renderer.insertBefore(parent, endMarker, refChild);
      this.extractChildNodes(el, startMarker, endMarker, renderer);

      if (notInited) {
        this.pendingInitElements.delete(el);
      }

      return;
    }

    renderer.insertBefore(parent, newChild, refChild);
  }

  removeChild(parent: Node, oldChild: Node, isHostElement: boolean | undefined, renderer: Renderer2): void {
    if (this.markersMap.has(parent) && !this.pendingInitElements.has(parent)) {
      const [startMarker] = this.markersMap.get(parent as Element)!;
      renderer.removeChild(renderer.parentNode(startMarker), oldChild, isHostElement);
      return;
    }

    if (this.markersMap.has(oldChild) && !this.pendingInitElements.has(oldChild)) {
      const el = oldChild as Element;
      const [startMarker, endMarker] = this.markersMap.get(el)!;
      this.restoreChildNodes(el, startMarker, endMarker, renderer);
      renderer.removeChild(parent, startMarker);
      renderer.removeChild(parent, endMarker);
      return;
    }

    renderer.removeChild(parent, oldChild, isHostElement);
  }

  private extractChildNodes(el: Element, startMarker: Comment, endMarker: Comment, renderer: Renderer2): void {
    const parent = renderer.parentNode(startMarker);
    const childNodes = renderer.childNodes(el);
    const originalChildNodes = Array.from(childNodes);

    for (let i = 0; i < originalChildNodes.length; i++) {
      const childNode = originalChildNodes[i];
      renderer.insertBefore(parent, childNode, endMarker);
    }
  }

  private restoreChildNodes(el: Element, startMarker: Comment, endMarker: Comment, renderer: Renderer2): void {
    let childNode = renderer.nextSibling(startMarker);

    while (childNode != null && childNode !== endMarker) {
      const nextSibling = renderer.nextSibling(childNode);
      renderer.appendChild(el, childNode);
      childNode = nextSibling;
    }
  }
}
