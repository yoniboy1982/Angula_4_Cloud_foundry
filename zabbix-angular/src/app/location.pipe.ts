import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'location'
})
export class LocationPipe implements PipeTransform {

  transform(values: any, args?: any): any {
    
    return values.filter((item) => args === 'TOTAL' || item.region == args);
  }

}
