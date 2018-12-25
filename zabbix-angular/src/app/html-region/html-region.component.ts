import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';
import {Router} from '@angular/router'



@Component({
  selector: 'app-html-region',
  templateUrl: './html-region.component.html',
  styleUrls: ['./html-region.component.css']
})
export class HtmlRegionComponent implements OnInit {

  regions;
  selectedRegion;
  showRegion = 'showRegion';

  constructor(private service:GenDataService,private router:Router){
    var that = this;
    router.events.subscribe((val) => {

      if(val["url"] === '/charts'){
        that.showRegion = 'hideRegion';
      }else{
        that.showRegion = 'showRegion';
      }
  });
  }

  ngOnInit() {
    this.service.observeRigion.subscribe(region => this.regions = region);
    this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);
  }

  updateRegion(deviceValue) {
    this.service.changeSelected(deviceValue);
  }

}
