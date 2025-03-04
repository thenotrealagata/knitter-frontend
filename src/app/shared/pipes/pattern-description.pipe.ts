import { Pipe, PipeTransform } from '@angular/core';
import { AtomicStitch, CompositeStitch, Stitch } from '../../charts/model/Chart';

@Pipe({
  name: 'patternDescription'
})
export class PatternDescriptionPipe implements PipeTransform {

  transform(value: Stitch | Stitch[], trigger: number) {
    if(Array.isArray(value)) {
      return value.reduce((description, stitch) => description += " " + this.describeStitch(stitch), "");
    } else {
      return this.describeStitch(value);
    }
  }

  describeStitch(stitch: Stitch): string {
    if (stitch instanceof AtomicStitch) {
      return `${stitch.type} with ${stitch.color}`;
    } else if (stitch instanceof CompositeStitch) {
      let sameStitchCounter = 0;
      return stitch.sequence.reduce((description, atomicStitch, i) => {
        if (i < stitch.sequence.length - 1 && atomicStitch.type === stitch.sequence[i + 1].type) {
          sameStitchCounter += 1;
        } else if (sameStitchCounter > 0) {

        }
        return description;
      }, "");
    }

    return "";
  }

}
