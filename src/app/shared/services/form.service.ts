import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Chart, Stitch, Color, CableNeedleDirection, AtomicStitchType, CableStitch, Panel } from '../../model/Chart';
import { AuthenticationForm, CableStitchForm, ChartForm, ColorPaletteForm } from './form.interfaces';
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
        chart && chart.pattern ? chart.pattern : [], { validators: [Validators.required], nonNullable: true }
      ),
      image: new FormControl<string>("", { validators: Validators.required, nonNullable: true })
    });
  }

  formToChart(chartForm: FormGroup<ChartForm>, colorPaletteForm: FormGroup<ColorPaletteForm>, parentId?: number): Chart {
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

  formToPanel(chartForm: FormGroup<ChartForm>, colorPaletteForm: FormGroup<ColorPaletteForm>, includedCharts: number[], parentId?: number): Panel {
    return { ...this.formToChart(chartForm, colorPaletteForm, parentId), includedCharts: includedCharts };
  }

  cableStitchForm(): FormGroup<CableStitchForm> {
    return new FormGroup({
      stitchNumber: new FormControl<number>(2, {
        validators: Validators.required,
        nonNullable: true
      }),
      toCableNeedle: new FormControl<number>(1, {
        validators: Validators.required,
        nonNullable: true
      }),
      holdCableNeedle: new FormControl<CableNeedleDirection>(CableNeedleDirection.HOLD_IN_FRONT_OF_WORK, {
        validators: Validators.required,
        nonNullable: true
      }),
      sequence: new FormControl<(AtomicStitchType.Knit | AtomicStitchType.Purl)[]>([ AtomicStitchType.Knit, AtomicStitchType.Knit ], {
        validators: Validators.required,
        nonNullable: true
      })
    });
  }

  formToCableStitch(form: FormGroup<CableStitchForm>, color: Color): CableStitch {
    return new CableStitch(
      color,
      form.controls.sequence.value,
      form.controls.toCableNeedle.value,
      form.controls.holdCableNeedle.value
    )
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
