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
  titleTop = "LDT - is Secure/non Secure";
  collapse = false;
  sum = {};

  constructor(private service:GenDataService, private sorter:SorterService){

  }

  ngOnInit() {
    this.service.observeMessage.subscribe(message => this.dist = message);
    this.service.observeTotal.subscribe(message => {
      this.total = message
    });
    this.service.observeSum.subscribe(message => {
      this.sum = message
    });
  }

  ngAfterContentInit(){
    this.sorter.makeAllSortable(document.body);

  }
  onClickMeGen(){
    this.collapse = !this.collapse;
  }

  reciveMessage($event){
    debugger;
    this.onClickMeGen()
  }
  objectKeys(obj) {
    return Object.keys(obj);
  }

}
