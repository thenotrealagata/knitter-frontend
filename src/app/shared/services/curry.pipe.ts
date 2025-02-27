import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'curry'
})
export class CurryPipe implements PipeTransform {

  transform(value: Function, ...args: unknown[]): unknown {
    return value(...args);
  }

}
