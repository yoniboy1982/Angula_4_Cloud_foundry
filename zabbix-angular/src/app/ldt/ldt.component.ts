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

  dist = <any>{};
  total = <any>{};
  sum = <any>{};
  selectedRegion = <any>String;

  title = "LDT - is Secure/non Secure";
  tableclass = "tableTagBlue";
  year;
  collapse = false;

  constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){
  }

  ngOnInit() {
    this.service.observeMessage.subscribe(message => this.dist = message);
    this.service.observeTotal.subscribe(message => this.total = message);
    this.service.observeSum.subscribe(message => this.sum = message);
    this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);

    this.year = "Past 30 Days";

  }

  ngAfterContentInit(){
    this.sorter.makeAllSortable(document.body);
    console.log("fff",this.service.sumObj)
    console.log("xxx",this.zFunctions.objectKeys(this.dist[this.selectedRegion]))
    console.log("aaa",this.zFunctions.objectKeys(this.sum[this.selectedRegion]))
    console.log("yyy",this.sum[this.selectedRegion])
  }


  iteration(index, item,selectedRegion,sum) {
    debugger;
    // console.log('kkkk', index, item,selectedRegion,sum);
    return item;
  }
  
  onClickMeGen(){
    this.collapse = !this.collapse;
  }

  reciveMessage($event){
    this.onClickMeGen()
  }
}
