import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';

@Component({
  selector: 'app-ldt',
  templateUrl: './ldt.component.html',
  styleUrls: ['./ldt.component.css']
})
export class LdtComponent implements OnInit {

  constructor(private service:GenDataService){

  }
  dist = {};

  ngOnInit() {
    this.service.currentMessage.subscribe(message => this.dist = message);
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

}
