import { Pipe, PipeTransform } from '@angular/core';
import { AtomicStitch, CableStitch, CompositeStitch, Stitch } from '../../model/Chart';
import { ChartService } from '../services/chart.service';

@Pipe({
  name: 'patternDescription'
})
export class PatternDescriptionPipe implements PipeTransform {
  chartService: ChartService;

  constructor(chartService: ChartService) {
    this.chartService = chartService;
  }

  // TODO assumes atomic stitches, this will break with the introduction of composites
  transform(value: Stitch | Stitch[], trigger?: number) {
    if(Array.isArray(value)) {
      let previousStitch: AtomicStitch;
      let sameStitchCounter = 1;
      const asAtomicStitch = value as AtomicStitch[];
      return asAtomicStitch.reduce((description, stitch, i) => {
        if (!previousStitch) {
          description += "With " + stitch.color + " ";
        } else {
          if (previousStitch.color !== stitch.color) {
            description += "Switch to " + stitch.color + " ";
          } else if (previousStitch.type === stitch.type) {
            sameStitchCounter++;
          } else {
            description += this.describeStitch(previousStitch, sameStitchCounter);
          }
        }

        if (i === asAtomicStitch.length - 1) {
          description += this.describeStitch(previousStitch, sameStitchCounter);
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
      return (stitch as AtomicStitch).type + " " + (amount ? amount : "");
    } else if ('sequence' in stitch) {
      // Composite stitch
      return this.chartService.getCableDescription(stitch as CableStitch);
    }

    return "";
  }

}
