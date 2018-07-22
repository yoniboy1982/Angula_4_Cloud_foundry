import { Component, OnInit, AfterContentInit, AfterViewInit,ViewChildren } from '@angular/core';
import { Chart } from 'chart.js';
import { ZFunctionsService } from './../z-functions.service';
import { SorterService } from './../sorter.service';
import { GenDataService } from '../gen-data.service';


@Component({
  selector: 'app-html-chart',
  templateUrl: './html-chart.component.html',
  styleUrls: ['./html-chart.component.css']
})
export class HtmlChartComponent implements OnInit {

  
  weatherDates = ['28','23'];
  temp_max = ['4','7']
  temp_min = ['22','5']

  dist = <any>{};
  total = <any>{};
  sum = <any>{};
  selectedRegion = <any>String;

  title= "Lapos - is Lapos/Non Lapos";
  tableclass = "tableTagRed";
  year;
  collapse = false;
  // chartsArr = [1,2,3,4,5,6];
  // charts = [];
  chart = [];

  constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){

  }



      ngOnInit(){

          this.service.observeMessage.subscribe(message => this.dist = message);
          this.service.observeTotal.subscribe(message => this.total = message);
          this.service.observeSum.subscribe(message => this.sum = message);
          this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);

          this.year = this.service.year;
        var data = {
          labels: this.weatherDates,
          datasets: [
            {
              data: this.temp_max,
              borderColor: '#3cba9f',
              fill: false
            },
            {
              data: this.temp_min,
              borderColor: '#ffcc00',
              fill: false
            },
          ]
        };

        var options = {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }]
          }
        };

        this.chart = new Chart('canvas', {
          type: 'line',
          data: data,
          options: options 
        })

        }

  ngAfterViewInit() {

  // for (let index = 0; index < this.chartsArr.length; index++) {
  //   // const element = this.chartsArr[index];


    
  //   // console.log('canvas-'+index);
  //   // debugger;

  //   // var inChart = new Chart('canvas'+index, {options: options,data: data});
  //   // this.charts.push(inChart);
  // }
  }        
}
