import { SorterService } from './../sorter.service';
import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-ldt',
  templateUrl: './ldt.component.html',
  styleUrls: ['./ldt.component.css']
})
export class LdtComponent implements OnInit {

  dist = {};
  total = {};

  constructor(private service:GenDataService, private sorter:SorterService){

  }

  ngOnInit() {
    this.service.observeMessage.subscribe(message => this.dist = message);
    this.service.observeTotal.subscribe(message => {
      this.total = message
    });
  }

  ngAfterContentInit(){
    this.sorter.makeAllSortable(document.body);

  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

}
