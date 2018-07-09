import { SorterService } from './../sorter.service';
import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-lapos',
  templateUrl: './lapos.component.html',
  styleUrls: ['./lapos.component.css']
})
export class LaposComponent implements OnInit {

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

    $(document).ready(function(){
      $('.GroupH5').click(function(){
        $(this).next().find('.newLine').toggle();
        $(this).next().find('.trNum').toggle();
      })
    })
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

}
