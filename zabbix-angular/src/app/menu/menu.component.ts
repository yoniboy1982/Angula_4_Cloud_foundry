import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  arr:Array<String>;
  title:String;
  year:Number;
  rrouter:any;

    constructor(private router: Router) {
      this.arr = [];
      this.title = 'LDT Active client - General';
      this.year = (new Date()).getFullYear()
      this.rrouter = router;
    }

  ngOnInit() {

    var that = this;
    $(".drop-last").click( function() {

      var title = $(this).text();
      var pretitle = $(this).parent().attr('data-title');
      that.title = pretitle + ' - ' +title;
    });
    $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
      if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
      }
      var $subMenu = $(this).next(".dropdown-menu");
      $subMenu.toggleClass('show');
    
    
      $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
        $('.dropdown-submenu .show').removeClass("show");
      });
    
    
      return false;
    });    
  }

}
