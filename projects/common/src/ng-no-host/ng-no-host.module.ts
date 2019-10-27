import { NgModule } from '@angular/core';
import { NoHostInterceptor } from './ng-no-host';
import { RENDER_INTERCEPTORS, ContribRenderInterceptModule, ContribRenderExtensionModule } from '@angular-contrib/core';

@NgModule({
  declarations: [],
  exports: [
    ContribRenderInterceptModule,
    ContribRenderExtensionModule,
  ],
  providers: [
    { provide: RENDER_INTERCEPTORS, multi: true, useClass: NoHostInterceptor },
  ],
})
export class ContribNgNoHostModule {}
