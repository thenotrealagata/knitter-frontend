import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { Color, Stitch, AtomicStitch, CompositeStitch } from '../charts/model/Chart';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { AsPipe } from '../shared/pipes/as.pipe';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CurryPipe } from '../shared/services/curry.pipe';

@Component({
  selector: 'app-stitch',
  imports: [NgIf, AsPipe, NgTemplateOutlet, NzToolTipModule, CurryPipe],
  templateUrl: './stitch.component.html',
  styleUrl: './stitch.component.less'
})
export class StitchComponent implements OnChanges {
  stitch = input.required<Stitch>();
  colors = input<{ [key in Color]: string | undefined }>();
  isHoverable = input<boolean>();
  showDescription = input<boolean>(false);

  stitchImage: any;

  AtomicStitch = AtomicStitch;
  CompositeStitch = CompositeStitch;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["stitch"]) {
      this.generateStitchImage();
    }
  }

  generateStitchImage(): void {
    this.stitchImage = "";
  }

  isAtomicStitch(stitch: Stitch): boolean {
    return stitch instanceof AtomicStitch;
  }

  isCompositeStitch(stitch: Stitch): boolean {
    return stitch instanceof CompositeStitch;
  }

}
