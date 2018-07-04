import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    that = this;
    arr = ["Distribution", "LDT Security Flag","isVirt","Lapos Git Status"];

    jsonData = {
      "jsonrpc": "2.0",
      "method": "item.get",
      "params": {
            "output": "extend",
            // "hostids": [ "10132", "10134", "10126", "10138", "10140", "10182", "10144", "10166", "10148", "10150", "10192", "10154"],
              "filter": {"name": this.arr} ,
          "sortfield": "name"
      },
      "auth": "3e82b6804f8f61967fea9462631a5946",
      "id": 1
    };

    dist = this.arr[0];
    LDT = this.arr[1];
    isVirt = this.arr[2];
    Lapos = this.arr[3];

    mainObj = {};
    secondObj = {};
    timestamp30DaysBack = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);


    ngOnInit(){
    }

    ngAfterContentInit(){

      for (let i = 0; i < this.arr.length; i++) {
        const name = this.arr[i];
        $('.listLoading').append('\
                          <li class="list-group-item d-flex justify-content-between align-items-center '+name.replace(/ /g,'')+'">\
                            '+name+'\
                            <span class="badge badge-primary badge-pill xBadge animate"></span>\
                          </li>');
        
      }

      $('.GroupH5').click(function(){
        $(this).next().find('.newLine').toggle();
        $(this).next().find('.trNum').toggle();
      })
    }


    //############
    //ACTIVATE FUNCTION TO FETCH DATA
    geturl(x){
                
      if(!x){
        x = 0;
      }
      var name = this.arr[x].toString();
      this.jsonData.params.filter.name =  [name];
      let that = this;
        $.ajax({
            url: "https://zabbix.wdf.global.corp.sap/zabbix/api_jsonrpc.php",
            type: "POST",
            data: JSON.stringify(this.jsonData),
            dataType: "json",        
            contentType: "application/json",
            error: function (request, status, error) {
                // console.log(error);
                // console.log(jsonData.params.filter.name);

            },
            success: function (data, text) {
              
                that.addTomainObj(data);

                console.log(that.jsonData.params.filter.name);
                var name = that.jsonData.params.filter.name;
                $('.'+name[0].replace(/ /g,'') + ' .xBadge').css("background","green").removeClass('animate');

                if(x+1 >= that.arr.length){
                  that.addTo2Object();
                    return;
                }
                x++;
                setTimeout(() => {
                  that.geturl(x);
                }, 3000);
            }
            });
    }

    activate = this.geturl(0);    


    addTomainObj(data){
        for (let x = 0; x < data.result.length; x++) {
            const elm = data.result[x];
              if(!this.mainObj[elm.hostid]){
                this.mainObj[elm.hostid] = [];
              }
              this.mainObj[elm.hostid].push(elm);
          }
    }
            
    addTo2Object(){
        var that = this;
        for (var key in this.mainObj) {

            var elmContainer;
            var breakFor = false;
            var checkIfVirt = "p";
            var checkIfLapos;
            var checkIfLDT;

            loop2:
            for (let i = 0; i < this.mainObj[key].length; i++) {
                const elm = this.mainObj[key][i];
              
                switch(elm.name) {
                      case this.dist: //IF DISTREBUITION

                          //### Total clients reported in the last 30 days
                          //################
                          
                          var clock = elm.lastclock + '000';//adding 3 zero's because the date format is not valid

                          //####
                          var d = new Date(parseInt(clock));
                          if(d.getFullYear() == 2017)
                            console.log(d.getFullYear())

                          if(parseInt(clock) < this.timestamp30DaysBack){
                            // console.log(elm.name)
                            break loop2;
                          }

                          if(elm.lastvalue === "0" || elm.lastvalue === ""){
                            breakFor = true;
                            break;
                          }
                          elmContainer = elm.lastvalue;//GET THE Name OF ELEMENT
                          
                          if(elmContainer in this.secondObj){
                            this.secondObj[elmContainer]["total"]++;
                          }else{
                            this.initObj(elmContainer);
                          }
                          break;

                      case this.isVirt: //IF isVirt

                            if(elm.lastvalue !== "0"){
                              checkIfVirt = "v";
                              this.secondObj[elmContainer]["isVirt"]++;
                            }else{
                              this.secondObj[elmContainer]["physical"]++;
                            }
                            break;

                      case this.Lapos: //IF Lapos
                            if(elm.lastvalue === "0"){
                              checkIfLapos = "isLapos";
                              // secondObj[Lapos]["isVirt"]++;
                            }else{
                              checkIfLapos = "nonLapos";
                              // secondObj[Lapos]["physical"]++;
                            }

                            this.secondObj[elmContainer]["Lapos"][checkIfLapos][checkIfVirt]++;
                            // secondObj[Lapos]["total"]++;
                            break;

                      case this.LDT: //IF LDT
                            if(elm.lastvalue === "0"){
                              checkIfLDT = "isLDT";
                              // secondObj[LDT]["isVirt"]++;
                            }else{
                              checkIfLDT = "nonLDT";

                              // secondObj[LDT]["physical"]++;
                            }
                            this.secondObj[elmContainer]["LDT"][checkIfLDT][checkIfVirt]++;

                            // secondObj[LDT]["total"]++;
                            break;
                } 

                if (breakFor){
                  break loop2;
                }
                      
            }
        }
        console.log(this.secondObj);
        this.appendToTable();
        $('.mainCont').show( "slow", function() {
          $('.container2').hide();
          that.addTotalToEachTable()
        });

    }

    initObj(lastvalue){
      this.secondObj[lastvalue] = {
          "total"  : 1,
          "isVirt"  : 0,
          "physical"  : 0,
          "Lapos"  : {
            "isLapos"  : {
              "v"  : 0,
              "p"  : 0 
            },
            "nonLapos"  : {
              "v"  : 0,
              "p"  : 0 
            },
          },
          "LDT"  : {
            "isLDT"  : {
              "v"  : 0,
              "p"  : 0 
            },
            "nonLDT"  : {
              "v"  : 0,
              "p"  : 0 
            },
          }
        }


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

    appendToTable(){
      
      for (var key in this.secondObj) {

        var elm = this.secondObj[key];
        var total = this.secondObj[key].total;
        var isVirt = this.secondObj[key].isVirt;
        var physical = this.secondObj[key].physical;
        var elmLapos = this.secondObj[key].Lapos;
        var elmLDT = this.secondObj[key].LDT;
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
