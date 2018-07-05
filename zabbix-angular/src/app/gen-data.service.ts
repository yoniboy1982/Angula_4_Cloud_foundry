import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { resolve } from 'q';


@Injectable({
  providedIn: 'root'
})
export class GenDataService {

    constructor() { 
      // this.promiseToFillDAta.then()
    }
    
    arr = ["Distribution", "LDT Security Flag","isVirt","Lapos Git Status"];

    jsonData = {
      "jsonrpc": "2.0",
      "method": "item.get",
      "params": {
            "output": "extend",
            "hostids": [ "10132", "10134","10154"],
            // "hostids": [ "10132", "10134", "10126", "10138", "10140", "10182", "10144", "10166", "10148", "10150", "10192", "10154"],
              "filter": {"name": this.arr} ,
          "sortfield": "name"
      },
      "auth": "3e82b6804f8f61967fea9462631a5946",
      "id": 1
    };

    //############
    //ACTIVATE FUNCTION TO FETCH DATA

    promiseToFillDAta = new Promise(function(resolve,req){

      var mainObj = {};
      var secondObj = {};

      function returnArr(){
        return ["Distribution", "LDT Security Flag","isVirt","Lapos Git Status"];
      }

      function geturl(x){

        var arr = returnArr();

        var jsonData = {
          "jsonrpc": "2.0",
          "method": "item.get",
          "params": {
                "output": "extend",
                // "hostids": [ "10132", "10134", "10126", "10138", "10140", "10182", "10144", "10166", "10148", "10150", "10192", "10154"],
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

                addTomainObj(data);

                console.log(jsonData.params.filter.name);
                var name = jsonData.params.filter.name;
                $('.'+name[0].replace(/ /g,'') + ' .xBadge').css("background","green").removeClass('animate');

                if(x+1 >= arr.length){
                  addTo2Object();
                  addTotal();
                  resolve(secondObj)
                  return;
                }
                
                x++;
                setTimeout(() => {
                  geturl(x);
                }, 3000);
            }
            });
      }

      geturl(0);
   
      function addTomainObj(data){
          for (let x = 0; x < data.result.length; x++) {
              const elm = data.result[x];
                if(!mainObj[elm.hostid]){
                  mainObj[elm.hostid] = [];
                }
                mainObj[elm.hostid].push(elm);
            }
      }

      function addTo2Object(){

          var timestamp30DaysBack = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
          var arr = returnArr();
          var dist = arr[0];
          var LDT = arr[1];
          var isVirt = arr[2];
          var Lapos = arr[3];

          for (var key in mainObj) {

              var elmContainer;
              var breakFor = false;
              var checkIfVirt = "p";
              var checkIfLapos;
              var checkIfLDT;

              loop2:
              for (let i = 0; i < mainObj[key].length; i++) {
                  const elm = mainObj[key][i];
                
                  switch(elm.name) {
                        case dist: //IF DISTREBUITION

                            //### Total clients reported in the last 30 days
                            //################
                            
                            var clock = elm.lastclock + '000';//adding 3 zero's because the date format is not valid

                            //####
                            var d = new Date(parseInt(clock));
                            if(d.getFullYear() == 2017)
                              console.log(d.getFullYear())

                            if(parseInt(clock) < timestamp30DaysBack){
                              // console.log(elm.name)
                              break loop2;
                            }

                            if(elm.lastvalue === "0" || elm.lastvalue === ""){
                              breakFor = true;
                              break;
                            }
                            elmContainer = elm.lastvalue;//GET THE Name OF ELEMENT
                            
                            if(elmContainer in secondObj){
                              secondObj[elmContainer]["total"]++;
                            }else{
                              initObj(elmContainer);
                            }
                            break;

                        case isVirt: //IF isVirt

                              if(elm.lastvalue !== "0"){
                                checkIfVirt = "v";
                                secondObj[elmContainer]["isVirt"]++;
                              }else{
                                secondObj[elmContainer]["physical"]++;
                              }
                              break;

                        case Lapos: //IF Lapos
                              if(elm.lastvalue === "0"){
                                checkIfLapos = "isLapos";
                                // secondObj[Lapos]["isVirt"]++;
                              }else{
                                checkIfLapos = "nonLapos";
                                // secondObj[Lapos]["physical"]++;
                              }

                              secondObj[elmContainer]["Lapos"][checkIfLapos][checkIfVirt]++;
                              // secondObj[Lapos]["total"]++;
                              break;

                        case LDT: //IF LDT
                              if(elm.lastvalue === "0"){
                                checkIfLDT = "isLDT";
                                // secondObj[LDT]["isVirt"]++;
                              }else{
                                checkIfLDT = "nonLDT";

                                // secondObj[LDT]["physical"]++;
                              }
                              secondObj[elmContainer]["LDT"][checkIfLDT][checkIfVirt]++;

                              // secondObj[LDT]["total"]++;
                              break;
                  } 

                  if (breakFor){
                    break loop2;
                  }
                        
              }
          }
      }

      function initObj(lastvalue){
        secondObj[lastvalue] = {
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

      function addTotal(){
      }

  });

  
    //
      
}
