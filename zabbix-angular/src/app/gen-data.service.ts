import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as Rx from "rxjs";
import { stringify } from '../../node_modules/@angular/compiler/src/util';


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
      regionArrValidation = [];

      constructor() { 
        this.initVars();
      }
    
      initVars(year = 0){
        this.regionArr = ["AMER","APJ","EMEA","Unknown","TOTAL"];

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

          this.secondObj = new Object();
          this.sumObj = new Object();
          this.totalObj = new Object();
          
          this.changeSelected(this.regionArr[0]);

          for (let index = 0; index < this.regionArr.length; index++) {
              const element = this.regionArr[index];
              this.secondObj[element] = new Object();
              this.sumObj[element] = new Object();
              this.totalObj[element] = this.initTotalObj(); // total object will hold all total data and will be genarated with second object (line after)
          }
      }


      changeSelected(selectedRegion:string){
        this.selectedRegionSource.next(selectedRegion);
      }

      returnArr(){
        return [
          "Distribution",
          "isVirt",
          "LDT Security Flag",
          "Lapos Git Status",
          "New Region",
          // "IP address",
          // "Host name FQDN"
      ];
      }

      geturl(x = 0){
        
        var that = this;
        var arr = this.returnArr();

        var jsonData = {
          "jsonrpc": "2.0",
          "method": "item.get",
          "params": {
              //  "output":  "extend",
                "output": ["name","lastvalue","lastclock","hostid","itemid"],
                // "hostids": [ "10132", "10134", "10126", "10138", "10140", "10182", "10144", "10166", "10148", "10150", "10192", "10154"],
                // "hostids": ["18968"],
                "filter": {"name": arr},
              "sortfield": "name"
          },
          "auth": "b78273200edc8584c09d748aadbb5b83",
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
                if (elm.name === "New Region") {
                  //## store all hostid that ddestnt match regions allowd
                  var isInHost = this.regionArr.indexOf(elm.lastvalue);
                  if (isInHost < 0) {

                    elm.lastvalue = "Unknown"
                    // console.log('pp',elm)
                    this.regionArrValidation.push(elm.hostid);
                  }

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

      filterHostsWithoutRegion(){
        for (let index = 0; index < this.regionArrValidation.length; index++) {
          const hostId = this.regionArrValidation[index];
          // delete this.mainObj[hostId]; 
        }
      }

      addTo2Object(){

          this.filterHostsWithoutRegion();
          var arr = this.returnArr();
          var total= [];

          var dist = arr[0];
          var isVirt = arr[1];          
          var LDT = arr[2];
          var Lapos = arr[3];
          var region = arr[4];
          var isNewUI = arr[5];
          var TOTAL = 'TOTAL';

          var laposDateObj = {};
          var unknown_hosts = [];

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
              var that = this;
              
              loop2:
              for (let i = 0; i < this.mainObj[key].length; i++) {
                  const elm = this.mainObj[key][i];
                  // console.log(elm)
                  var clock = elm.lastclock + '000'; //adding 3 zero's because the date format is not valid
                  var notValidTime = this.calctimeByYear(clock);
                  
                  // if(elm.lastvalue.indexOf("sh:") > -1){
                  //   debugger;
                  //   continue;
                  // }

                  switch(elm.name) {
                        case dist: //IF DISTREBUITION
                            
                            if(
                              elm.lastvalue === "0" ||
                              elm.lastvalue === "" ||
                              elm.lastclock === "0" ||
                              (elm.lastvalue.indexOf("bash:") > -1 
                              || elm.lastvalue.indexOf("cat:") > -1
                              || elm.lastvalue.indexOf("sh:") > -1
                              )){
                                //###ADD TO UNKNOWN
                                  unknown_hosts.push(elm);

                                  var area = this.mainObj[key][0]["lastvalue"];
                                  // debugger;
                                  if(!("Unknown" in this.secondObj[area])){
                                    this.initObj("Unknown",area);
                                  }
                                  if(!("Unknown" in this.secondObj["TOTAL"])){
                                    this.initObj("Unknown","TOTAL");
                                  }
                                  if(!("Unknown" in this.sumObj[area])){
                                    this.addSumObj("Unknown",area);
                                  }
                                  if(!("Unknown" in this.sumObj["TOTAL"])){
                                    this.addSumObj("Unknown","TOTAL");
                                  }

                                  this.secondObj[area]["Unknown"] = this.secondObj[area]["Unknown"] || {};
                                  this.secondObj[area]["Unknown"]["total"] = this.secondObj[area]["Unknown"]["total"] || 0;
                                  this.secondObj[area]["Unknown"]["total"]++;

                                  this.secondObj["TOTAL"]["Unknown"] = this.secondObj["TOTAL"]["Unknown"] || {};
                                  this.secondObj["TOTAL"]["Unknown"]["total"] = this.secondObj["TOTAL"]["Unknown"]["total"] || 0;
                                  this.secondObj["TOTAL"]["Unknown"]["total"]++;

                                  this.sumObj[area]["Unknown"] = this.sumObj[area]["Unknown"] || {};
                                  this.sumObj[area]["Unknown"]["total"] = this.sumObj[area]["Unknown"]["total"] || 0;
                                  this.sumObj[area]["Unknown"]["total"]++;    

                                  this.sumObj["TOTAL"]["Unknown"] = this.sumObj["TOTAL"]["Unknown"] || {};
                                  this.sumObj["TOTAL"]["Unknown"]["total"] = this.sumObj["TOTAL"]["Unknown"]["total"] || 0;
                                  this.sumObj["TOTAL"]["Unknown"]["total"]++;                                    

                                  this.totalObj[area]["total"]++; 
                                  this.totalObj["TOTAL"]["total"]++; 
                                //#######

                                breakFor = true;
                                break;
                              }

                            // if(notValidTime){//IF NOT IN TIME PERIOD SELECTED
                            //   break loop2;
                            // }
                            
                            elmContainer = elm.lastvalue; //GET THE Name OF ELEMENT
                            elmSum = elmContainer.split("-")[0];

                            if(!(elmContainer in this.secondObj[regionPos])){
                              this.initObj(elmContainer,regionPos);
                            }
                            if(!(elmContainer in this.secondObj[TOTAL])){
                              this.initObj(elmContainer,TOTAL);
                            }

                            //### ADD SUM TO TOTAL
                            if(!(elmSum in this.sumObj[regionPos])){
                              this.addSumObj(elmSum,regionPos);
                            }
                            if(!(elmSum in this.sumObj[TOTAL])){
                              this.addSumObj(elmSum,TOTAL);
                            }
                            //#######

                            break;

                        case isVirt: //IF isVirt

                              var checkIsVirt = "physical";
                              
                              if (
                                elm.lastvalue.toLowerCase() === 'vmware' ||
                                elm.lastvalue.toLowerCase() === 'virtualbox' ||
                                elm.lastvalue.toLowerCase() === 'xenserv' 
                              ) {
                                
                                checkIfVirt = "v";
                                checkIsVirt = "isVirt"; 
                              }

                              this.secondObj[regionPos][elmContainer][checkIsVirt]++;
                              this.secondObj[TOTAL][elmContainer][checkIsVirt]++;
                              this.secondObj[regionPos][elmContainer]["total"]++;
                              this.secondObj[TOTAL][elmContainer]["total"]++;
                              

                              this.sumObj[regionPos][elmSum][checkIsVirt]++;
                              this.sumObj[TOTAL][elmSum][checkIsVirt]++;
                              this.sumObj[TOTAL][elmSum]["total"]++;
                              this.sumObj[regionPos][elmSum]["total"]++;

                              this.totalObj[regionPos][checkIsVirt]++;
                              this.totalObj[TOTAL][checkIsVirt]++;
                              this.totalObj[regionPos]["total"]++;
                              this.totalObj[TOTAL]["total"]++; 

                              break;

                        case Lapos: //IF Lapos
                              // console.log()
                              var fatal = elm.lastvalue.includes("fatal:");
                              var laps = elm.lastvalue.toLowerCase();
                              if(laps === 'lapos'){
                                checkIfLapos = "isLapos";
                                total.push(elm.hostid);                       
                              }else{
                                checkIfLapos = "nonLapos";
                              }

                              //###################################
                              //#### Add Dates to SUM Lapos object ####
                              //###################################

                                var date = new Date(parseInt(clock)); //get timestamp of lapos
                                var LaposDate = date.toISOString().split('T')[0];//change to readble date
                                
                                // console.log(this.sumObj,regionPos,elmSum)
                                this.sumObj[regionPos][elmSum]["Lapos"] = this.sumObj[regionPos][elmSum]["Lapos"] || {};
                                this.sumObj[regionPos][elmSum]["Lapos"]["dates"] = this.sumObj[regionPos][elmSum]["Lapos"]["dates"] || {};
                                var dateObj = this.sumObj[regionPos][elmSum]["Lapos"]["dates"];
                                dateObj[LaposDate] = dateObj[LaposDate] || {}; // create {} if not exist
                                dateObj[LaposDate][checkIfLapos] = dateObj[LaposDate][checkIfLapos] || {}; // create {} if not exist
                                dateObj[LaposDate][checkIfLapos][checkIfVirt] = dateObj[LaposDate][checkIfLapos][checkIfVirt] || 0; // create {} if not exist
                                this.sumObj[regionPos][elmSum]["Lapos"]["dates"][LaposDate][checkIfLapos][checkIfVirt]++; // create {} if not exist

                                var dateObj = this.sumObj[TOTAL][elmSum]["Lapos"]["dates"];
                                dateObj[LaposDate] = dateObj[LaposDate] || {}; // create {} if not exist
                                dateObj[LaposDate][checkIfLapos] = dateObj[LaposDate][checkIfLapos] || {}; // create {} if not exist
                                dateObj[LaposDate][checkIfLapos][checkIfVirt] = dateObj[LaposDate][checkIfLapos][checkIfVirt] || 0; // create {} if not exist
                                this.sumObj[TOTAL][elmSum]["Lapos"]["dates"][LaposDate][checkIfLapos][checkIfVirt]++; // create {} if not exist


                              //#####

                              this.secondObj[regionPos][elmContainer] =  this.secondObj[regionPos][elmContainer]|| {}; 
                              this.secondObj[regionPos][elmContainer]["Lapos"] =  this.secondObj[regionPos][elmContainer]["Lapos"]|| {}; 
                              this.secondObj[regionPos][elmContainer]["Lapos"][checkIfLapos] =  this.secondObj[regionPos][elmContainer]["Lapos"][checkIfLapos]|| {}; 
                              this.secondObj[regionPos][elmContainer]["Lapos"][checkIfLapos][checkIfVirt] =  this.secondObj[regionPos][elmContainer]["Lapos"][checkIfLapos][checkIfVirt]|| 0; 
                      
                              this.secondObj[regionPos][elmContainer]["Lapos"][checkIfLapos][checkIfVirt]++;
                              this.secondObj['TOTAL'][elmContainer]["Lapos"][checkIfLapos][checkIfVirt]++;

                              this.sumObj[regionPos][elmSum]["Lapos"][checkIfLapos][checkIfVirt]++;
                              this.sumObj[TOTAL][elmSum]["Lapos"][checkIfLapos][checkIfVirt]++;

                              this.totalObj[regionPos]["Lapos"][checkIfLapos][checkIfVirt]++;
                              this.totalObj[TOTAL]["Lapos"][checkIfLapos][checkIfVirt]++;
                              break;

                        case isNewUI: //IF isNew
                              if(elm.lastvalue === "0" || elm.lastvalue === "NO"){
                                checkIfisNew = "isOld";
                              }else{
                                checkIfisNew = "isNew";
                              }

                              this.secondObj[regionPos][elmContainer]["isNew"][checkIfisNew]++;
                              this.secondObj['TOTAL'][elmContainer]["isNew"][checkIfisNew]++;

                              this.sumObj[regionPos][elmSum]["isNew"][checkIfisNew]++;
                              this.sumObj[TOTAL][elmSum]["isNew"][checkIfisNew]++;

                              this.totalObj[regionPos]["isNew"][checkIfisNew]++;
                              this.totalObj[TOTAL]["isNew"][checkIfisNew]++;
                              break;                              
                      }

                  switch(elm.name) {
                      case LDT: //IF LDT
                      var notValidTime = this.calctimeByDays(clock,30);
                      if(notValidTime){
                        break;
                      }
                      if(elm.lastvalue === "0"){
                        checkIfLDT = "isLDT";
                      }else{
                        checkIfLDT = "nonLDT";
                      }
                      
                      this.secondObj[regionPos][elmContainer] =  this.secondObj[regionPos][elmContainer]|| {}; 
                      this.secondObj[regionPos][elmContainer]["LDT"] =  this.secondObj[regionPos][elmContainer]["LDT"]|| {}; 
                      this.secondObj[regionPos][elmContainer]["LDT"][checkIfLDT] =  this.secondObj[regionPos][elmContainer]["LDT"][checkIfLDT]|| {}; 
                      this.secondObj[regionPos][elmContainer]["LDT"][checkIfLDT][checkIfVirt] =  this.secondObj[regionPos][elmContainer]["LDT"][checkIfLDT][checkIfVirt]|| 0; 
                      

                      this.sumObj[regionPos][elmSum] =  this.sumObj[regionPos][elmSum]|| {}; 
                      this.sumObj[regionPos][elmSum]["LDT"] =  this.sumObj[regionPos][elmSum]["LDT"]|| {}; 
                      this.sumObj[regionPos][elmSum]["LDT"][checkIfLDT] =  this.sumObj[regionPos][elmSum]["LDT"][checkIfLDT]|| {}; 
                      this.sumObj[regionPos][elmSum]["LDT"][checkIfLDT][checkIfVirt] =  this.sumObj[regionPos][elmSum]["LDT"][checkIfLDT][checkIfVirt]|| 0; 
                      
                      this.secondObj[regionPos][elmContainer]["LDT"][checkIfLDT][checkIfVirt]++;
                      this.secondObj['TOTAL'][elmContainer]["LDT"][checkIfLDT][checkIfVirt]++;
                      
                      this.sumObj[regionPos][elmSum]["LDT"][checkIfLDT][checkIfVirt]++;
                      this.sumObj[TOTAL][elmSum]["LDT"][checkIfLDT][checkIfVirt]++;

                      this.totalObj[regionPos]["LDT"][checkIfLDT][checkIfVirt]++;
                      this.totalObj[TOTAL]["LDT"][checkIfLDT][checkIfVirt]++;

                      break;
                    }

                  if (breakFor){
                    break loop2;
                  }
              }
          }

          this.showContent['show'] = '1';
          console.log("unknown_hosts",unknown_hosts)
          // console.log(this.secondObj)
          // console.log('total',this.totalObj)
      }

      initObj(lastvalue,regionPos){
        
        this.secondObj[regionPos][lastvalue] = {
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
