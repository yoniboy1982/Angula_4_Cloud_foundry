import { OsdDataService } from './osd-data.service';
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
import { ViewIsnewComponent } from './view-isnew/view-isnew.component';
import { HtmlRegionComponent } from './html-region/html-region.component';
import { HtmlChartComponent } from './html-chart/html-chart.component';
import { OsdComponent } from './osd/osd.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './filter.pipe';
import { LocationPipe } from './location.pipe';
import { SumPipe } from './sum.pipe';
import { SumVirtPipe } from './sum-virt.pipe';
import { SumPhysicalPipe } from './sum-physical.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BodyComponent,
    LoaderComponent,
    LdtComponent,
    LaposComponent,
    TableinfoComponent,
    ButtonComponent,
    ViewIsnewComponent,
    HtmlRegionComponent,
    HtmlChartComponent,
    OsdComponent,
    FilterPipe,
    LocationPipe,
    SumPipe,
    SumVirtPipe,
    SumPhysicalPipe,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([
      {path : '' , component : BodyComponent},
      {path : 'ldt' , component : LdtComponent},
      {path : 'lapos' , component : LaposComponent},
      {path : 'isNew' , component : ViewIsnewComponent},
      {path : 'charts' , component : HtmlChartComponent},
      {path : 'osd' , component : OsdComponent}
    ])
  ],
  providers: [GenDataService,OsdDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
