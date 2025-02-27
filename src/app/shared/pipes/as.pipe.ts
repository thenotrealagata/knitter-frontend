import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'as',
})
export class AsPipe implements PipeTransform {

  // Based on https://stackoverflow.com/questions/45964576/type-casting-within-a-template-in-angular-2
  transform<T>(value: any, _type: (new (...args: any[]) => T) | T): T {
    return value as T;
  }

}
