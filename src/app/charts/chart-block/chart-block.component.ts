import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChartForm, ColorPaletteForm } from '../../shared/services/form.interfaces';
import { StitchComponent } from '../../stitch/stitch.component';
import { Chart, Stitch } from '../model/Chart';
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

  stitchEvent = output<{
    stitch: Stitch;
    event: 'click' | 'mouseenter' | 'mouseout'
  }>();
}
