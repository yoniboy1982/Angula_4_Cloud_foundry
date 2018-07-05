import { Component, OnInit } from '@angular/core';
import { GenDataService } from '../gen-data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  constructor(private service:GenDataService){
        
  }

    dist = {};
    timestamp = true;

    ngOnInit(){
      this.service.currentMessage.subscribe(message => this.dist = message);
    }

    ngAfterContentInit(){

      // var that = this;

      // this.service.promiseToFillDAta.then(function(respond){
      //     that.dist = respond;
      //     setTimeout(() => {
      //       that.addTotalToEachTable()
      //     }, 1000);
          
      //     that.timestamp = false;
      // })

      $('.GroupH5').click(function(){
        $(this).next().find('.newLine').toggle();
        $(this).next().find('.trNum').toggle();
      })
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

    objectKeys(obj) {
      return Object.keys(obj);
    }

}
