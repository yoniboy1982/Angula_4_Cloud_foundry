import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenDataService } from '../gen-data.service';

@Component({
  selector: 'app-osd',
  templateUrl: './osd.component.html',
  styleUrls: ['./osd.component.css']
})
export class OsdComponent implements OnInit {

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
    this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);
    this.getData();
  }

  getData(){
    return this.Http.get('https://linuxinfra.wdf.sap.corp/ldt/reports/osd.php?query=2&time=30')
    .subscribe(data=>{
      this.records = data;
    
      // get profiles
      for (let index = 0; index < this.records.length; index++) {
        const element = this.records[index];
        if(this.profiles.indexOf(element.name) === -1) {
          this.profiles.push(element.name);
        }
        this.createTotalObj(element)
        this.createSumObj(element)
      }

      this.isLoaded = true;//now load all the charts
      
      this.profiles.unshift('All') 
      this.profile = this.profiles[0];

    })
  }

  createTotalObj(element){
    this.total[element.region] = this.total[element.region] || {};
    this.total[element.region] = this.total[element.region] || {};
    this.total[element.region]['total'] = this.total[element.region]['total'] || 0;
    this.total[element.region]['virtual'] = this.total[element.region]['virtual'] || 0;
    this.total[element.region]['physical'] = this.total[element.region]['physical'] || 0;

    this.total[element.region]['total'] += parseInt(element.total)
    this.total[element.region]['virtual'] += parseInt(element.virtual)
    this.total[element.region]['physical'] += parseInt(element.physical)
    
    this.total["TOTAL"] = this.total["TOTAL"] || {};
    this.total["TOTAL"]['isVirt'] = this.total["TOTAL"]['isVirt'] || 0;
    this.total["TOTAL"]['physical'] = this.total["TOTAL"]['physical'] || 0;        
    this.total["TOTAL"]['isVirt'] += parseInt(element.virtual)
    this.total["TOTAL"]['physical'] += parseInt(element.physical)
  }

  createSumObj(element){
    this.sum["TOTAL"] = this.sum["TOTAL"] || {};
    this.sum["TOTAL"][element.dist] = this.sum["TOTAL"][element.dist] || {};
    this.sum["TOTAL"][element.dist]['total'] = this.sum["TOTAL"][element.dist]['total'] || 0;
    this.sum["TOTAL"][element.dist]['isVirt'] = this.sum["TOTAL"][element.dist]['isVirt'] || 0;
    this.sum["TOTAL"][element.dist]['physical'] = this.sum["TOTAL"][element.dist]['physical'] || 0;

    this.sum["TOTAL"][element.dist]['total'] += parseInt(element.total)
    this.sum["TOTAL"][element.dist]['isVirt'] += parseInt(element.virtual)
    this.sum["TOTAL"][element.dist]['physical'] += parseInt(element.physical)
  }

  updateProfile(profile){
    this.profile = profile;
  }

}
