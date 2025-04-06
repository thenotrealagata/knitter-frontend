import { Component, input, model, OnInit, output } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { ColorPaletteForm } from '../../shared/services/form.interfaces';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { Color } from '../../model/Chart';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { AsPipe } from '../../shared/pipes/as.pipe';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

const nzModules = [NzFlexModule, NzFormModule, NzColorPickerModule, NzIconDirective, NzCardModule, NzSpaceModule, NzButtonModule, NzToolTipModule];

@Component({
  selector: 'app-color-palette',
  imports: [ReactiveFormsModule, AsPipe, ...nzModules],
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.less'
})
export class ColorPaletteComponent implements OnInit {
  colors = model.required<FormGroup<ColorPaletteForm>>();
  editorMode = model<boolean>(false);
  canDelete = input<boolean>(false); // Relevant for editorMode, allow deleting blocks
  allowSelectMode = input.required<boolean>();

  colorSelected = output<Color>();
  colorDeleted = output<Color>();

  Color = Color;
  Object = Object;
  StringFormControl = FormControl<string>;

  // Add new color control
  colorOrder: Color[] = [Color.MC, Color.CC1, Color.CC2, Color.CC3, Color.CC4];
  canAddColor: boolean = true;

  ngOnInit(): void {
    this.canAddColor = Object.keys(this.colors().controls).length < this.colorOrder.length;
  }

  sortByColorOrder(colors: string[]) {
    colors.sort((a, b) => this.colorOrder.indexOf(a as Color) - this.colorOrder.indexOf(b as Color));
    return colors;
  }

  toggleEditorMode() {
    this.editorMode.set(!this.editorMode());
  }

  colorBlockSelected(color: string) {
    this.colorSelected.emit(color as Color);
  }

  addNewColor() {
    const controls = Object.keys(this.colors().controls).map(color => color as Color);
    const newControl = this.colorOrder.find(color => !controls.includes(color));
    if (!newControl) return;

    this.colors().addControl(newControl, new FormControl<string>("#fff", {
                validators: Validators.required,
                nonNullable: true,
              }));
    this.canAddColor = Object.keys(this.colors().controls).length < this.colorOrder.length;
  }

  deleteColor(color: Color) {
    const allowedTypes = [ Color.CC1, Color.CC2, Color.CC3, Color.CC4 ];
    if (allowedTypes.includes(color)) {
      this.colors().removeControl(color as Color.CC1 | Color.CC2 | Color.CC3 | Color.CC4);
      this.colorDeleted.emit(color);
    }
  }
}
