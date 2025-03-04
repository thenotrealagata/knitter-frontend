import { Component, ViewChildren } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AtomicStitch, AtomicStitchType, Color, Stitch } from '../model/Chart';
import { StitchComponent } from '../../stitch/stitch.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { FormService } from '../../shared/services/form.service';
import { ChartForm, ColorPaletteForm } from '../../shared/services/form.interfaces';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ColorPaletteComponent } from "../color-palette/color-palette.component";
import { NzCardModule } from 'ng-zorro-antd/card';
import { PatternDescriptionPipe } from '../../shared/pipes/pattern-description.pipe';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadComponent } from 'ng-zorro-antd/upload';

const ngZorroModules = [NzLayoutModule, NzFlexModule, NzCardModule, NzFormModule, NzInputModule, NzPageHeaderModule, NzButtonModule, NzSwitchModule, NzUploadComponent];

@Component({
  selector: 'app-chart-editor',
  imports: [StitchComponent, NgIf, ColorPaletteComponent, PatternDescriptionPipe, ReactiveFormsModule, ...ngZorroModules],
  templateUrl: './chart-editor.component.html',
  styleUrl: './chart-editor.component.less'
})
export class ChartEditorComponent {
  selectedStitch: Stitch | undefined;
  selectedColor: Color = Color.MC;
  selectedStitchTrigger = 0;

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
    const pattern = [];
    for (let i = 0; i < height; i++) {
      const column = [];
      for (let j = 0; j < width; j++) {
        column.push(new AtomicStitch(Color.MC, AtomicStitchType.Knit));
      }
      pattern.push(column);
    }

    return pattern;
  }

  colorSelected(color: Color) {
    this.selectedColor = color;
    this.atomicStitchInventory.forEach(stitch => stitch.color = this.selectedColor);
    this.selectedStitchTrigger++;
  }

  stitchSelected(stitch: Stitch) {
    this.selectedStitch = stitch;
  }

  drawStitch(stitch: Stitch) {
    if (stitch instanceof AtomicStitch && this.selectedStitch instanceof AtomicStitch) {
      stitch.color = this.selectedStitch.color;
      stitch.type = this.selectedStitch.type;
    }
    // TODO other cases
  }

  uploadFile(event: unknown) {
    console.log('upload file', event);
  }
}
