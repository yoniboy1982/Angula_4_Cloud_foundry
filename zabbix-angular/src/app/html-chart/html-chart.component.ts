import { GenDataService } from './../gen-data.service';
import { Component, OnInit, AfterContentInit, AfterViewInit,ViewChildren } from '@angular/core';
import { Chart } from 'chart.js';
import { ZFunctionsService } from './../z-functions.service';
import { SorterService } from './../sorter.service';
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

    // chartsArr = [0,0];
    charts = [];
    chart = [];

    chartLapos;
    chartNonLapos;
    dataset1;
    dataset2;
    labels = [];

    LaposChartData = {};
    nonLaposChartData = {};

    chartOptions = {};

    ranges = [30,90,180];
    selectedRange;

    arrLocal = {};

    constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){
        this.selectedRegion = this.service.regionArr[0];
    }

    ngOnInit(){

          var that = this;
          this.year = this.service.year;
          this.selectedRange = this.ranges[0];



          this.service.observeMessage.subscribe(message => this.dist = message);
          this.service.observeTotal.subscribe(message => this.total = message);
          this.service.observeSelectedRigion.subscribe(selected => this.selectedRegion = selected);

          this.service.observeSum.subscribe(message => {
              this.sum = getParams(message);

              function getParams(message){
                
                
                  var regions = that.service.regionArr;

                  for (let index = 0; index < regions.length; index++) { //collect data for  on allregions

                        const region = regions[index];

                        for (let k of that.zFunctions.objectKeys(message[region])) {
                    
                          // that.chartData['labels'].push(k);

                          var laposObj = message[region][k].Lapos.dates;

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

                                          that.arrLocal[region] = that.arrLocal[region] || {};
                                          that.arrLocal[region][k] = that.arrLocal[region][k] || that.addDatatoObject();
                                          that.arrLocal[region][k][isKey][vKey] += secondObj[vKey];

                                        }
                                      }
                                    }
                                  }
                                }
                            }
                          }
                      }
                  }
                  console.log(that.arrLocal);
                  that.updateCharts();
              }
          });

    }


    updateCharts(){
        var chartsData = this.arrLocal[this.selectedRegion];
        var isP = [];
        var isV = [];
        var nonP = [];
        var nonV = [];
        
        for (var key in chartsData) {
          if (chartsData.hasOwnProperty(key)) {
              this.labels.push(key);// add labels
              var is = chartsData[key]['isLapos'];
              var non = chartsData[key]['nonLapos'];
              isP.push(is.p);
              isV.push(is.v);
              nonP.push(non.p);
              nonV.push(non.v);
          }
        }

        this.dataset1 = this.initLaposObj(isP,isV);
        this.dataset2 = this.initLaposObj(nonP,nonV);
    }

    addDatatoObject(){
      return {
          "isLapos"  : {
            "v"  : 0,
            "p"  : 0 
          },
          "nonLapos"  : {
            "v"  : 0,
            "p"  : 0 
          }
        }
    }

    createChart(id,chart,dataset,title){

      var canvas = 'canvas' + id;

      var chartOptions = {
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
        },
        title: {
            display: true,
            text: title,
            fontSize : 20
        }
      };

      var chartData = {
        labels: this.labels,
        datasets: dataset
      };

      chart = new Chart(canvas, {
        type: 'bar',
        data: chartData,
        options: chartOptions 
      });

    }

    initLaposObj(Physical,virtual){

        return [
            {
              label: "Physical",
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 1,
              data: Physical
          }
          ,{
            label: "Lapos virtual",
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor:  'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data: virtual,
          }
        ];

      // var non_Lapos_p = {
      //     label: "Non Lapos physical",
      //     backgroundColor: 'rgba(255, 206, 86, 0.2)',
      //     borderColor: 'rgba(255, 206, 86, 1)',
      //     borderWidth: 1,
      //     data: [this.arrLocal['nonLapos']['p']],
      // }

      // var non_Lapos_v = {
      //     label: "Non Lapos virtual",
      //     backgroundColor: 'rgba(75, 192, 192, 0.2)',
      //     borderColor:   'rgba(75, 192, 192, 1)',
      //     borderWidth: 1,
      //     data: [this.arrLocal['nonLapos']['v']],
      // }

      // this.chartData['datasets'].push(Lapos_p,Lapos_v,non_Lapos_p,non_Lapos_v);
    
    }

    ngAfterViewInit() {
      this.createChart('_isLapos',this.chartLapos,this.dataset1,"Lapos");
      this.createChart('_nonLapos',this.chartNonLapos,this.dataset2,"Non Lapos");
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
