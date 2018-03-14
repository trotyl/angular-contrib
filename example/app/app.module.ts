import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ForInModule } from '../lib';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ForInModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
