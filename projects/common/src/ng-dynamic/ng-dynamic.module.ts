import { NgModule } from '@angular/core';
import { ContribRenderExtensionModule } from '@angular-contrib/core';
import { NgDynamic } from './ng-dynamic';

@NgModule({
  imports: [
    ContribRenderExtensionModule,
  ],
  declarations: [
    NgDynamic,
  ],
  exports: [
    NgDynamic,
  ],
})
export class ContribNgDynamicModule {}
