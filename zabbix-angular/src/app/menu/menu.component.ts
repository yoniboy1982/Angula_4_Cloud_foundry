import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  arr:Array<String>;

  constructor() {
    this.arr = []
   }

  ngOnInit() {
  }

}
