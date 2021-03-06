import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getHMS'
})
export class GetHMSPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return new Date(value);
  }

}
