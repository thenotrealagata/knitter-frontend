import { Component, input } from '@angular/core';
import { Stitch, AtomicStitch, CompositeStitch, AtomicStitchType, CableStitch, CableNeedleDirection } from '../model/Chart';
import { NgTemplateOutlet } from '@angular/common';
import { AsPipe } from '../shared/pipes/as.pipe';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CurryPipe } from '../shared/services/curry.pipe';
import { ColorPaletteForm } from '../shared/services/form.interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stitch',
  imports: [AsPipe, NgTemplateOutlet, NzToolTipModule, CurryPipe],
  templateUrl: './stitch.component.html',
  styleUrl: './stitch.component.less'
})
export class StitchComponent {
  stitch = input.required<Stitch>();
  colors = input<FormGroup<ColorPaletteForm>>();
  isHoverable = input<boolean>();
  showDescription = input<boolean>(false);
  size = input<number>(20); // Stitch component size in pixels
  stroke = input<string>("black");

  AtomicStitch = AtomicStitch;
  AtomicStitchType = AtomicStitchType;
  CompositeStitch = CompositeStitch;
  CableStitch = CableStitch;
  CableNeedleDirection = CableNeedleDirection;

  defaultColor = "#fff";

  leftCableContainsPurl(cableStitch: CableStitch) {
    return cableStitch.sequence.slice(cableStitch.toCableNeedle).some(stitch => stitch.type === AtomicStitchType.Purl);
  }

  rightCableContainsPurl(cableStitch: CableStitch) {
    return cableStitch.sequence.slice(0, cableStitch.toCableNeedle).some(stitch => stitch.type === AtomicStitchType.Purl);
  }

  getCableDescription(cableStitch: CableStitch): string {
    // Name structure: L/C [direction] where L is width of left cable, R is width of right cable
    const stitchNumbers = `${cableStitch.sequence.length - cableStitch.toCableNeedle}/${cableStitch.toCableNeedle}`;

    // Right cross (RC): left cable over right cable
    // Left cross (LC): right cable over left cable
    // RPC/LPC: right purl cable & left purl cable: sequence includes purl stitch
    const includesPurl = cableStitch.sequence.some(stitch => stitch.type === AtomicStitchType.Purl) ? "P" : "";
    const crossDirection = 
      (cableStitch.holdCableNeedle === CableNeedleDirection.HOLD_BEHIND_WORK ? "R" : "L")
      + includesPurl + "C";

    return `${stitchNumbers} ${crossDirection}`;
  }

  isAtomicStitch(stitch: Stitch): boolean {
    return 'type' in stitch;
  }

  isCompositeStitch(stitch: Stitch): boolean {
    return 'sequence' in stitch;
  }

}
