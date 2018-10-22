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
  total = 0;

  constructor(private Http:HttpClient,private service:GenDataService,) { 
    this.records = []
  }

  ngOnInit() {
    this.service.observeSelectedRigion.subscribe(selected => 
      {
        console.log(selected)
        this.selectedRegion = selected});

    this.getData();
  }

  getData(){
    return this.Http.get('https://linuxinfra.wdf.sap.corp/ldt/reports/osd.php?query=1&time=180')
    .subscribe(data=>{
      this.records = data;

      // get profiles
      for (let index = 0; index < this.records.length; index++) {
        const element = this.records[index];
        if(this.profiles.indexOf(element.name) === -1) {
          this.profiles.push(element.name);
        }
      }

      this.profiles.unshift('All') 
      this.profile = this.profiles[0];

    })
  }

  updateProfile(profile){
    this.profile = profile;
  }

}
