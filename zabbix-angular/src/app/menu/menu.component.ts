import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  arr:Array<String>;
  title:String;
  constructor() {
    this.arr = [];
    this.title = 'LDT Clients - General';
   }

  ngOnInit() {
var that = this;
    $(".dropdown div a").click( function() {
      var title = $(this).text();
      var pretitle = $(this).parent().attr('data-title');
      that.title = pretitle + ' - ' +title;
  });
  }

}
