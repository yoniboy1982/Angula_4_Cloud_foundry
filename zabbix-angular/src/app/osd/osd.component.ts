import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-osd',
  templateUrl: './osd.component.html',
  styleUrls: ['./osd.component.css']
})
export class OsdComponent implements OnInit {

  records:any;
  profiles = [];
  profile:String;

  constructor(private Http:HttpClient) { 
    this.records = []
  }

  ngOnInit() {
    this.getData();
  }


  getData(){
    return this.Http.get('https://linuxinfra.wdf.sap.corp/ldt/reports/osd.php?query=1&time=180')
    .subscribe(data=>{
      this.records = data;

      for (let index = 0; index < this.records.length; index++) {
        const element = this.records[index];
        if(this.profiles.indexOf(element.name) === -1) {
          this.profiles.push(element.name);
        }
      }
      this.profile = this.profiles[0];

    })
  }

  updateProfile(profile){
    this.profile = profile;
    console.log(this.profile)
  }

  

}
