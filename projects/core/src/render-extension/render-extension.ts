import { RenderInterceptor } from '../render-intercept/render-intercept';

export class RendererExtensionInterceptor implements RenderInterceptor {
  childNodes(node: Node): NodeList {
    return node.childNodes;
  }
}
