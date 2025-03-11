import { Color, Stitch } from "../../charts/model/Chart";
import { FormControl, FormGroup } from "@angular/forms";

export enum ChartFormError {

}

export interface ChartForm {
  title: FormControl<string>;
  description: FormControl<string>;
  width: FormControl<number>;
  height: FormControl<number>;
  isFlat: FormControl<boolean>;
  pattern: FormControl<Stitch[][]>;
}

export interface ChartRowForm {
  row: FormControl<number>;
  column: FormControl<number>;
  stitch: Stitch;
}

export interface ColorPaletteForm {
  [Color.MC]: FormControl<string>;
  [Color.CC1]?: FormControl<string>;
  [Color.CC2]?: FormControl<string>;
  [Color.CC3]?: FormControl<string>;
  [Color.CC4]?: FormControl<string>;
}