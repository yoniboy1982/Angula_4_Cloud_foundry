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
  constructor(private Http:HttpClient) { 
    
  }

  ngOnInit() {
    this.getData();
    // this.records = this.osd.osdata;
    // debugger;
  }


  getData(){
    return this.Http.get('https://linuxinfra.wdf.sap.corp/ldt/reports/osd.php?query=1&time=180')
    .subscribe(data=>{
      this.records = data;

      for (let index = 0; index < this.records.length; index++) {
        const element = this.records[index];
        if(this.profiles.indexOf(element.name) === -1) {
          this.profiles.push(element.name);
          console.log(element.name);
        }
      }


    })
  }

  

}
