import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GenDataService } from '../gen-data.service';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(private service: GenDataService) { }

  localArr = [];
  ngOnInit() {

  }

  ngAfterContentInit(){

    for (let i = 0; i < this.service.arr.length; i++) {
      const name = this.service.arr[i];
      this.localArr.push(
        {
          'name' : name,
          'concate' : name.replace(/ /g,'')
        }
      )

    }
  }

}
