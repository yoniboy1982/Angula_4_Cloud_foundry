import { element } from 'protractor';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenDataService } from '../gen-data.service';
import { Chart } from 'chart.js';
import { unwatchFile } from 'fs';

@Component({
  selector: 'app-osd-charts',
  templateUrl: './osd-charts.component.html',
  styleUrls: ['./osd-charts.component.css']
})
export class OsdChartsComponent implements OnInit {

  records:any;
  profiles = [];
  // profile:String;
  selectedRegion = <any>String;
  // total = 0;
  total = <any>{};
  sum = <any>{};
  isLoaded:Boolean;
  chartLapos = <any>{};
  chartNonLapos = <any>{};
  bigObject = <any>{};
  chartObject = <any>{};
  chartArr = [];
  years = []
  htmlToAdd;
  range = 4;
  days = 4 * 365;

  @ViewChild('charts') input; 
  @ViewChild('container') container; 
  node: string;
  constructor(private Http:HttpClient,private service:GenDataService) {
    this.records = []
    this.isLoaded = false;
    this.bigObject = {};

    var year = new Date().getFullYear();
    for (let index = 0; index < this.range; index++) {
        this.years.push(year-index)      
    }
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    var that = this;
    return this.Http.get('https://linuxinfra.wdf.sap.corp/ldt/reports/osd.php?query=1&time='+this.days)
    .subscribe(data=>{
      this.records = data;
      this.createData();
    });
  }

  initData(){
    var e = this.container.nativeElement;
    var cld = e.lastElementChild;  
      while (cld) {
          e.removeChild(cld); 
          cld = e.lastElementChild; 
      } 
    this.profiles = [];
    this.total = {};
    this.sum = {};
    this.chartLapos = {};
    this.chartNonLapos = {};
    this.bigObject = {};
    this.chartObject = {};
    this.isLoaded = false;
  }

  createData(year=2020){
    
      this.initData();

      // get profiles
      for (let index = 0; index < this.records.length; index++) {
        var element = this.records[index];
        var dateYEAR = new Date(element.timestamp).getFullYear();

        if(dateYEAR !== year){
          continue;
        }
        
        this.createMonthObj(element);
        if(this.profiles.indexOf(element.name) === -1) {
          this.profiles.push(element.name);
        }
      }
      this.genCharts();
      this.renderCharts();
      console.log(this.chartObject,this.profiles);
      // this.isLoaded = true;//now load all the charts
  }

  updateYear(yearValue) {
    this.createData(parseInt(yearValue));
  }

  genCharts(){
    for (var key in this.bigObject) {
      if (this.bigObject.hasOwnProperty(key)) {
        this.loopProfiles(this.bigObject[key],key)
      }
    }
  }

  loopProfiles(dist,ind){
   
    var color = ["red","green","blue"];
    var style = [
      {
        backgroundColor: '#e83e8c',
        // borderColor: 'rgba(255,99,132,1)',
    },
    {
      backgroundColor: '#ffc107',
      // borderColor:  'rgba(54, 162, 235, 1)',
    },
      {
        backgroundColor: '#17a2b8',
        // borderColor: 'rgba(146,255,99,1)',
    },
    {
      backgroundColor: 'rgba(255, 193, 7, 0.5)',
      borderColor: 'rgba(255, 193, 7, 1)',
    },


    {
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      borderColor:  'rgba(54, 162, 235, 0.3)',
    }
  ]

    this.chartObject[ind] = []
    for (let index = 0; index < this.profiles.length; index++) {
        const element = this.profiles[index];
        var arr = [];
        for (var key in dist) {
          if (dist.hasOwnProperty(key)) {
              arr.push(dist[key][element]);
          }
        } 

        var obj = { label: element,
                    backgroundColor: style[index]["backgroundColor"],
                    borderColor: style[index]["borderColor"],
                    data: arr}
        this.chartObject[ind].push(obj)        
        
      }
  }  
  createMonthObj(element){
    let dist = element.dist;
    let month = parseInt(element.timestamp.split('-')[1]);
    this.bigObject[dist] = this.bigObject[dist] || {};
    this.genarateMonths(dist);
    this.genarateProfiles(dist,month,element.name);
  }
  genarateMonths(dist){
      if(Object.keys(this.bigObject[dist]).length > 0){
          return;
      }
      for (let index = 1; index <= 12; index++) {
        this.bigObject[dist][index] = []
      }
  }
  genarateProfiles(dist,month,profile){
    this.bigObject[dist][month][profile] = this.bigObject[dist][month][profile] || 0;
    this.bigObject[dist][month][profile]++;
  }

  renderCharts(){

    for (var key in this.chartObject) {

      if (this.chartObject.hasOwnProperty(key)) {
          var data = {
            labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            datasets: this.chartObject[key]
          };
          this.createCharts(data,key);
      }
    }     
    
  }

  createChart(title,chartData){

    var chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        xAxes: [{
          display: true
        },
      ],
        yAxes: [{
          ticks: {
            min: 0,
            // max:8,
            suggestedMax: 7,
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
      ,plugins: {
          labels: {
            // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
            render: 'value',
            // precision for percentage, default is 0
            precision: 0,
            showZero: false,
            fontSize: 12,
            fontColor: '#000',
            fontStyle: 'normal',
          }
      },
      // legend: {
      //   position: 'right'
      // }
    };

    return {
      type: 'bar',
      data: chartData,
      options:  chartOptions
    }
  }
  
  createCharts(data,title){

    var canvas = this.input.nativeElement;
    var container = this.container.nativeElement;
  
    var can = <HTMLCanvasElement> canvas.cloneNode(true);
    can.className = "chart-container"
    container.appendChild(can);

    var ctx = can.getContext("2d");

    var newC = this.createChart(title , data)
    this.chartLapos = new Chart(ctx, newC);
    this.isLoaded = true;
  }


  chartsData(title){

    var that  = this;
    var chartOptions = {
      // legend: {
      //   display: false
      // },
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
      // data: that.getData([]),
      options: chartOptions 
    }
  }


}
