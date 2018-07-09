import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZFunctionsService {

  constructor() { }


  objectKeys(obj) {
    return Object.keys(obj);
  }
}
