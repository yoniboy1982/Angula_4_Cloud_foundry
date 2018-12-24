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
  htmlToAdd;

  @ViewChild('charts') input; 

  constructor(private Http:HttpClient,private service:GenDataService,) { 
    this.records = []
    this.isLoaded = false;
    this.bigObject = {};
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    var that = this;
    return this.Http.get('https://linuxinfra.wdf.sap.corp/ldt/reports/osd.php?query=1&time=365')
    .subscribe(data=>{
      this.records = data;
      // get profiles
      for (let index = 0; index < this.records.length; index++) {
        
        const element = this.records[index];
        this.createMonthObj(element);

        if(this.profiles.indexOf(element.name) === -1) {
          this.profiles.push(element.name);
        }
      }
      this.genCharts();
      this.renderCharts()
      console.log(that.chartObject,this.profiles)
      // this.isLoaded = true;//now load all the charts

    })
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
                    backgroundColor: color[index],
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
          // console.log(this.chartObject[key])
          var data = {
            labels: [1,2,3,4,5,6,7,8,9,10,11,12],
            datasets: this.chartObject[key]
          };
          this.createCharts(data,key);
          // break;
         
      }
    }     
    
  }

  createChart(title,chartData){

    var chartOptions = {
      scales: {
        xAxes: [{
          display: true
        },
      ],
        yAxes: [{
          ticks: {
            min: 0,
            max:8
          },
          display: true
        }]
      },
      maintainAspectRatio: false,
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
    
    var mycanvas = document.createElement("canvas");
    mycanvas.id = title;
    this.input.nativeElement.appendChild(mycanvas);
    var canvas = <HTMLCanvasElement> document.getElementById(title);
    var ctx = canvas.getContext("2d");

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