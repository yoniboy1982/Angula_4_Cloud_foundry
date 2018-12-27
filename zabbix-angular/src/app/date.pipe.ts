import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(values: any[], args?: any): any {

    return values.filter(item => {

      var itemDate = new Date((item.timestamp).split(' ')[0]).getTime();
      let d1 = new Date();
      var minus = d1.setDate(d1.getDate() - 30);
      console.log(itemDate > minus)
      // debugger;
      return itemDate > minus ;
    });
}

}
