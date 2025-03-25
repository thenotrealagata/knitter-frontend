import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Chart, Stitch, Color } from '../../model/Chart';
import { AuthenticationForm, ChartForm, ColorPaletteForm } from './form.interfaces';
import { AuthenticationRequest } from '../../model/User';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  chartForm(chart?: Partial<Chart>): FormGroup<ChartForm> {
    return new FormGroup({
      title: new FormControl<string>(chart && chart.title ? chart.title : "", {
        validators: Validators.required,
        nonNullable: true
      }),
      description: new FormControl<string>(chart && chart.description ? chart.description : "", {
        validators: Validators.required,
        nonNullable: true
      }),
      width: new FormControl<number>(chart && chart.width ? chart.width : 0, {
        validators: Validators.required,
        nonNullable: true
      }),
      height: new FormControl<number>(chart && chart.height ? chart.height : 0, {
        validators: Validators.required,
        nonNullable: true
      }),
      isFlat: new FormControl<boolean>(chart && chart.flat ? chart.flat : true, {
        validators: Validators.required,
        nonNullable: true,
      }),
      pattern: new FormControl<Stitch[][]>(
        chart && chart.pattern ? chart.pattern : [], { validators: [Validators.required, this.getChartValidator()], nonNullable: true }
      ),
      image: new FormControl<string>("", { validators: Validators.required, nonNullable: true })
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

  formToChart(chartForm: FormGroup<ChartForm>, colorPaletteForm: FormGroup<ColorPaletteForm>, parentId?: number): Chart {
    // TODO this will break if image is not provided
    return {
      title: chartForm.controls.title.value,
      description: chartForm.controls.description.value,
      flat: chartForm.controls.isFlat.value,
      pattern: chartForm.controls.pattern.value,
      width: chartForm.controls.width.value,
      height: chartForm.controls.height.value,
      colors: colorPaletteForm.value,
      parentId: parentId,
      filePath: chartForm.controls.image.value!
    };
  }

  authenticationForm(): FormGroup<AuthenticationForm> {
    return new FormGroup({
      username: new FormControl<string>("", { validators: Validators.required, nonNullable: true }),
      password: new FormControl<string>("", { validators: Validators.required, nonNullable: true })
    });
  }

  formToAuthRequest(form: FormGroup<AuthenticationForm>): AuthenticationRequest {
    return {
      username: form.controls.username.value,
      password: form.controls.password.value
    };
  }
}
