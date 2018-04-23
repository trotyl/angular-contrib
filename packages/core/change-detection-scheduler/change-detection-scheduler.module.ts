import { ComponentFactoryResolver, Injector, NgModule, RendererFactory2 } from '@angular/core';
import { ChangeDetectionScheduler, ChangeDetectionScheduler_, ChangeDetectionSchedulerInitializer } from './change-detection-scheduler';

@NgModule({
  declarations: [ ChangeDetectionSchedulerInitializer ],
  entryComponents: [ ChangeDetectionSchedulerInitializer ],
  providers: [
    { provide: ChangeDetectionScheduler, useClass: ChangeDetectionScheduler_ },
  ],
})
export class ContribChangeDetectionSchedulerModule {
  constructor(cfResolver: ComponentFactoryResolver, injector: Injector, rendererFactory: RendererFactory2) {
    const componentFactory = cfResolver.resolveComponentFactory(ChangeDetectionSchedulerInitializer);
    const renderer = rendererFactory.createRenderer(null, null);
    const host = renderer.createElement('div');
    const componentRef = componentFactory.create(injector, undefined, host);
    componentRef.destroy();
  }
}
