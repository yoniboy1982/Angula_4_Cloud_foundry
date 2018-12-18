// import { HtmlChartComponent } from './../html-chart/html-chart.component';
import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';


@Component({
  selector: 'app-tableinfo',
  templateUrl: './tableinfo.component.html',
  styleUrls: ['./tableinfo.component.css']
})
export class TableinfoComponent implements OnInit {

  constructor(private service:GenDataService){
    
  }
  
  ngOnInit() {
  }

  onClickMe($event) {
    var year = parseInt($event.target.innerText);
    this.service.initVars(year);
  }

}
