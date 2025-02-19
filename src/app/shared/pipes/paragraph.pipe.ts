import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paragraph'
})
export class ParagraphPipe implements PipeTransform {

  transform(value: string, characterCount?: number): unknown {
    return characterCount && value.length > characterCount ? value.substring(0, characterCount).trim() + '...' : value;
  }

}
