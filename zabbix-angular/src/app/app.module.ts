import { GenDataService } from './gen-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { BodyComponent } from './body/body.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BodyComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GenDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
