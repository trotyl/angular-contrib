import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RendererExtension {
  getChildNodes(node: Node): NodeList {
    return node.childNodes;
  }
}
