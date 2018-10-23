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
    // $('.menuWrap ul').attr('visibility','hidden');

    $('.menuWrap1').click(function(){
      if ( $('.menuWrap1 ul').css('visibility') == 'hidden' ){
        $('.menuWrap1 ul').css('visibility','visible');
        $('.menuWrap2 ul').css('visibility','hidden');
      }else{
        $('.menuWrap1 ul').css('visibility','hidden');
      }
    });

    $('.menuWrap2').click(function(){
      if ( $('.menuWrap2 ul').css('visibility') == 'hidden' ){
        $('.menuWrap2 ul').css('visibility','visible');
        $('.menuWrap1 ul').css('visibility','hidden');
      }else
        $('.menuWrap2 ul').css('visibility','hidden');
    });
  }

}
