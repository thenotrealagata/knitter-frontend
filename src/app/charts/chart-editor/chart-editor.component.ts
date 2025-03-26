import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AtomicStitch, AtomicStitchType, CableNeedleDirection, CableStitch, Chart, Color, CompositeStitch, Stitch } from '../../model/Chart';
import { StitchComponent } from '../../stitch/stitch.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { FormService } from '../../shared/services/form.service';
import { CableStitchForm, ChartForm, ColorPaletteForm } from '../../shared/services/form.interfaces';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColorPaletteComponent } from "../color-palette/color-palette.component";
import { NzCardModule } from 'ng-zorro-antd/card';
import { PatternDescriptionPipe } from '../../shared/pipes/pattern-description.pipe';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadComponent, NzUploadFile } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../../shared/services/http-client.service';
import { ChartBlockComponent } from "../chart-block/chart-block.component";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceCompactComponent } from 'ng-zorro-antd/space';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

const ngZorroModules = [NzLayoutModule,
  NzFlexModule,
  NzCardModule,
  NzFormModule,
  NzInputModule,
  NzPageHeaderModule,
  NzButtonModule,
  NzSwitchModule,
  NzUploadComponent,
  NzGridModule,
  NzPopconfirmModule,
  NzInputNumberModule,
  NzDividerModule,
  NzSpaceCompactComponent,
  NzIconModule,
  NzModalModule,
  NzSelectModule
];

@Component({
  selector: 'app-chart-editor',
  providers: [HttpClientService],
  imports: [StitchComponent, ColorPaletteComponent, PatternDescriptionPipe, ReactiveFormsModule, ...ngZorroModules, ChartBlockComponent],
  templateUrl: './chart-editor.component.html',
  styleUrl: './chart-editor.component.less'
})
export class ChartEditorComponent {
  selectedStitch: Stitch | undefined;
  selectedColor: Color = Color.MC;
  selectedStitchTrigger = 0;

  parentId: number | undefined;
  chartForm: FormGroup<ChartForm> | undefined;
  colorPaletteForm: FormGroup<ColorPaletteForm>;

  pendingNewWidth: number | undefined;
  pendingNewHeight: number | undefined;
  confirmNewWidthPopconfirmVisible: boolean = false;
  confirmNewHeightPopconfirmVisible: boolean = false;
  previousWidth: number | undefined;
  previousHeight: number | undefined;

  // Creating a variation
  isLoading: boolean = false;
  isSaving: boolean = false;

  colorPaletteEditorMode = true;

  atomicStitchInventory = Object.keys(AtomicStitchType)
    .filter(key => isNaN(Number(key)))
    .map(stitchType => new AtomicStitch(this.selectedColor, stitchType as AtomicStitchType));
  cableStitchInventory: CableStitch[] = [
    new CableStitch(
      Color.MC,
      [ AtomicStitchType.Knit, AtomicStitchType.Knit ],
      1,
      CableNeedleDirection.HOLD_BEHIND_WORK
    ),
    new CableStitch(
      Color.MC,
      [ AtomicStitchType.Knit, AtomicStitchType.Knit ],
      1,
      CableNeedleDirection.HOLD_IN_FRONT_OF_WORK
    ),
    new CableStitch(
      Color.MC,
      [ AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit ],
      2,
      CableNeedleDirection.HOLD_BEHIND_WORK
    ),
    new CableStitch(
      Color.MC,
      [ AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit ],
      2,
      CableNeedleDirection.HOLD_IN_FRONT_OF_WORK
    )
  ];

  httpClient: HttpClientService;
  formService: FormService;
  router: Router;
  nzMessageService: NzMessageService;

  isNewCableStitchModalVisible = false;
  cableStitchForm: FormGroup<CableStitchForm>;
  cableStitchFormPreview: CableStitch;
  CableNeedleDirection = CableNeedleDirection;
  AtomicStitchType = AtomicStitchType;

