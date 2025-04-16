import { Component, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChartForm, ColorPaletteForm } from '../../shared/services/form.interfaces';
import { StitchComponent } from '../stitch/stitch.component';
import { Chart, Stitch } from '../../shared/model/Chart';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-chart-block',
  imports: [StitchComponent, NgTemplateOutlet],
  templateUrl: './chart-block.component.html',
  styleUrl: './chart-block.component.less'
})
export class ChartBlockComponent {
  chartForm = input<FormGroup<ChartForm>>();
  chart = input<Chart>();
  colors = input.required<FormGroup<ColorPaletteForm>>();

  showRowLabels = input<boolean>(true);
  stitchSize = input<number>(20);

  stitchEvent = output<{
    stitch: Stitch;
    event: 'click' | 'mouseover' | 'mouseout'
  }>();
}
