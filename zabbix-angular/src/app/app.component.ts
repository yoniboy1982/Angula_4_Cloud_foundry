import { GenDataService } from './gen-data.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    constructor(private service:GenDataService){

    }

    that = this;
    // arr = ["Distribution", "LDT Security Flag","isVirt","Lapos Git Status"];

    // jsonData = {
    //   "jsonrpc": "2.0",
    //   "method": "item.get",
    //   "params": {
    //         "output": "extend",
    //         // "hostids": [ "10132", "10134", "10126", "10138", "10140", "10182", "10144", "10166", "10148", "10150", "10192", "10154"],
    //           "filter": {"name": this.arr} ,
    //       "sortfield": "name"
    //   },
    //   "auth": "3e82b6804f8f61967fea9462631a5946",
    //   "id": 1
    // };

    // dist = this.arr[0];
    // LDT = this.arr[1];
    // isVirt = this.arr[2];
    // Lapos = this.arr[3];

    // mainObj = {};
    // secondObj = {};
    // timestamp30DaysBack = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);


    ngOnInit(){
    }

    ngAfterContentInit(){
      this.service.promiseToFillDAta.then(function(){
        // debugger;
      })



      $('.GroupH5').click(function(){
        $(this).next().find('.newLine').toggle();
        $(this).next().find('.trNum').toggle();
      })

      // this.appendToTable();
    }




    //###############
    //NOW ADD TO HTML
    //##############
    addTotalToEachTable(){

      $('table').each(function(){

          var tbody = $(this).find('tbody');
          var tfoot = $(this).find('tfoot');
          var tdLength = tbody.find('tr:eq(0) td').length;
          var counterObj = [];
          var OS_object = {};

          for (let index = 0; index < tdLength; index++) {//set init array length with 0 as default param
              counterObj.push(0)
          }
          
          tbody.find('tr').each(function(ind,val){// enter data of each row to element
              var elm = val.getElementsByTagName('td');
              var elmTh = $(val).find('th').text();
              
              var elmThSubSTR = elmTh.split("-")[0];

              if(!(elmThSubSTR in OS_object)){//if OS is not in object, then add it and init it with 0 value
                OS_object[elmThSubSTR] = [];

                for (let td = 0; td < elm.length; td++) {
                  OS_object[elmThSubSTR].push(0)
                }

              }
              for (var i = 0; i < elm.length; i++) {
                  var num = parseInt(elm[i].innerHTML);
                  counterObj[i] += num;

                  OS_object[elmThSubSTR][i] += num;
              }
          })

          for (var key in OS_object) {

              if (OS_object.hasOwnProperty(key)) {

                  var htmlTotalElmToAppend = '<tr class="trNum"><th scope="row">'+key+'</th>';
                  for (let td = 0; td < OS_object[key].length; td++) {
                    const tdNum = OS_object[key][td];
                    htmlTotalElmToAppend += '<td class="tdNum">' + tdNum + '</td>'
                  }
                  htmlTotalElmToAppend += '</tr>';
                  tbody.append(htmlTotalElmToAppend);
              }
          }

          //append total data to HTML ELEMENT
          var htmlTotalElmToAppend = '<tr><th scope="row">Total</th>';
          for (let index = 0; index < counterObj.length; index++) {
            const element = counterObj[index];
            htmlTotalElmToAppend += '<td class="total">' + element + '</td>'
          }
          htmlTotalElmToAppend += '</tr>';
          
          tfoot.append(htmlTotalElmToAppend);






      })
    }

    appendToTable = function(){
      
      for (var key in this.service.secondObj) {

        var elm = this.service.secondObj[key];
        var total = this.service.secondObj[key].total;
        var isVirt = this.service.secondObj[key].isVirt;
        var physical = this.service.secondObj[key].physical;
        var elmLapos = this.service.secondObj[key].Lapos;
        var elmLDT = this.service.secondObj[key].LDT;
        $('#zabbixTable tbody').append('<tr class="newLine">\n <th scope="row">'+key+'</th>\n <td>'+total+'</td>\n<td>'+physical+'</td>\n <td>'+isVirt+'</td> </tr>');
        
        if(elmLapos !== undefined)
        $('#laposTable tbody').append('<tr class="newLine">\n <th scope="row">'+key+'</th>\n <td>'+elmLapos.isLapos.p+'</td>\n<td>'+elmLapos.isLapos.v+'</td>\n <td>'+elmLapos.nonLapos.p+'</td> <td>'+elmLapos.nonLapos.v+'</td> </tr>');
        
        if(elmLDT !== undefined)
        $('#LDTtable tbody').append('<tr class="newLine">\n <th scope="row">'+key+'</th>\n <td>'+elmLDT.isLDT.p+'</td>\n<td>'+elmLDT.isLDT.v+'</td>\n <td>'+elmLDT.nonLDT.p+'</td> <td>'+elmLDT.nonLDT.v+'</td> </tr>');
      }
      $('.loader').hide();
    }

    // title = 'app';
}
