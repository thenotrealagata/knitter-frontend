import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { Stitch, AtomicStitch, CompositeStitch, Color } from '../charts/model/Chart';
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
export class StitchComponent implements OnChanges {
  stitch = input.required<Stitch>();
  colors = input<FormGroup<ColorPaletteForm>>();
  isHoverable = input<boolean>();
  showDescription = input<boolean>(false);

  stitchImage: any;

  AtomicStitch = AtomicStitch;
  CompositeStitch = CompositeStitch;

  defaultColor = "#fff";

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["stitch"]) {
      this.generateStitchImage();
    }
  }

  generateStitchImage(): void {
    this.stitchImage = "";
  }

  isAtomicStitch(stitch: Stitch): boolean {
    return 'type' in stitch;
  }

  isCompositeStitch(stitch: Stitch): boolean {
    return 'sequence' in stitch;
  }

}
