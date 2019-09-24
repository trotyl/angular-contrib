import { NgModule } from '@angular/core';
import { RENDER_INTERCEPTORS } from '../render-intercept/render-intercept';
import { ContribRenderInterceptModule } from '../render-intercept/render-intercept.module';
import { RendererExtensionInterceptor } from './render-extension';

declare module '@angular/core' {
  interface Renderer2 {
    childNodes(node: Node): NodeList;
  }
}

@NgModule({
  imports: [
    ContribRenderInterceptModule,
  ],
  providers: [
    { provide: RENDER_INTERCEPTORS, multi: true, useClass: RendererExtensionInterceptor },
  ]
})
export class ContribRenderExtensionModule {}
