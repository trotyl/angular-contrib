import { NgModule } from '@angular/core';
import { NgSwitchCasePatcher, NgSwitchDefaultPatcher, NgSwitchPatcher } from './switch-continue';

@NgModule({
  declarations: [ NgSwitchPatcher, NgSwitchCasePatcher, NgSwitchDefaultPatcher ],
  exports: [ NgSwitchPatcher, NgSwitchCasePatcher, NgSwitchDefaultPatcher ],
})
export class ContribNgSwitchContinueModule { }
