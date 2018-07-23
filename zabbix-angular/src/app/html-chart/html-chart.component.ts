import { Component, OnInit, AfterContentInit, AfterViewInit,ViewChildren } from '@angular/core';
import { Chart } from 'chart.js';
import { ZFunctionsService } from './../z-functions.service';
import { SorterService } from './../sorter.service';
import { GenDataService } from '../gen-data.service';
import { getLocaleMonthNames } from '../../../node_modules/@angular/common';


@Component({
  selector: 'app-html-chart',
  templateUrl: './html-chart.component.html',
  styleUrls: ['./html-chart.component.css']
})
export class HtmlChartComponent implements OnInit {

  
  weatherDates = [];
  temp_max = []
  temp_min = []

  dist = <any>{};
  total = <any>{};
  sum = <any>{};
  selectedRegion = <any>String;

  title= "Lapos - is Lapos/Non Lapos";
  tableclass = "tableTagRed";
  year;
  collapse = false;
  chartsArr = [30,90,180];
  charts = [];
  chart = [];
  chartData = {};
  chartOptions = {};

  constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){

  }

  ngOnInit(){

        var that = this;
        that.year = this.service.year;

        that.chartData = {
          labels: [],
          datasets: [
            // {
            //   data: this.temp_max,
            //   borderColor: '#3cba9f',
            //   fill: false
            // },
            // {
            //   data: this.temp_min,
            //   borderColor: '#ffcc00',
            //   fill: false
            // },
          ]
        };


        this.service.observeMessage.subscribe(message => this.dist = message);
        this.service.observeTotal.subscribe(message => this.total = message);
        this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);

        this.service.observeSum.subscribe(message => {

          this.sum = getParams(message)

          function getParams(message){
            // debugger;
            that.selectedRegion = (that.selectedRegion === '') ? 'AMER' : that.selectedRegion;
            
            var arrLocal = {
              'isLaposp' : [],
              'isLaposv' : [],
              'nonLaposp' : [],
              'nonLaposv' : [],
            };
            

            for (let k of that.zFunctions.objectKeys(message[that.selectedRegion])) {
           
              that.chartData['labels'].push(k);

              var laposObj = message[that.selectedRegion][k].Lapos;

              arrLocal['isLaposp'].push(laposObj.isLapos.p);
              arrLocal['isLaposv'].push(laposObj.isLapos.v);
              arrLocal['nonLaposp'].push(laposObj.nonLapos.p);
              arrLocal['nonLaposv'].push(laposObj.nonLapos.v);

            }

            var Lapos_p = {
              label: "Lapos physical",
              backgroundColor: 'rgba(99, 255, 132, 0.2)',
              borderColor: 'rgba(99, 255, 132, 1)',
              borderWidth: 1,
              data: arrLocal['isLaposp'],
          }
            var Lapos_v = {
              label: "Lapos virtual",
              backgroundColor: 'rgba(187,205,151,0.5)',
              borderColor: 'rgba(99, 255, 132, 1)',
              borderWidth: 1,
              data: arrLocal['isLaposv'],
          }

            var non_Lapos_p = {
              label: "Non Lapos physical",
              backgroundColor: 'rgba(99, 255, 132, 0.2)',
              borderColor: 'rgba(99, 255, 132, 1)',
              borderWidth: 1,
              data: arrLocal['nonLaposp'],
          }

            var non_Lapos_v = {
              label: "Non Lapos virtual",
              backgroundColor: 'rgba(99, 255, 132, 0.2)',
              borderColor: 'rgba(99, 255, 132, 1)',
              borderWidth: 1,
              data: arrLocal['nonLaposv'],
          }

            that.chartData['datasets'].push(Lapos_p)
            that.chartData['datasets'].push(Lapos_v)
            that.chartData['datasets'].push(non_Lapos_p)
            that.chartData['datasets'].push(non_Lapos_v)

          }

        });


        this.chartOptions = {
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

        // this.chart = new Chart('canvas', {
        //   type: 'line',
        //   data: this.chartData,
        //   options: this.chartOptions 
        // })
        
        for (let i = 0; i < this.chartsArr.length; i++) {
          this.charts.push(i);
          // this.charts.push();
    
        }
  }

  ngAfterViewInit() {

    
      for (let i = 0; i < this.chartsArr.length; i++) {
        
        var canvas = 'canvas' + i.toString();
        
          var inChart = new Chart(canvas, {
            type: 'bar',
            data: this.chartData,
            options: this.chartOptions 
          });
          
          // debugger;
          this.charts.push(inChart);
        }
        // console.log(this.chart)
        console.log(this.charts)
  }        
}
