import { Component, input, model, output } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { ColorPaletteForm } from '../../shared/services/form.interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { Color } from '../model/Chart';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { AsPipe } from '../../shared/pipes/as.pipe';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-color-palette',
  imports: [ReactiveFormsModule, NzFlexModule, NzFormModule, NzColorPickerModule, NzIconDirective, AsPipe, NzCardModule],
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.less'
})
export class ColorPaletteComponent {
  colors = model.required<FormGroup<ColorPaletteForm>>();
  editorMode = model<boolean>(false);
  allowSelectMode = input.required<boolean>();

  colorSelected = output<Color>();

  Color = Color;
  Object = Object;
  StringFormControl = FormControl<string>;

  toggleEditorMode() {
    this.editorMode.set(!this.editorMode());
  }

  colorBlockSelected(color: string) {
    this.colorSelected.emit(color as Color);
  }
}
