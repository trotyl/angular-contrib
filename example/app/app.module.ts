import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { MrcCommonModule } from '../lib'

import { AppComponent } from './app.component'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MrcCommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
