import { Component, OnInit } from '@angular/core';
import { GenDataService } from './gen-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  showContent = <any>String;

  constructor(private service:GenDataService){


  }

  ngOnInit(){
    this.service.observeShowContent.subscribe(message => this.showContent = message);
  }

}
