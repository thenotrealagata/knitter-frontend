import { Component, input } from '@angular/core';
import { Stitch, AtomicStitch, CompositeStitch, AtomicStitchType, CableStitch, CableNeedleDirection } from '../../shared/model/Chart';
import { NgTemplateOutlet } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormGroup } from '@angular/forms';
import { ChartService } from '../../shared/services/chart.service';
import { ColorPaletteForm } from '../../shared/services/form.interfaces';
import { CurryPipe } from '../../shared/pipes/curry.pipe';
import { AsPipe } from '../../shared/pipes/as.pipe';

@Component({
  selector: 'app-stitch',
  imports: [AsPipe, NgTemplateOutlet, NzToolTipModule, CurryPipe],
  templateUrl: './stitch.component.html',
  styleUrl: './stitch.component.less'
})
export class StitchComponent {
  stitch = input.required<Stitch>();
  colors = input<FormGroup<ColorPaletteForm>>();
  showDescription = input<boolean>(false);
  size = input<number>(20); // Stitch component size in pixels
  stroke = input<string>("black");

  AtomicStitch = AtomicStitch;
  AtomicStitchType = AtomicStitchType;
  CompositeStitch = CompositeStitch;
  CableStitch = CableStitch;
  CableNeedleDirection = CableNeedleDirection;

  defaultColor = "#fff";
  noStitchColor = "#a6a6a6";

  chartService: ChartService;

  constructor(chartService: ChartService) {
    this.chartService = chartService;
  }

  leftCableContainsPurl(cableStitch: CableStitch) {
    return cableStitch.sequence.slice(0, cableStitch.sequence.length - cableStitch.toCableNeedle).some(stitch => stitch === AtomicStitchType.Purl);
  }

  rightCableContainsPurl(cableStitch: CableStitch) {
    return cableStitch.sequence.slice(-1 * cableStitch.toCableNeedle).some(stitch => stitch === AtomicStitchType.Purl);
  }
}
