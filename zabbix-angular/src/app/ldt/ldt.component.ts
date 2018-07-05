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

  constructor(private service:GenDataService, private sorter:SorterService){

  }

  ngOnInit() {
    this.service.currentMessage.subscribe(message => this.dist = message);
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
