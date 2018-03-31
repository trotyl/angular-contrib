import { Inject, KeyValueDiffers, KeyValueDifferFactory, ModuleWithProviders, NgModule } from '@angular/core';
import { KEY_VALUE_DIFFER_FACTORIES } from './key-value-differs';

@NgModule()
export class KeyValueDiffersModule {
  constructor(
    keyValueDiffers: KeyValueDiffers,
    @Inject(KEY_VALUE_DIFFER_FACTORIES) extraKeyValueDifferFactories: KeyValueDifferFactory[],
  ) {
    keyValueDiffers.factories.splice(0, 0, ...extraKeyValueDifferFactories);
  }
}
