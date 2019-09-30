import { NgModule } from '@angular/core';
import { NgObserve, NgObserveStart, NgObserveEnd } from './ng-observe';
import { ContribRenderExtensionModule } from '@angular-contrib/core';

@NgModule({
  declarations: [
    NgObserve, NgObserveStart, NgObserveEnd,
  ],
  imports: [
    ContribRenderExtensionModule,
  ],
  exports: [
    NgObserve, NgObserveStart, NgObserveEnd,
  ],
})
export class ContribNgObserveModule {}
