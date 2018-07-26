import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as Rx from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class GenDataService {

      private messageSource = new Rx.BehaviorSubject<Object>('{}');
      observeMessage = this.messageSource.asObservable();

      private totalSource = new Rx.BehaviorSubject<Object>('{}');
      observeTotal = this.totalSource.asObservable();

      private sumSource = new Rx.BehaviorSubject<Object>('{}');
      observeSum = this.sumSource.asObservable();
      
      private regionSource = new Rx.BehaviorSubject<Object>('{}');
      observeRigion = this.regionSource.asObservable();

      private selectedRegionSource  = new Rx.BehaviorSubject<Object>('{}');
      observeSelectedRigion = this.selectedRegionSource.asObservable();

      public showContentSource      = new Rx.BehaviorSubject<Object>('{}');
      observeShowContent = this.showContentSource.asObservable();


      arr:Array<string>;
      regionArr:Array<string>;
      mainObj:Object;
      secondObj:Object;
      totalObj:Object;
      sumObj:Object;
      timestamp30DaysBack:Number;
      year:Number;
      showContent:Object;
      currentYear = (new Date()).getFullYear();
      yearsArr = [];

      constructor() { 


        this.initVars();
      }
    
      initVars(year = 0){
        this.regionArr = ["AMER","APJ","EMEA"];



        this.initAllObjectsj();

        this.arr = this.returnArr();
        this.timestamp30DaysBack = 0;// = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
        this.year = (year === 0) ? this.currentYear : year;



        //Subscribe to 
        this.messageSource.next(this.secondObj);
        this.totalSource.next(this.totalObj);
        this.sumSource.next(this.sumObj);
        this.regionSource.next(this.regionArr);
        this.showContentSource.next(this.showContent);
        

        this.geturl();
      }


      initAllObjectsj(){

          this.mainObj = {};
          this.showContent = {};

          this.secondObj = {};
          this.sumObj = {};
          this.totalObj = {};
          
          this.changeSelected(this.regionArr[0]);

          for (let index = 0; index < this.regionArr.length; index++) {
              const element = this.regionArr[index];
              this.secondObj[element] = {};
              this.sumObj[element] = {};
              this.totalObj[element] = this.initTotalObj(); // total object will hold all total data and will be genarated with second object (line after)
          }
      }


      changeSelected(selectedRegion:string){
        this.selectedRegionSource.next(selectedRegion);
      }

      returnArr(){
        return [
          "Distribution",
          "LDT Security Flag",
          "isVirt",
          "Lapos Git Status",
          "isNewUI",
          "System Region"
      ];
      }

      geturl(x = 0){
        
        var that = this;
        var arr = this.returnArr();

        var jsonData = {
          "jsonrpc": "2.0",
          "method": "item.get",
          "params": {
                "output": "extend",
                // "hostids": [ "10132", "10134", "10126", "10138", "10140", "10182", "10144", "10166", "10148", "10150", "10192", "10154"],
                // "hostids": [ "10138"],
                "filter": {"name": arr} ,
              "sortfield": "name"
          },
          "auth": "3e82b6804f8f61967fea9462631a5946",
          "id": 1
        };
      
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
                $('.'+name[0].replace(/ /g,'') + ' .xBadge')
                .addClass('tableTagBlue')
                .removeClass('animate');

                if(x+1 >= arr.length){
                  that.addTo2Object();
                  return;
                }
                
                x++;
                setTimeout(() => {
                  that.geturl(x);
                }, 100);
            }
            });
      }

      addTomainObj(data){
          for (let x = 0; x < data.result.length; x++) {
              const elm = data.result[x];
                if(!this.mainObj[elm.hostid]){
                  this.mainObj[elm.hostid] = [];
                }
                
                //Make region to be 1st element in host array
                if (elm.name === "System Region") {
                  this.mainObj[elm.hostid].unshift(elm);
                }else{
                  this.mainObj[elm.hostid].push(elm);
                }
            }
      }

      calctimeByDays(clock,days){
        var d = new Date(parseInt(clock));
        this.timestamp30DaysBack = new Date().getTime() - (days * 24 * 60 * 60 * 1000); 
        return parseInt(clock) < this.timestamp30DaysBack
      }

      calctimeByYear(clock){
        var d = new Date(parseInt(clock));
        var year = d.getFullYear();

        if(this.yearsArr.indexOf(year) < 0 && year != 1970){//insert year to year array container
          this.yearsArr.push(year)
        }
        return year !==  this.year;
      }

      addTo2Object(){

          var arr = this.returnArr();

          var dist = arr[0];
          var LDT = arr[1];
          var isVirt = arr[2];
          var Lapos = arr[3];
          var isNewUI = arr[4];
          var region = arr[5];

          var laposDateObj = {};

          for (var key in this.mainObj) {

              var elmContainer;
              var elmSum;
              var breakFor = false;
              var checkIfVirt = "p";
              var checkIfLapos;
              var checkIfisNew;
              var checkIfLDT;
              var regionElm = this.mainObj[key][0];
              var regionPos = regionElm.lastvalue;

                var a = this.regionArr.indexOf(regionPos);

              if (a < 0) {
                  // console.log(a,regionPos)
                  continue;
              }

              loop2:
              for (let i = 0; i < this.mainObj[key].length; i++) {
                  const elm = this.mainObj[key][i];
                  var clock = elm.lastclock + '000'; //adding 3 zero's because the date format is not valid
                  
                  var notValidTime = this.calctimeByYear(clock);

                  switch(elm.name) {
                        case dist: //IF DISTREBUITION
                            
                            if(elm.lastvalue === "0" || elm.lastvalue === "" || elm.lastvalue.indexOf("bash:") > -1){
                              breakFor = true;
                              break;
                            }

                            if(notValidTime){//IF NOT IN TIME PERIOD SELECTED
                              console.log(clock)
                              break loop2;
                            }
                            // console.log(elm.lastvalue);
                            elmContainer = elm.lastvalue;//GET THE Name OF ELEMENT

                            elmSum = elmContainer.split("-")[0];
                            if(this.secondObj[regionPos] === undefined){
                              debugger;
                            }
                            // this.secondObj[regionPos] = this.secondObj[regionPos] || {};
                            if(elmContainer in this.secondObj[regionPos]){
                              this.secondObj[regionPos][elmContainer]["total"]++;
                            }else{
                              this.initObj(elmContainer,regionPos);
                            }

                            if(elmSum in this.sumObj[regionPos]){
                              this.sumObj[regionPos][elmSum]["total"]++;
                            }else{
                              // console.log(elmSum,regionPos)
                              this.addSumObj(elmSum,regionPos);
                            }
                            this.totalObj[regionPos]["total"]++;

                            break;

                        case isVirt: //IF isVirt

                              var str = elm.lastvalue;

                              console.log(str)
                              if(elm.lastvalue !== "0"){
                                checkIfVirt = "v";
                                this.secondObj[regionPos][elmContainer]["isVirt"]++;
                                this.sumObj[regionPos][elmSum]["isVirt"]++;
                                this.totalObj[regionPos]["isVirt"]++;
                              }else{
                                this.secondObj[regionPos][elmContainer]["physical"]++;
                                this.sumObj[regionPos][elmSum]["physical"]++;
                                this.totalObj[regionPos]["physical"]++;
                              }
                              break;

                        case Lapos: //IF Lapos
                              if(elm.lastvalue === "0"){
                                checkIfLapos = "isLapos";
                              }else{
                                checkIfLapos = "nonLapos";
                              }


                              //###################################
                              //#### Add Dates to SUM Lapos object ####
                              //###################################

                                var date = new Date(parseInt(clock)); //get timestamp of lapos
                                var LaposDate = date.toISOString().split('T')[0];//change to readble date
                                // LaposDate = "2018-06-20"

                                
                                var dateObj = this.sumObj[regionPos][elmSum]["Lapos"]["dates"];
                                dateObj[LaposDate] = dateObj[LaposDate] || {}; // create {} if not exist
                                dateObj[LaposDate][checkIfLapos] = dateObj[LaposDate][checkIfLapos] || {}; // create {} if not exist
                                dateObj[LaposDate][checkIfLapos][checkIfVirt] = dateObj[LaposDate][checkIfLapos][checkIfVirt] || 0; // create {} if not exist
                                this.sumObj[regionPos][elmSum]["Lapos"]["dates"][LaposDate][checkIfLapos][checkIfVirt]++; // create {} if not exist
                              //#####

                              this.secondObj[regionPos][elmContainer]["Lapos"][checkIfLapos][checkIfVirt]++;
                              this.sumObj[regionPos][elmSum]["Lapos"][checkIfLapos][checkIfVirt]++;
                              this.totalObj[regionPos]["Lapos"][checkIfLapos][checkIfVirt]++;
                              break;

                        case isNewUI: //IF isNew
                              if(elm.lastvalue === "0" || elm.lastvalue === "NO"){
                                checkIfisNew = "isOld";
                              }else{
                                checkIfisNew = "isNew";
                              }

                              this.secondObj[regionPos][elmContainer]["isNew"][checkIfisNew]++;
                              this.sumObj[regionPos][elmSum]["isNew"][checkIfisNew]++;
                              this.totalObj[regionPos]["isNew"][checkIfisNew]++;
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
                          this.secondObj[regionPos][elmContainer]["LDT"][checkIfLDT][checkIfVirt]++;
                          this.sumObj[regionPos][elmSum]["LDT"][checkIfLDT][checkIfVirt]++;
                          this.totalObj[regionPos]["LDT"][checkIfLDT][checkIfVirt]++;

                          break;
                        }

                  if (breakFor){
                    break loop2;
                  }
              }
          }

          this.showContent['show'] = '1';
          console.log(this.sumObj)
      }

      initObj(lastvalue,regionPos){
        this.secondObj[regionPos][lastvalue] = {
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
              "dates" : []
            },
            "isNew"  : {
              "isNew" : 0,
              "isOld"  : 0
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

      addSumObj(lastvalue,regionPos){
        this.sumObj[regionPos][lastvalue] = {
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
              "dates" : []
            },
            "isNew"  : {
              "isNew" : 0,
              "isOld"  : 0
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
                "isNew"  : {
                  "isNew" : 0,
                  "isOld"  : 0
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
