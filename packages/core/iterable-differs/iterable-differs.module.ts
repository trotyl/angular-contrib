import { Inject, IterableDiffers, IterableDifferFactory, NgModule } from '@angular/core';
import { ITERABLE_DIFFER_FACTORIES } from './iterable-differs';

@NgModule()
export class ContribIterableDiffersModule {
  constructor(
    iterableDiffers: IterableDiffers,
    @Inject(ITERABLE_DIFFER_FACTORIES) extraIterableDifferFactories: IterableDifferFactory[],
  ) {
    iterableDiffers.factories.unshift(...extraIterableDifferFactories.slice().reverse());
  }
}
