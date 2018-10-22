import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumVirt'
})
export class SumVirtPipe implements PipeTransform {

  transform(values: any, args?: any): any {
    var sum =  values.reduce((accuulator,currentValue)=> {
      return accuulator + parseInt(currentValue.virtual);
  }, 0);
  return sum;
  }

}
