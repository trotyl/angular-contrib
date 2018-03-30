import { Inject, IterableDiffers, IterableDifferFactory, ModuleWithProviders, NgModule } from '@angular/core';
import { ITERABLE_DIFFER_FACTORIES } from './iterable-differs';

@NgModule()
export class IterableDiffersModule {
  static extend(factories: IterableDifferFactory[]): ModuleWithProviders {
    return {
      ngModule: IterableDiffersModule,
      providers: [
        { provide: ITERABLE_DIFFER_FACTORIES, useValue: factories },
      ],
    };
  }

  constructor(
    iterableDiffers: IterableDiffers,
    @Inject(ITERABLE_DIFFER_FACTORIES) extraIterableDifferFactories: IterableDifferFactory[],
  ) {
    iterableDiffers.factories.splice(0, 0, ...extraIterableDifferFactories);
  }
}
