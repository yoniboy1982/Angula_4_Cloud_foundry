import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumPhysical'
})
export class SumPhysicalPipe implements PipeTransform {

  transform(values: any, args?: any): any {
    var sum =  values.reduce((accuulator,currentValue)=> {
      return accuulator + parseInt(currentValue.physical);
  }, 0);
  return sum;
  }

}
