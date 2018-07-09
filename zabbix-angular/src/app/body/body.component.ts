import { SorterService } from './../sorter.service';
import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { GenDataService } from '../gen-data.service';
import * as $ from 'jquery';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit {

  constructor(private service:GenDataService, private sorter:SorterService){
        
  }

    dist = {};
    total = {};

    timestamp = true;
  
    ngOnInit(){
      this.service.currentMessage.subscribe(message => {
        this.dist = message
      });
      this.service.currentTotal.subscribe(message => {
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



    onClickMe() {
      this.service.initVars(2016);
    }

}
