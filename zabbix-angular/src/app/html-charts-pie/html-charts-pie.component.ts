import { element } from 'protractor';
import { Component, OnInit, Input,OnChanges, SimpleChanges, } from '@angular/core';
import { Chart } from 'chart.js';
import { Options } from 'selenium-webdriver/edge';
import { ChartModule } from 'angular2-chartjs';
import 'chartjs-plugin-labels';


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
  @Input() sum: String;
  @Input() parentName: string;

  constructor() { }

  ngOnInit(){}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // debugger;

    this.parentName = changes["parentName"]["currentValue"];

    var totalData = this.exctractChartDataTotal(changes);
    var sumData = this.exctractChartDataSum(changes);
    var tyData = this.exctractChartDataType(changes);

    var regionData = this.createChart('Total By Region',totalData);
    var distData = this.createChart('Total By Distribution',sumData);
    var typeData = this.createChart('Total By Type',tyData);

    this.chartRegion = new Chart('canvas_region', regionData);
    this.chartDist = new Chart('canvas_dist', distData);
    this.chartType = new Chart('canvas_type', typeData);
  }

  createChart(title,chartData){

    var chartOptions = {
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
      }
    };

    return {
      type: 'pie',
      data: chartData,
      options:  chartOptions
    }
  }




  exctractChartDataTotal(changes){
    let total = changes["total"]["currentValue"]
    //TOTAL LABELS
    
    let totalArr = []
    var regionsLabels = Object.keys(total).filter(value => value !== "TOTAL");
    regionsLabels.forEach(element => {
        if(this.parentName === "lapos"){// If parent component is called lapos then genarate lapos data
          var elm = total[element]["Lapos"];
          totalArr.push( elm["isLapos"]["p"] + elm["nonLapos"]["p"] +elm["isLapos"]["v"] +elm["nonLapos"]["v"])

        }else if(this.parentName === "ldt"){// If parent component is called LDT then genarate lapos data
          var elm = total[element]["LDT"];
          totalArr.push( elm["isLDT"]["p"] + elm["nonLDT"]["p"] + elm["isLDT"]["v"] +elm["nonLDT"]["v"])
        }else{
          totalArr.push(total[element].total)
        }
        
    });
    return this.returnDataObg(regionsLabels,totalArr)
  }

  exctractChartDataType(changes){

    let total = changes["total"]["currentValue"];
    var typeArr;

    if(this.parentName === "lapos"){
      // If parent component is called lapos then genarate lapos data
      var elm = total["TOTAL"]["Lapos"];
      let virt = elm["isLapos"]["v"] + elm["nonLapos"]["v"];
      let physical = elm["isLapos"]["p"] + elm["nonLapos"]["p"];
      typeArr = [virt,physical];
    }else if(this.parentName === "ldt"){
      // If parent component is called lapos then genarate lapos data
      var elm = total["TOTAL"]["LDT"];
      let virt = elm["isLDT"]["v"] + elm["nonLDT"]["v"];
      let physical = elm["isLDT"]["p"] + elm["nonLDT"]["p"];
      typeArr = [virt,physical];
    }else{
      typeArr = [total["TOTAL"]["isVirt"],total["TOTAL"]["physical"]];
    }

     
    return  this.returnDataObg(['Virtual',"Physical"],typeArr) 
  }

  exctractChartDataSum(changes){
    let sum = changes["sum"]["currentValue"]["TOTAL"];
    //TOTAL LABELS
    let distArr = []
    var distLabels = Object.keys(sum);
    distLabels.forEach(element => {
      if(this.parentName === "lapos"){// If parent component is called lapos then genarate lapos data
          var elm = sum[element]["Lapos"];
          distArr.push( elm["isLapos"]["p"] + elm["nonLapos"]["p"] +elm["isLapos"]["v"] +elm["nonLapos"]["v"])
      }else if(this.parentName === "ldt"){// If parent component is called lapos then genarate lapos data
        var elm = sum[element]["LDT"];
        distArr.push( elm["isLDT"]["p"] + elm["nonLDT"]["p"] +elm["isLDT"]["v"] +elm["nonLDT"]["v"])
      }else{
        distArr.push(sum[element].total)
      }
    });
    return this.returnDataObg(distLabels,distArr)
  }






  returnDataObg(regionsLabels,totalArr){
    return {
      labels: regionsLabels,
      datasets: [{ 
          data: totalArr,
          backgroundColor: ["#b95dc5","#5dc564","#5ba2ef","#c55d5d"]
        }
      ]
    }
  }

}
