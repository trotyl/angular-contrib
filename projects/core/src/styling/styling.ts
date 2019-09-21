import { Injectable, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Styling {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addGlobalStyle(style: string): () => void {
    const styleElement = this.renderer.createElement('style');
    this.renderer.setAttribute(styleElement, 'type', 'text/css');
    this.renderer.setProperty(styleElement, 'textContent', style);

    const doc = this.document as Document;
    this.renderer.appendChild(doc.head, styleElement);

    return () => {
      this.renderer.removeChild(doc.head, styleElement);
    };
  }
}
