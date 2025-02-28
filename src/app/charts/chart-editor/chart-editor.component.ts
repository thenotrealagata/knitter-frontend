import { Component, ViewChildren } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AtomicStitch, AtomicStitchType, Color, Stitch } from '../model/Chart';
import { StitchComponent } from '../../stitch/stitch.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { ChartForm, ColorPaletteForm, FormService } from '../../shared/services/form.service';
import { FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ColorPaletteComponent } from "../color-palette/color-palette.component";
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-chart-editor',
  imports: [NzLayoutModule, StitchComponent, NzFlexModule, NgIf, ColorPaletteComponent, NzCardModule],
  templateUrl: './chart-editor.component.html',
  styleUrl: './chart-editor.component.less'
})
export class ChartEditorComponent {
  selectedStitch: Stitch | undefined;
  selectedColor: Color = Color.MC;

  chartForm: FormGroup<ChartForm>;
  colorPaletteForm: FormGroup<ColorPaletteForm>;

  colorPaletteEditorMode = true;

  atomicStitchInventory = Object.keys(AtomicStitchType)
    .filter(key => isNaN(Number(key)))
    .map(stitchType => new AtomicStitch(this.selectedColor, stitchType as AtomicStitchType));

  constructor(formService: FormService) {
    this.chartForm = formService.chartForm({
      title: '',
      description: '',
      width: 10,
      height: 10,
      isFlat: true,
      pattern: this.initializePattern(10, 10)
    });

    this.colorPaletteForm = formService.colorPaletteForm({
      [Color.MC]: "#fefefe",
      [Color.CC1]: "#792960",
      [Color.CC2]: "#CE7DA5"
    });
  }

  initializePattern(width: number, height: number): Stitch[][] {
    // TODO on WS it should be purl?
    // Initialize with stockinette pattern
    return Array.from({ length: width }).fill(
      Array.from({ length: height }).fill(new AtomicStitch(Color.MC, AtomicStitchType.Knit)) as Stitch[]
    ) as Stitch[][];
  }

  colorSelected(color: Color) {
    this.selectedColor = color;
    this.atomicStitchInventory.forEach(stitch => stitch.color = this.selectedColor);
  }
}
