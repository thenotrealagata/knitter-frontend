import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AtomicStitch, AtomicStitchType, Color, Stitch } from '../model/Chart';
import { StitchComponent } from '../../stitch/stitch.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { ChartForm, FormService } from '../../shared/services/form.service';
import { FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-chart-editor',
  imports: [NzLayoutModule, StitchComponent, NzFlexModule, NgIf],
  templateUrl: './chart-editor.component.html',
  styleUrl: './chart-editor.component.less'
})
export class ChartEditorComponent {
  selectedStitch: Stitch | undefined;
  selectedColor: Color = Color.MC;

  chartForm: FormGroup<ChartForm>;

  constructor(formService: FormService) {
    this.chartForm = formService.chartForm({
      title: '',
      description: '',
      width: 10,
      height: 10,
      isFlat: true,
      pattern: this.initializePattern(10, 10)
    });
  }

  initializePattern(width: number, height: number): Stitch[][] {
    // TODO on WS it should be purl?
    // Initialize with stockinette pattern
    return Array.from({ length: width }).fill(
      Array.from({ length: height }).fill(new AtomicStitch(Color.MC, AtomicStitchType.Knit)) as Stitch[]
    ) as Stitch[][];
  }

  atomicStitchInventory = Object.keys(AtomicStitchType)
    .filter(key => isNaN(Number(key)))
    .map(stitchType => new AtomicStitch(Color.MC, stitchType as AtomicStitchType));

  colors: { [key in Color]: string | undefined } = {
    [Color.MC]: "#fff",
    [Color.CC1]: undefined,
    [Color.CC2]: undefined,
    [Color.CC3]: undefined,
    [Color.CC4]: undefined,
    [Color.CC5]: undefined
  };
}
