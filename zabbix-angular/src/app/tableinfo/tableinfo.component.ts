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
  // regions=[];
  // selectedRegion;


  constructor(private service:GenDataService){
      // this.regions = this.service.regionArr;
      // this.selectedRegion = this.regions[0];

      this.yearArr = this.service.yearsArr
  }
  
  ngOnInit() {
  }

  onClickMe($event) {
    var year = parseInt($event.target.innerText);
    this.service.initVars(year);
  }

}
