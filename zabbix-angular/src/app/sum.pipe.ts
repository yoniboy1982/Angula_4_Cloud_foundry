import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(values: any, args?: any): any {
    var sum =  values.reduce((accuulator,currentValue)=> {
        return accuulator + parseInt(currentValue.total);
    }, 0);
    return sum;
  }

}
