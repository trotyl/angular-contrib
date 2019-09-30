import { NgModule, RendererFactory2, Renderer2, RendererType2, Inject, ComponentFactoryResolver, Injector } from '@angular/core';
import { RENDER_INTERCEPTORS, RenderInterceptor, createInterceptingRenderer, RendererRetriever } from './render-intercept';

declare module '@angular/core' {
  interface Renderer2 {
    isExtended?: boolean;
  }
}

function throwMissingChildNodes(): never {
  throw new Error(`Renderer2#childNodes not implemented, did you forget to import ContribRenderExtensionModule?`);
}

function patchRenderer(renderer: Renderer2): void {
  if (renderer.isExtended == null) {
    renderer.isExtended = true;
  }

  if (renderer.childNodes == null) {
    renderer.childNodes = throwMissingChildNodes;
  }
}

function patchExoticRenderer(renderer: Renderer2, delegate: Renderer2): void {
  renderer.childNodes = (node: Node) => delegate.childNodes(node);
}

@NgModule({
  declarations: [
    RendererRetriever,
  ],
  entryComponents: [
    RendererRetriever,
  ],
})
export class ContribRenderInterceptModule {
  private patchedFactories = new WeakSet<RendererFactory2>();

  constructor(
    injector: Injector,
    cfr: ComponentFactoryResolver,
    rendererFactory: RendererFactory2,
    @Inject(RENDER_INTERCEPTORS) interceptors: RenderInterceptor[],
  ) {
    if (!this.patchedFactories.has(rendererFactory)) {
      const originalCreateRenderer = rendererFactory.createRenderer;
      rendererFactory.createRenderer = function(hostElement: Node, type: RendererType2 | null): Renderer2 {
        const originalRenderer = originalCreateRenderer.call(this, hostElement, type);
        patchRenderer(originalRenderer);
        return createInterceptingRenderer(originalRenderer, interceptors);
      };

      const originalBegin = rendererFactory.begin;
      rendererFactory.begin = function(): void {
        if (originalBegin != null) {
          originalBegin.call(this);
        }
        for (let i = 0; i < interceptors.length; i++) {
          const interceptor = interceptors[i];
          if (interceptor.begin != null) {
            interceptor.begin();
          }
        }
      };

      const originalEnd = rendererFactory.end;
      rendererFactory.end = function(): void {
        if (originalEnd != null) {
          originalEnd.call(this);
        }
        for (let i = 0; i < interceptors.length; i++) {
          const interceptor = interceptors[i];
          if (interceptor.end != null) {
            interceptor.end();
          }
        }
      };

      this.patchedFactories.add(rendererFactory);
    }

    const extendedRenderer = rendererFactory.createRenderer(null, null);
    const host = extendedRenderer.createElement('div');
    const componentFactory = cfr.resolveComponentFactory(RendererRetriever);
    const { renderer } = componentFactory.create(injector, undefined, host).instance;

    // DebugRenderer2 maybe in use, require manual patching
    if (renderer.isExtended == null) {
      const proto = Object.getPrototypeOf(renderer);
      if (proto !== Object.prototype) {
        patchExoticRenderer(proto, extendedRenderer);
      }
    }
  }
}
