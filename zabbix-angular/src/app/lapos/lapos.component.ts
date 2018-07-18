import { ZFunctionsService } from './../z-functions.service';
import { SorterService } from './../sorter.service';
import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';

@Component({
  selector: 'app-lapos',
  templateUrl: './lapos.component.html',
  styleUrls: ['./lapos.component.css']
})
export class LaposComponent implements OnInit {

  dist = <any>{};
  total = <any>{};
  sum = <any>{};
  selectedRegion = <any>String;

  title= "Lapos - is Lapos/Non Lapos";
  tableclass = "tableTagRed";
  year;
  collapse = false;


  constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){

  }

  ngOnInit() {
    this.service.observeMessage.subscribe(message => this.dist = message);
    this.service.observeTotal.subscribe(message => this.total = message);
    this.service.observeSum.subscribe(message => this.sum = message);
    this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);

    this.year = this.service.year;

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
