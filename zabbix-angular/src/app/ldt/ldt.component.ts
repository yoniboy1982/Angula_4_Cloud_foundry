import { ZFunctionsService } from './../z-functions.service';
import { SorterService } from './../sorter.service';
import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';

@Component({
  selector: 'app-ldt',
  templateUrl: './ldt.component.html',
  styleUrls: ['./ldt.component.css']
})
export class LdtComponent implements OnInit {

  dist = {};
  total = {};
  sum = {};

  title = "LDT - is Secure/non Secure";
  tableclass = "tableTagBlue"
  collapse = false;

  constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){
  }

  ngOnInit() {
    this.service.observeMessage.subscribe(message => this.dist = message);
    this.service.observeTotal.subscribe(message => this.total = message);
    this.service.observeSum.subscribe(message => this.sum = message);
  }

  ngAfterContentInit(){
    this.sorter.makeAllSortable(document.body);
  }
  onClickMeGen(){
    this.collapse = !this.collapse;
  }

  reciveMessage($event){
    this.onClickMeGen()
  }
}
