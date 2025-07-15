import { Pipe, PipeTransform } from '@angular/core';
import { AtomicStitch, AtomicStitchType, CableStitch, CompositeStitch, Stitch } from '../model/Chart';
import { ChartService } from '../services/chart.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'patternDescription'
})
export class PatternDescriptionPipe implements PipeTransform {
  constructor(
    private chartService: ChartService,
    private translate: TranslateService) {
  }

  transform(value: Stitch | Stitch[], isRightSide: boolean = false, trigger?: number) {
    if(Array.isArray(value)) {
      const array = isRightSide ? [...value].reverse() : value;

      let previousStitch: AtomicStitch;
      let sameStitchCounter = 1;
      const asAtomicStitch = (array as AtomicStitch[]).filter(stitch => stitch.type !== AtomicStitchType.NoStitch);
      return asAtomicStitch.reduce((description, stitch, i) => {
        if (!previousStitch) {
          description += this.translate.instant('PATTERN_DESCRIPTION.WITH', { color: stitch.color });
        } else if (previousStitch.color !== stitch.color) {
          description += this.describeStitch(previousStitch, sameStitchCounter) + " ";
          sameStitchCounter = 1;
          description += this.translate.instant('PATTERN_DESCRIPTION.WITH', { color: stitch.color });
        } else if (previousStitch.type === stitch.type) {
          sameStitchCounter++;
        } else {
          description += this.describeStitch(previousStitch, sameStitchCounter) + " ";
          sameStitchCounter = 1;
        }

        if (i === asAtomicStitch.length - 1) {
          description += this.describeStitch(asAtomicStitch[i], sameStitchCounter);
        }

        previousStitch = stitch;
        return description;
      }, "");
    } else {
      return this.describeStitch(value);
    }
  }

  describeStitch(stitch: Stitch, amount?: number): string {
    if ('type' in stitch) {
      // Atomic stitch
      return (stitch as AtomicStitch).type + (amount ? (" " + amount) : "");
    } else if ('sequence' in stitch) {
      // Composite stitch
      return this.chartService.getCableDescription(stitch as CableStitch);
    }

    return "";
  }

}
