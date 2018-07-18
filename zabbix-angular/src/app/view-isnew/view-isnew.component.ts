import { ZFunctionsService } from './../z-functions.service';
import { SorterService } from './../sorter.service';
import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';

@Component({
  selector: 'app-view-isnew',
  templateUrl: './view-isnew.component.html',
  styleUrls: ['./view-isnew.component.css']
})
export class ViewIsnewComponent implements OnInit {


  dist = <any>{};
  total = <any>{};
  sum = <any>{};
  selectedRegion = <any>String;

  title= "LDT clients using NewUI";
  tableclass = "tableTagGreen";
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
