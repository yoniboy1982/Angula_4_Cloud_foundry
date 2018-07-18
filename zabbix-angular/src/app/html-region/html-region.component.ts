import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';



@Component({
  selector: 'app-html-region',
  templateUrl: './html-region.component.html',
  styleUrls: ['./html-region.component.css']
})
export class HtmlRegionComponent implements OnInit {

  regions;
  selectedRegion;

  constructor(private service:GenDataService){
  }

  ngOnInit() {
    this.service.observeRigion.subscribe(region => this.regions = region);
    this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);
  }

  updateRegion(deviceValue) {
    this.service.changeSelected(deviceValue);
  }

}
