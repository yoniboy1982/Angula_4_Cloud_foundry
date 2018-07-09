import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() title:String;
  @Output() messageEvent = new EventEmitter<string>();

  constructor() { 
    
  }

  sendMessage($event){
    this.messageEvent.emit($event)
  }

  ngOnInit() {
  }

}
