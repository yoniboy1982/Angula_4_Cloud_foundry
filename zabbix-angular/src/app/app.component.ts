import { Component, OnInit } from '@angular/core';
import { GenDataService } from './gen-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  dist = {};
  constructor(private service:GenDataService){

  }

  ngOnInit(){
    this.service.observeMessage.subscribe(message => {
      this.dist = message;
    });
  }
  
  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }


}
