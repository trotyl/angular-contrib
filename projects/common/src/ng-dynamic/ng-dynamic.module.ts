import { NgModule } from '@angular/core';
import { ContribRenderExtensionModule } from '@angular-contrib/core';
import { ContribNgNoHostModule } from '../ng-no-host/ng-no-host.module';
import { NgDynamic } from './ng-dynamic';

@NgModule({
  imports: [
  ],
  declarations: [
    NgDynamic,
  ],
  exports: [
    ContribRenderExtensionModule,
    ContribNgNoHostModule,
    NgDynamic,
  ],
})
export class ContribNgDynamicModule {}
