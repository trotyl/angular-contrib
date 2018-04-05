import { NgModule } from '@angular/core';
import { IterableDiffersModule, ITERABLE_DIFFER_FACTORIES } from '../iterable-differs/index';
import { FastIterableDifferFactory } from './fast-iterable-differ';

@NgModule({
  imports: [
    IterableDiffersModule,
  ],
  providers: [
    { provide: ITERABLE_DIFFER_FACTORIES, useClass: FastIterableDifferFactory },
  ],
})
export class FastIterableDifferModule { }