  constructor(
    formService: FormService,
    activatedRoute: ActivatedRoute,
    httpClient: HttpClientService,
    router: Router,
    nzMessageService: NzMessageService) {
    this.httpClient = httpClient;
    this.formService = formService;
    this.router = router;
    this.nzMessageService = nzMessageService;

    // TODO remove other colors after testing is done
    this.colorPaletteForm = formService.colorPaletteForm({
      [Color.MC]: "#fefefe",
      [Color.CC1]: "#792960",
      [Color.CC2]: "#CE7DA5"
    });
    this.cableStitchForm = formService.cableStitchForm();
    this.cableStitchFormPreview = formService.formToCableStitch(this.cableStitchForm, this.selectedColor);

    this.parentId = Number(activatedRoute.snapshot.paramMap.get("id"));
    if (this.parentId) {
      this.isLoading = true;
      // Created chart is a variation on an existing chart
      httpClient.getChartById(this.parentId).subscribe({
        next: (chart) => {
          console.log('get', chart);
          this.chartForm = formService.chartForm(chart);
          this.previousHeight = this.chartForm.controls.height.value;
          this.previousWidth = this.chartForm.controls.width.value;
          this.isLoading = false;
        },
        error: (err) => {
          this.chartForm = formService.chartForm();
        }
      });
    } else {
      this.isLoading = false;
      // Initialize chart
      this.chartForm = formService.chartForm({
        title: '',
        description: '',
        width: 10,
        height: 10,
        flat: true,
        pattern: this.initializePattern(10, 10),
        parentId: undefined,
        colors: {
          [Color.MC]: "#fefefe",
          [Color.CC1]: "#792960",
          [Color.CC2]: "#CE7DA5"
        }
      });
      this.previousHeight = this.chartForm.controls.height.value;
      this.previousWidth = this.chartForm.controls.width.value;
    }
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
    [...this.atomicStitchInventory, ...this.cableStitchInventory].forEach(stitch => stitch.color = this.selectedColor);
    this.selectedStitchTrigger++;
  }

  stitchSelected(stitch: Stitch) {
    this.selectedStitch = stitch;
  }

  stitchEvent(event: { stitch: Stitch; event: "click" | "mouseenter" | "mouseout"; }) {
    switch (event.event) {
      case "click":
        this.drawStitch(event.stitch);
        break;
      case "mouseenter":
        // TODO stitch hover with selected stitch
        break;
    }
  }

  drawStitch(stitch: Stitch) {
    if (stitch instanceof AtomicStitch && this.selectedStitch instanceof AtomicStitch) {
      stitch.color = this.selectedStitch.color;
      stitch.type = this.selectedStitch.type;
    } else if (this.selectedStitch instanceof CableStitch) {
      const row = this.chartForm?.controls.pattern.value.find(row => row.includes(stitch));
      const stitchIndex = row?.indexOf(stitch);
      const stitchSize = this.selectedStitch.sequence.length;

      if (stitchIndex === undefined || !row) return;

      // Copy stitch over existing stitches; if it flows into a composite stitch, remove it and replace remaining spots with knit stitches
      // If stitch doesn't fit unto row, show error message
      const affectedStitches = [];
      let i = stitchIndex;
      let stitchSum = 0;
      while (i < row?.length && stitchSum < stitchSize) {
        const element = row[i];
        affectedStitches.push(element);
        stitchSum += element instanceof CompositeStitch ? element.sequence.length : 1;
        i++;
      }

      if (stitchSum >= stitchSize) {
        // Cable stitch can be copied to chart
        affectedStitches.forEach(stitch => row.splice(row.indexOf(stitch), 1));
        row.splice(stitchIndex, 0, this.selectedStitch);

        const difference = stitchSum - stitchSize;
        if (difference > 0) {
          // Composite stitches were removed and thus the row count is off, adjust
          row.splice(stitchIndex + 1, 0, ...new Array(difference).fill(new AtomicStitch(Color.MC, AtomicStitchType.Knit)));
        }
      } else {
        this.nzMessageService.error("Stitch can't be added outside of chart!");
      }
    }
    // TODO other cases
  }

  onFileUpload = (file: NzUploadFile) => {
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      this.nzMessageService.error("Invalid file type: only PNG and JPEG files are allowed.");
    } else if (file.size && file.size > 3000000) {
      // File limit on the backend is 3 MB
      this.nzMessageService.error("File is too large, maximum size is 3 MB.");
    } else {
      this.httpClient.uploadImage(file as any).subscribe({
        next: (imageName) => {
          this.chartForm?.controls.image.setValue(imageName.message);
        },
        error: (error) => {
          this.nzMessageService.error("Error while uploading file.");
        }
      })
    }

