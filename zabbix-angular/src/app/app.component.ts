import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

    constructor(){
      
        
    }

    ngAfterContentInit(){
      // var that = this;
      // setTimeout(() => {
      //   that.makeAllSortable(document.body);
      // }, 3000);
      
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


// window.onload = function () {makeAllSortable();};

    // title = 'app';
}
