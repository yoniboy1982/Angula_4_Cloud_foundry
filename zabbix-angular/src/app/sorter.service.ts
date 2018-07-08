import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class SorterService {

  constructor() { }
  
  ngAfterContentInit(){

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

  sortTable(table, col, reverse) {
      if (table.tBodies === undefined) {
          return;
      }
      var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
          tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
          i;
      reverse = -((+reverse) || -1);

      tr = tr.sort(function(a, b) { // sort rows


          if (!isNaN(a.cells[col].textContent) && !isNaN(b.cells[col].textContent))
              return reverse * ((+a.cells[col].textContent) - (+b.cells[col].textContent))
          return reverse // `-1 *` if want opposite order
              *
              (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
                  .localeCompare(b.cells[col].textContent.trim())
              );
      });
      for (i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
  }

  makeSortable(table) {
      var that = this;
      var th = table.tHead,
          i;
      th && (th = th.rows[0]) && (th = th.cells);
      if (th) i = th.length;
      else return; // if no `<thead>` then do nothing
      while (--i >= 0)(function(i) {
          var dir = 1;
          th[i].addEventListener('click', function() {
              that.sortTable(table, i, (dir = 1 - dir))
          });
      }(i));
  }

  makeAllSortable(parent) {
      parent = parent || document.body;
    
      var t = parent.getElementsByTagName('table'),
          i = t.length;
      while (--i >= 0) this.makeSortable(t[i]);
  }

}
