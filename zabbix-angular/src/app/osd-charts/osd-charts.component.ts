import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenDataService } from '../gen-data.service';

@Component({
  selector: 'app-osd-charts',
  templateUrl: './osd-charts.component.html',
  styleUrls: ['./osd-charts.component.css']
})
export class OsdChartsComponent implements OnInit {

  records:any;
  profiles = [];
  profile:String;
  selectedRegion = <any>String;
  // total = 0;
  total = <any>{};
  sum = <any>{};
  isLoaded:Boolean;
  

  constructor(private Http:HttpClient,private service:GenDataService,) { 
    this.records = []
    this.isLoaded = false;
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    return this.Http.get('https://linuxinfra.wdf.sap.corp/ldt/reports/osd.php?query=1&time=30')
    .subscribe(data=>{
      this.records = data;
    debugger;
      // get profiles
      for (let index = 0; index < this.records.length; index++) {
        const element = this.records[index];
        if(this.profiles.indexOf(element.name) === -1) {
          this.profiles.push(element.name);
        }
        // this.createTotalObj(element)
        // this.createSumObj(element)
      }

      this.isLoaded = true;//now load all the charts
      
      this.profiles.unshift('All') 
      this.profile = this.profiles[0];

    })
  }

}
