import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as Rx from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class GenDataService {

      private messageSource = new Rx.BehaviorSubject<Object>('{}');
      currentMessage = this.messageSource.asObservable();

      private totalSource = new Rx.BehaviorSubject<Object>('{}');
      currentTotal = this.totalSource.asObservable();

      arr = ["Distribution", "LDT Security Flag","isVirt","Lapos Git Status"];
      mainObj:Object;
      secondObj:Object;
      totalObj:Object;
      timestamp30DaysBack:Number;
      year:Number;
      currentYear = (new Date()).getFullYear();

      constructor() { 
        this.initVars();
        this.messageSource.next(this.secondObj);
        this.totalSource.next(this.totalObj);
        
      }
    
      initVars(year = 0){
        this.mainObj = {};
        this.secondObj = {};
        this.totalObj = this.initTotalObj()// total object will hold all total data and will be genarated with second object (line after)
        this.timestamp30DaysBack = 0;// = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
        this.year = (year === 0) ? this.currentYear : year
        this.geturl(0);
      }


      returnArr(){
        return ["Distribution", "LDT Security Flag","isVirt","Lapos Git Status"];
      }

      geturl(x){
        var that = this;
        var arr = this.returnArr();

        var jsonData = {
          "jsonrpc": "2.0",
          "method": "item.get",
          "params": {
                "output": "extend",
                "hostids": [ "10132", "10134", "10126", "10138", "10140", "10182", "10144", "10166", "10148", "10150", "10192", "10154"],
                  "filter": {"name": arr} ,
              "sortfield": "name"
          },
          "auth": "3e82b6804f8f61967fea9462631a5946",
          "id": 1
        };
      
                
        if(!x){
          x = 0;
        }
        var name = arr[x].toString();
        jsonData.params.filter.name =  [name];
        
        $.ajax({
            url: "https://zabbix.wdf.global.corp.sap/zabbix/api_jsonrpc.php",
            type: "POST",
            data: JSON.stringify(jsonData),
            dataType: "json",        
            contentType: "application/json",
            error: function (request, status, error) {
                console.log(error);
            },
            success: function (data, text) {

                that.addTomainObj(data);

                console.log(jsonData.params.filter.name);
                var name = jsonData.params.filter.name;
                $('.'+name[0].replace(/ /g,'') + ' .xBadge').css("background","green").removeClass('animate');

                if(x+1 >= arr.length){
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

      addTomainObj(data){
          for (let x = 0; x < data.result.length; x++) {
              const elm = data.result[x];
                if(!this.mainObj[elm.hostid]){
                  this.mainObj[elm.hostid] = [];
                }
                this.mainObj[elm.hostid].push(elm);
            }
      }

      calctimeByDays(clock,days){
        var d = new Date(parseInt(clock));
        this.timestamp30DaysBack = new Date().getTime() - (days * 24 * 60 * 60 * 1000); 
        return parseInt(clock) < this.timestamp30DaysBack
      }

      calctimeByYear(clock){
        var d = new Date(parseInt(clock));
        return d.getFullYear() !==  this.year;
      }

      addTo2Object(){

          var arr = this.returnArr();
          var dist = arr[0];
          var LDT = arr[1];
          var isVirt = arr[2];
          var Lapos = arr[3];

          for (var key in this.mainObj) {

              var elmContainer;
              var breakFor = false;
              var checkIfVirt = "p";
              var checkIfLapos;
              var checkIfLDT;

              loop2:
              for (let i = 0; i < this.mainObj[key].length; i++) {
                  const elm = this.mainObj[key][i];
                  var clock = elm.lastclock + '000'; //adding 3 zero's because the date format is not valid

                  switch(elm.name) {
                        case dist: //IF DISTREBUITION

                            //### Total clients reported in the last 30 days
                            //################
                            
                            var notValidTime = this.calctimeByYear(clock);

                            if(notValidTime){
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
                            this.totalObj["total"]++;

                            break;

                        case isVirt: //IF isVirt

                              if(elm.lastvalue !== "0"){
                                checkIfVirt = "v";
                                this.secondObj[elmContainer]["isVirt"]++;
                                this.totalObj["isVirt"]++;
                              }else{
                                this.secondObj[elmContainer]["physical"]++;
                                this.totalObj["physical"]++;
                              }
                              break;

                        case Lapos: //IF Lapos
                              if(elm.lastvalue === "0"){
                                checkIfLapos = "isLapos";
                              }else{
                                checkIfLapos = "nonLapos";
                              }

                              this.secondObj[elmContainer]["Lapos"][checkIfLapos][checkIfVirt]++;
                              this.totalObj["Lapos"][checkIfLapos][checkIfVirt]++;
                              break;
                      }

                      switch(elm.name) {
                          case LDT: //IF LDT
                          var notValidTime = this.calctimeByDays(clock,30);
                          if(notValidTime){
                            // console.log('xxx',elm)
                            break;
                          }
                          if(elm.lastvalue === "0"){
                            checkIfLDT = "isLDT";
                          }else{
                            checkIfLDT = "nonLDT";
                          }
                          this.secondObj[elmContainer]["LDT"][checkIfLDT][checkIfVirt]++;
                          this.totalObj["LDT"][checkIfLDT][checkIfVirt]++;

                          break;
                        }

                  if (breakFor){
                    break loop2;
                  }

                        
              }
            }

            console.log(this.totalObj)
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

      initTotalObj(){
            return {
                "total"  : 0,
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

}
