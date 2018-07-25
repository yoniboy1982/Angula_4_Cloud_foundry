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

    chartLapos = <any>{};
    chartNonLapos = <any>{};
    dataset1;
    dataset2;
    labels = [];

    LaposChartData = {};
    nonLaposChartData = {};

    chartOptions = {};

    ranges = [30,90,180];
    selectedRange;

    arrLocal = {};
    arrCompare = {};

    constructor(private service:GenDataService, private sorter:SorterService,private zFunctions:ZFunctionsService){
        this.selectedRegion = this.service.regionArr[0];
    }

    ngOnInit(){

          var that = this;
          this.year = this.service.year;
          this.selectedRange = this.ranges[0];

          this.service.observeMessage.subscribe(message => this.dist = message);
          this.service.observeTotal.subscribe(message => this.total = message);
          this.service.observeSelectedRigion.subscribe(selected => {
              if (that.selectedRegion !== selected) { // only if not eqal
                that.selectedRegion = selected;
                that.updateCharts();
                that.updateChartData();
              }
          });

          this.service.observeSum.subscribe(message => {
              this.sum = getParams(message);

              function getParams(message){
                
                  var regions = that.service.regionArr;

                  for (let index = 0; index < regions.length; index++) { //collect data for  on allregions
                        const region = regions[index];

                        for (let k of that.zFunctions.objectKeys(message[region])) {
                          var laposObj = message[region][k].Lapos.dates;

                          for (var key in laposObj) {
                            if (laposObj.hasOwnProperty(key)) {

                                var currentobject = laposObj[key];

                                  for (var isKey in currentobject) {
                                    if (currentobject.hasOwnProperty(isKey)) {
                                      // console.log(isKey , currentobject[isKey]);
                                      var secondObj = currentobject[isKey];

                                      for (var vKey in secondObj) {
                                          if (secondObj.hasOwnProperty(vKey)) {
                                            // console.log(vKey , secondObj[vKey]);

                                                //Check if object is in range
                                                var validRange = that.validDateToday(key);
                                                var validRangeVs = that.validDateVs(key);

                                                if(validRange){
                                                  that.arrLocal[region] = that.arrLocal[region] || {};
                                                  that.arrLocal[region][k] = that.arrLocal[region][k] || that.addDatatoObject();
                                                  that.arrLocal[region][k][isKey][vKey] += secondObj[vKey];

                                                }else if(validRangeVs){
                                                  that.arrCompare[region] = that.arrCompare[region] || {};
                                                  that.arrCompare[region][k] = that.arrCompare[region][k] || that.addDatatoObject();
                                                  that.arrCompare[region][k][isKey][vKey] += secondObj[vKey];
                                                }

                                        }
                                      }
                                    }
                                  }
                            }
                          }
                      }
                  }
                  console.log("arrLocal" , that.arrLocal);
                  console.log("arrCompare" , that.arrCompare);
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
        this.labels = [];

        for (var key in chartsData) {
          if (chartsData.hasOwnProperty(key)) {
              this.labels.push(key); // add labels
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

    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
    
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    
      return array;
    }

    getData(dataset){
        return {
          labels: this.labels,
          datasets: dataset
        };
    }

    createChart(title){

      var that  = this;
      var chartOptions = {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          },
        ],
          yAxes: [{
            ticks: {
              min: 0,
            },
            display: true
          }]
        },
        title: {
            display: true,
            text: title,
            fontSize : 20,
            fontColor : '#0c5460',
            fontStyle : 'bold'
        }
      };

      return {
        type: 'bar',
        data: that.getData([]),
        options: chartOptions 
      }
    }
    
    updateChartData(){
      this.chartLapos.data.datasets = this.dataset1;
      this.chartLapos.update();
      this.chartNonLapos.data.datasets = this.dataset2;
      this.chartNonLapos.update();
    }

    genarateRandom(){

      var arr = [2, 11, 37, 42];
      this.dataset1[0].data = this.shuffle(arr);
      this.dataset1[1].data = this.shuffle(arr);
      this.dataset2[0].data = this.shuffle(arr);
      this.dataset2[1].data = this.shuffle(arr);
      this.updateChartData();
    }

    ngAfterViewInit() {
      var laposData = this.createChart('Lapos');
      var laposNonData = this.createChart('Non Lapos');

      this.chartLapos = new Chart('canvas_isLapos', laposData);
      this.chartNonLapos = new Chart('canvas_nonLapos', laposNonData);

      this.updateChartData();

    }

    validDateToday(myDate){

        myDate=myDate.split("-");
        var newDate=myDate[1]+"/"+myDate[2]+"/"+myDate[0];
        var today = new Date().getTime();
        var end = new Date(newDate).getTime();
        var range = this.selectedRange * 24 * 60 * 60 * 1000; 
        var valid = (today - end) < range;

        return valid;
    }

    validDateVs(myDate){

       //myDate
        myDate=myDate.split("-");
        var newDate=myDate[1]+"/"+myDate[2]+"/"+myDate[0];
        var myData = new Date(newDate).getTime();

        //from
        var dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - (this.selectedRange * 2));// today - 60 days (range 30 *2)

        //to
        var dateTo = new Date();
        dateTo.setDate(dateTo.getDate() - this.selectedRange);// today - 30 days
        // var dateString = dateTo.toISOString().split('T')[0];// today - 30 days
        
        //compare
        var valid = (myData > dateFrom.getTime() && myData < dateTo.getTime()); //large than 60 days && small from 30 days
        // debugger;

        return valid;
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

}
