import { Component, OnInit } from '@angular/core';
import { GenDataService } from './gen-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  showContent = <any>String;

  constructor(private service:GenDataService,private router: Router){


  }

  ngOnInit(){
    this.service.observeShowContent.subscribe(message => this.showContent = message);
    this.router.navigate(['']);
  }

}
