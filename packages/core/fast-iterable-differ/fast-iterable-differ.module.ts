import { NgModule } from '@angular/core';
import { ContribIterableDiffersModule, ITERABLE_DIFFER_FACTORIES } from '../iterable-differs/index';
import { FastIterableDifferFactory } from './fast-iterable-differ';

@NgModule({
  imports: [
    ContribIterableDiffersModule,
  ],
  providers: [
    { provide: ITERABLE_DIFFER_FACTORIES, useClass: FastIterableDifferFactory },
  ],
})
export class ContribFastIterableDifferModule { }
