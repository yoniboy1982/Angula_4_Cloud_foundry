import { GenDataService } from './gen-data.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    timestamp = true;
    constructor(private service:GenDataService){
        
    }

    ngOnInit(){
    }

    ngAfterContentInit(){
      var that = this;

      this.service.promiseToFillDAta.then(function(respond){
          that.appendToTable(respond);
          // $('.container2').hide();
          that.addTotalToEachTable()
          that.timestamp = false;

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

    appendToTable = function(respond){
      // debugger;
      for (var key in respond) {

        // var elm = respond[key];
        var total = respond[key].total;
        var isVirt = respond[key].isVirt;
        var physical = respond[key].physical;
        var elmLapos = respond[key].Lapos;
        var elmLDT = respond[key].LDT;
        $('#zabbixTable tbody').append('<tr class="newLine">\n <th scope="row">'+key+'</th>\n <td>'+total+'</td>\n<td>'+physical+'</td>\n <td>'+isVirt+'</td> </tr>');
        
        if(elmLapos !== undefined)
        $('#laposTable tbody').append('<tr class="newLine">\n <th scope="row">'+key+'</th>\n <td>'+elmLapos.isLapos.p+'</td>\n<td>'+elmLapos.isLapos.v+'</td>\n <td>'+elmLapos.nonLapos.p+'</td> <td>'+elmLapos.nonLapos.v+'</td> </tr>');
        
        if(elmLDT !== undefined)
        $('#LDTtable tbody').append('<tr class="newLine">\n <th scope="row">'+key+'</th>\n <td>'+elmLDT.isLDT.p+'</td>\n<td>'+elmLDT.isLDT.v+'</td>\n <td>'+elmLDT.nonLDT.p+'</td> <td>'+elmLDT.nonLDT.v+'</td> </tr>');
      }

      // $('.loader').hide();
    }

    // title = 'app';
}