    return "";
  }

  saveChart() {
    if (!(this.chartForm && this.colorPaletteForm)) return;

    let hasError = false;
    Object.values(this.chartForm.controls).forEach(control => {
      if (control.required && control.value == undefined) {
        hasError = true;
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });

    if (hasError) {
      this.nzMessageService.error("Can't save chart in this state, please provide all the required fields!");
      return;
    }

    this.isSaving = true;
    this.httpClient.createChart(this.formService.formToChart(this.chartForm, this.colorPaletteForm, this.parentId)).subscribe(
      {
        next: (chart: Chart) => {
          this.isSaving = false;
          if (chart.id) {
            this.router.navigate([`/charts/view/${chart.id}`]);
          }
        },
        error: (err: any) => {
          this.isSaving = false;
        }
      }
    )
  }

  onHeightChange() {
    if (!(this.previousHeight && this.chartForm)) return;

    const newValue = this.chartForm?.controls.height.value;

    const stitchCountChange = Math.abs(this.previousHeight - newValue);
    if (this.previousHeight < newValue) {
      // Add new rows to the bottom of the pattern
      this.chartForm.controls.pattern.value.push(
        ...new Array(stitchCountChange).map(newRow => 
          new Array(this.chartForm!.controls.width.value)
            .map(newStitch => new AtomicStitch(Color.MC, AtomicStitchType.Knit))
        )
      );
      this.previousHeight = newValue;
    } else {
      // Remove stitches; ask for confirmation
      this.pendingNewHeight = newValue;
      this.confirmNewHeightPopconfirmVisible = true;
    }
  }

  confirmNewHeight() {
    if (!this.chartForm || this.pendingNewHeight === undefined) return;

    this.chartForm.controls.pattern.value.splice(this.pendingNewHeight);

    this.previousHeight = this.pendingNewHeight;
    this.pendingNewHeight = undefined;
  }

  cancelNewHeight() {
    if (!this.previousHeight) return;
    this.chartForm?.controls.height.setValue(this.previousHeight);
    this.pendingNewHeight = undefined;
  }

  onWidthChange() {
    if (!(this.previousWidth && this.chartForm)) return;

    const newValue = this.chartForm?.controls.width.value;

    const stitchCountChange = Math.abs(this.previousWidth - newValue);
    if (this.previousWidth < newValue) {
      // Add new stitches to the right side of pattern
      this.chartForm.controls.pattern.value.forEach(row => {
        row.push(
          ...new Array(stitchCountChange).map(stitch => new AtomicStitch(Color.MC, AtomicStitchType.Knit))
        );
      })
      this.previousWidth = newValue;
    } else {
      // Remove stitches; ask for confirmation
      this.pendingNewWidth = newValue;
      this.confirmNewWidthPopconfirmVisible = true;
    }
  }

  confirmNewWidth() {
    if (!this.chartForm || this.pendingNewWidth === undefined) return;

    this.chartForm.controls.pattern.value.forEach(row => {
      row.splice(this.pendingNewWidth!);
    });

    this.previousWidth = this.pendingNewWidth;
    this.pendingNewWidth = undefined;
  }

  cancelNewWidth() {
    if (!this.previousWidth) return;
    this.chartForm?.controls.width.setValue(this.previousWidth);
    this.pendingNewWidth = undefined;
  }

  openNewCableNeedleModal() {
    this.cableStitchForm.reset({
      sequence: [AtomicStitchType.Knit, AtomicStitchType.Knit]
    });
    this.regenerateCablePreview();
    this.isNewCableStitchModalVisible = true;
  }

  closeNewCableStitchModal() {
    this.isNewCableStitchModalVisible = false;
  }

  addNewCableStitch() {
    if (!this.inventoryContainsStitch(this.cableStitchFormPreview)) {
      this.cableStitchInventory.push(this.cableStitchFormPreview);
      this.isNewCableStitchModalVisible = false;
    } else {
      this.nzMessageService.error("Stitch can't be added, as the same one already exists in the stitch inventory.");
    }
  }

  inventoryContainsStitch(stitch: CableStitch): boolean {
    return this.cableStitchInventory.some(cableStitch => 
      cableStitch.holdCableNeedle === stitch.holdCableNeedle
        && cableStitch.toCableNeedle === stitch.toCableNeedle
        && cableStitch.sequence.length === stitch.sequence.length
        && cableStitch.sequence.every((atomicStitch, i) => stitch.sequence.at(i)?.type === atomicStitch.type)
    )
  }

  onStitchNumberChange() {
    const newSize = this.cableStitchForm.controls.stitchNumber.value;
    const previousSize = this.cableStitchForm.controls.sequence.value.length
    const difference = newSize - previousSize;
    if (difference > 0) {
      // Add new stitches to sequence
      this.cableStitchForm.controls.sequence.value.push(
        ...(new Array(difference).fill(AtomicStitchType.Knit)));
    } else {
      // Remove stitches from sequence
      this.cableStitchForm.controls.sequence.value.splice(previousSize);
    }

    // If toCableNeedle value would be invalid, decrease it
    if (this.cableStitchForm.controls.toCableNeedle.value >= newSize) {
      this.cableStitchForm.controls.toCableNeedle.setValue(newSize - 1);
    }

    this.regenerateCablePreview();
  }

  switchSequenceElementType(index: number) {
    const sequence = this.cableStitchForm.controls.sequence.value;
    const value = sequence.at(index);
    if (!value) return;

    sequence[index] = value === AtomicStitchType.Knit ? AtomicStitchType.Purl : AtomicStitchType.Knit;
    this.regenerateCablePreview();
  }

  regenerateCablePreview() {
    this.cableStitchFormPreview = this.formService.formToCableStitch(this.cableStitchForm, this.selectedColor);
  }
}
