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

    chartsArr = [0,0];
    charts = [];
    chart = [];

    chartData = {};
    chartOptions = {};

    ranges = [30,90,180];
    selectedRange;

    arrLocal = {
      "isLapos"  : {
        "v"  : 0,
        "p"  : 0 
      },
      "nonLapos"  : {
        "v"  : 0,
        "p"  : 0 
      },
    };

    constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){

    }

    ngOnInit(){

          var that = this;
          this.year = this.service.year;
          this.selectedRange = this.ranges[0];
          
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

          this.chartData = {
            labels: [],
            datasets: []
          };

          this.service.observeMessage.subscribe(message => this.dist = message);
          this.service.observeTotal.subscribe(message => this.total = message);
          this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);

          this.service.observeSum.subscribe(message => {
              this.sum = getParams(message);
              debugger;
              this.initLaposObj();
              function getParams(message){
                
                that.selectedRegion = (that.selectedRegion === '') ? 'AMER' : that.selectedRegion;
              

                for (let k of that.zFunctions.objectKeys(message[that.selectedRegion])) {
              
                    that.chartData['labels'].push(k);

                    var laposObj = message[that.selectedRegion][k].Lapos.dates;

                    for (var key in laposObj) {
                      if (laposObj.hasOwnProperty(key)) {
                          // console.log(key , laposObj[key]);
                          var valid = that.validDate(key);

                          if(valid){
                            var currentobject = laposObj[key];

                            for (var isKey in currentobject) {
                              if (currentobject.hasOwnProperty(isKey)) {
                                // console.log(isKey , currentobject[isKey]);
                                var secondObj = currentobject[isKey];

                                for (var vKey in secondObj) {
                                  if (secondObj.hasOwnProperty(vKey)) {
                                    // console.log(vKey , secondObj[vKey]);
                                    that.arrLocal[isKey][vKey] += secondObj[vKey];
                                  }
                                }
                              }
                            }
                          }
                      }
                    }

                }

                console.log(that.arrLocal);
              }
          });

          for (let i = 0; i < this.chartsArr.length; i++) {
            this.charts.push(i);
          }
    }

    initLaposObj(){

      this.chartData['datasets'] = [];

      var Lapos_p = {
          label: "Lapos physical",
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          data: this.arrLocal['isLapos']['p'],
      }
      var Lapos_v = {
          label: "Lapos virtual",
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor:  'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          data: this.arrLocal['isLapos']['v'],
      }

      var non_Lapos_p = {
          label: "Non Lapos physical",
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          data: this.arrLocal['nonLapos']['p'],
      }

      var non_Lapos_v = {
          label: "Non Lapos virtual",
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor:   'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: this.arrLocal['nonLapos']['v'],
      }

      this.chartData['datasets'].push(Lapos_p,Lapos_v,non_Lapos_p,non_Lapos_v);
    
    }

  ngAfterViewInit() {
      for (let i = 0; i < this.chartsArr.length; i++) {
          var canvas = 'canvas' + i.toString();
          var inChart = new Chart(canvas, {
            type: 'bar',
            data: this.chartData,
            options: this.chartOptions 
          });
          this.charts.push(inChart);
      }
  }

  validDate(myDate){

      myDate=myDate.split("-");
      var newDate=myDate[1]+"/"+myDate[2]+"/"+myDate[0];
      var today = new Date().getTime();
      var end = new Date(newDate).getTime();
      var range = this.selectedRange * 24 * 60 * 60 * 1000; 
      var valid = (today - end) < range;

      return valid;
  }
}
