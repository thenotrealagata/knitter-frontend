import { AtomicStitchType, CableNeedleDirection, Color, Stitch } from "../../model/Chart";
import { FormControl } from "@angular/forms";

export interface ChartForm {
  title: FormControl<string>;
  description: FormControl<string>;
  width: FormControl<number>;
  height: FormControl<number>;
  isFlat: FormControl<boolean>;
  pattern: FormControl<Stitch[][]>;
  image: FormControl<string>;
}

export interface CableStitchForm {
  stitchNumber: FormControl<number>;
  toCableNeedle: FormControl<number>;
  holdCableNeedle: FormControl<CableNeedleDirection>;
  sequence: FormControl<(AtomicStitchType.Knit | AtomicStitchType.Purl)[]>;
}

export interface ColorPaletteForm {
  [Color.MC]: FormControl<string>;
  [Color.CC1]?: FormControl<string>;
  [Color.CC2]?: FormControl<string>;
  [Color.CC3]?: FormControl<string>;
  [Color.CC4]?: FormControl<string>;
}

export interface AuthenticationForm {
  username: FormControl<string>;
  password: FormControl<string>;
}