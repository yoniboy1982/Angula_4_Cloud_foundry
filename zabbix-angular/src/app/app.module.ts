import { GenDataService } from './gen-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';


import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { BodyComponent } from './body/body.component';
import { LoaderComponent } from './loader/loader.component';
import { LdtComponent } from './ldt/ldt.component';
import { LaposComponent } from './lapos/lapos.component';
import { TableinfoComponent } from './tableinfo/tableinfo.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BodyComponent,
    LoaderComponent,
    LdtComponent,
    LaposComponent,
    TableinfoComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path : '' , component : BodyComponent},
      {path : 'ldt' , component : LdtComponent},
      {path : 'lapos' , component : LaposComponent},
    ])
  ],
  providers: [GenDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
