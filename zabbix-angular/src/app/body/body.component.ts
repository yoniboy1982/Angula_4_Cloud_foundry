import { ZFunctionsService } from './../z-functions.service';
import { SorterService } from './../sorter.service';
import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { GenDataService } from '../gen-data.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit {

  constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){
  }

    dist = {};
    total = {};
    sum = {};

    collapse = false;
    titleTop = "General Physical/Virtual"

    // myClass = "tableTagGreen"

    ngOnInit(){
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
