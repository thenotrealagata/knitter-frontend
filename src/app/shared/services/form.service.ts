import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Chart, Stitch, Color } from '../../charts/model/Chart';
import { ChartForm, ColorPaletteForm } from './form.interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  chartForm(chart?: Chart): FormGroup<ChartForm> {
    return new FormGroup({
      title: new FormControl<string>(chart ? chart.title : "", {
        validators: Validators.required,
        nonNullable: true
      }),
      description: new FormControl<string>(chart ? chart.description : "", {
        validators: Validators.required,
        nonNullable: true
      }),
      width: new FormControl<number>(chart ? chart.width : 0, {
        validators: Validators.required,
        nonNullable: true
      }),
      height: new FormControl<number>(chart ? chart.height : 0, {
        validators: Validators.required,
        nonNullable: true
      }),
      isFlat: new FormControl<boolean>(chart ? chart.flat : true, {
        validators: Validators.required,
        nonNullable: true,
      }),
      pattern: new FormControl<Stitch[][]>(
        chart ? chart.pattern : [], { validators: [Validators.required, this.getChartValidator()], nonNullable: true }
      ),
      colors: this.colorPaletteForm(chart?.colors)
    });
  }

  getChartValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // TODO write validation logic
      control = control as FormControl<Stitch[][]>;

      return null;
    }
  }

  colorPaletteForm(colors?: {[key in Color]?: string}): FormGroup<ColorPaletteForm> {
    if (colors) {
      const controls = Object.keys(colors).reduce((controls, color) => {
        const colorKey = color as Color;
        if (colors[colorKey]) {
          controls[colorKey] = new FormControl(colors[colorKey], {
            validators: Validators.required,
            nonNullable: true,
          });
        }
        return controls;
      }, {} as ColorPaletteForm);
      return new FormGroup(controls as ColorPaletteForm);
    } else {
      return new FormGroup({
        [Color.MC]: new FormControl("#fff", {
          validators: Validators.required,
          nonNullable: true,
        })
      });
    }
  }

  chartFormToChart(chartForm: FormGroup<ChartForm>): Chart {
    return {
      title: chartForm.controls.title.value,
      description: chartForm.controls.description.value,
      flat: chartForm.controls.isFlat.value,
      pattern: chartForm.controls.pattern.value,
      width: chartForm.controls.width.value,
      height: chartForm.controls.height.value,
      colors: chartForm.controls.colors.value,
    };
  }
}
