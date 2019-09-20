import { ContribNgForInModule, ContribNgHostModule } from '@angular-contrib/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ContribNgForInModule,
    ContribNgHostModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
