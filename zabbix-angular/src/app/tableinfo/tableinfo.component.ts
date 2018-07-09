import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';


@Component({
  selector: 'app-tableinfo',
  templateUrl: './tableinfo.component.html',
  styleUrls: ['./tableinfo.component.css']
})
export class TableinfoComponent implements OnInit {

  constructor(private service:GenDataService){

  }

  ngOnInit() {
  }

  onClickMe() {
    this.service.initVars();
  }

}
