import { NgModule } from '@angular/core';
import { NgSwitchCasePatcher, NgSwitchDefaultPatcher, NgSwitchPatcher } from './ng-switch-continue';

@NgModule({
  declarations: [ NgSwitchPatcher, NgSwitchCasePatcher, NgSwitchDefaultPatcher ],
  exports: [ NgSwitchPatcher, NgSwitchCasePatcher, NgSwitchDefaultPatcher ],
})
export class ContribNgSwitchContinueModule { }
