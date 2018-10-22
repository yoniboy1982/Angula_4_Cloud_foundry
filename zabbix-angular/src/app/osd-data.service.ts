import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
  
})
export class OsdDataService {

  osdata: any;
  constructor(public Http:HttpClient) { 
    this.getData();
  }

  getData(){
    return this.Http.get('https://linuxinfra.wdf.sap.corp/ldt/reports/osd.php?query=1&time=180')
    .subscribe(data=>{
      this.osdata = data;
      console.log(data);
    })
  }
}
