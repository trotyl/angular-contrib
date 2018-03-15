import { ForInModule, HostModule } from '@angular-contrib/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ForInModule,
    HostModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
