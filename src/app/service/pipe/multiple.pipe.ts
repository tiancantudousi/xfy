import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiple'
})
export class MultiplePipe implements PipeTransform {

  transform(value: string, args?: number): any {
    let start=value.indexOf('(');
    let end=value.indexOf(')');
    if(args){
       return value.slice(start+1,end);
    }
    else{
      return value.slice(0,start);
    }
  
   }
  
}
