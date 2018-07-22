import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';


@Component({
  selector: 'app-tableinfo',
  templateUrl: './tableinfo.component.html',
  styleUrls: ['./tableinfo.component.css']
})
export class TableinfoComponent implements OnInit {

  currentYear = (new Date()).getFullYear();
  yearArr = [];

  constructor(private service:GenDataService){
      this.yearArr = this.service.yearsArr
  }
  
  ngOnInit() {
  }

  onClickMe($event) {
    var year = parseInt($event.target.innerText);
    this.service.initVars(year);
  }

}
