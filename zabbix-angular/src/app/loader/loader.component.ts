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

  ngOnInit() {

  }

  ngAfterContentInit(){
    for (let i = 0; i < this.service.arr.length; i++) {
      const name = this.service.arr[i];
      $('.listLoading').append('\
                        <li class="list-group-item d-flex justify-content-between align-items-center '+name.replace(/ /g,'')+'">\
                          '+name+'\
                          <span class="badge badge-primary badge-pill xBadge animate"></span>\
                        </li>');
      
    }
  }

}
