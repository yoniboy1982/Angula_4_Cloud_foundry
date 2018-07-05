import { SorterService } from './../sorter.service';
import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  constructor(private service:GenDataService, private sorter:SorterService){
        
  }

    dist = {};
    timestamp = true;
    total = 0;
    physical = 0;
    isVirt = 0;
  
    ngOnInit(){

      
      this.service.currentMessage.subscribe(message => {
        // console.log(message)
        this.dist = message
      });
    }

    getSum(dist){
      // console.log(index,dist)
      // debugger;
      this.total += dist.total;
      this.physical += dist.physical;
      this.isVirt += dist.isVirt;
    }

    getMaa(dist){
      console.log(dist)
      debugger;
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
