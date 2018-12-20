import { Component, OnInit, Input,OnChanges, SimpleChanges, } from '@angular/core';
import { Chart } from 'chart.js';
import { Options } from 'selenium-webdriver/edge';

@Component({
  selector: 'app-html-charts-pie',
  templateUrl: './html-charts-pie.component.html',
  styleUrls: ['./html-charts-pie.component.css']
})
export class HtmlChartsPieComponent implements OnInit {

  chartRegion = <any>{};
  chartDist = <any>{};
  chartType = <any>{};
  chart;
  @Input() total: String;

  constructor() { }

  ngOnInit(){

  }

  ngAfterViewInit() {
    var regionData = this.createChart('By Region');
    var distData = this.createChart('By Distribution');
    var typeData = this.createChart('By Type');

    this.chartRegion = new Chart('canvas_region', regionData);
    this.chartDist = new Chart('canvas_dist', distData);
    this.chartType = new Chart('canvas_type', typeData);
    

    console.log('loaded');
    this.updateChartData();

  }

  ngOnChanges(changes: SimpleChanges) {
    // alert('change')
    console.log(changes)
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

}
  createChart(title){

    var that  = this;
    var chartOptions = {
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: true
        },
      ],
        yAxes: [{
          ticks: {
            // min: 10,
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
      type: 'pie',
      data: {
            labels: [
              'Red',
              'Yellow',
              'Blue'
            ],
            datasets: [
              {data: [10, 20, 30]}
            ]
          },
      options:  chartOptions
    }
  }




  updateChartData(){

    // var labels  = ["match1", "match2", "match3", "match4", "match5"];
		// var datasets = [
		// 	{
		// 		label : "TeamB score",
    //     data : [20, 35, 40, 60, 50]
    //   }]

    // this.chartLapos.data.datasets = datasets;
    // this.chartLapos.data.labels = labels;
    // this.chartLapos.update();
  } 

}
