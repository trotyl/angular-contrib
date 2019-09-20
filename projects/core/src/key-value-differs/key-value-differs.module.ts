import { Inject, KeyValueDiffers, KeyValueDifferFactory, NgModule } from '@angular/core';
import { KEY_VALUE_DIFFER_FACTORIES } from './key-value-differs';

@NgModule()
export class ContribKeyValueDiffersModule {
  constructor(
    keyValueDiffers: KeyValueDiffers,
    @Inject(KEY_VALUE_DIFFER_FACTORIES) extraKeyValueDifferFactories: KeyValueDifferFactory[],
  ) {
    // tslint:disable-next-line:deprecation
    keyValueDiffers.factories.unshift(...extraKeyValueDifferFactories.reverse());
  }
}
