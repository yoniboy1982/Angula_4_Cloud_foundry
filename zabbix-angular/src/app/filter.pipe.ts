import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values: any[], args?: any): any {
      return values.filter(item => args === "All" || item.name === args);
  }

}
