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
import { ChartsListingElementComponent } from "../charts-listing/charts-listing-element/charts-listing-element.component";
import { UserService } from '../../shared/services/user.service';
import { ChartService } from '../../shared/services/chart.service';

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
  imports: [StitchComponent, ColorPaletteComponent, PatternDescriptionPipe, ReactiveFormsModule, ...ngZorroModules, ChartBlockComponent, ChartsListingElementComponent],
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

  // When creating panel, allow adding previously saved charts to editor
  isPanelEditor = false;
  userFavorites: Chart[] = [];
  panelsAdded: number[] = [];

  pendingNewWidth: number | undefined;
  pendingNewHeight: number | undefined;
  confirmNewWidthPopconfirmVisible = false;
  confirmNewHeightPopconfirmVisible = false;
  previousWidth: number | undefined;
  previousHeight: number | undefined;

  isLoading = false; // Creating a variation
  isSaving = false;

  rightSiderCollapsed = false;

  atomicStitchInventory = Object.keys(AtomicStitchType)
    .filter(key => isNaN(Number(key)))
    .map(stitchType =>
      new AtomicStitch(
        stitchType === AtomicStitchType.NoStitch ? "NO_STITCH" : this.selectedColor,
        stitchType as AtomicStitchType)
    );
  cableStitchInventory: CableStitch[] = [
    new CableStitch(
      Color.MC,
      [...new Array(2)].map(_ => AtomicStitchType.Knit),
      1,
      CableNeedleDirection.HOLD_BEHIND_WORK
    ),
    new CableStitch(
      Color.MC,
      [...new Array(2)].map(_ => AtomicStitchType.Knit),
      1,
      CableNeedleDirection.HOLD_IN_FRONT_OF_WORK
    ),
    new CableStitch(
      Color.MC,
      [...new Array(4)].map(_ => AtomicStitchType.Knit),
      2,
      CableNeedleDirection.HOLD_BEHIND_WORK
    ),
    new CableStitch(
      Color.MC,
      [...new Array(4)].map(_ => AtomicStitchType.Knit),
      2,
      CableNeedleDirection.HOLD_IN_FRONT_OF_WORK
    )
  ];
  chartInventory: Chart[] = []; // Only relevant for panel editor

  httpClient: HttpClientService;
  formService: FormService;
  router: Router;
  nzMessageService: NzMessageService;
  chartService: ChartService;

  isAddChartsModalVisible = false;
  charts: Chart[] = [];
  chartsSelected: number[] = []; // IDs of selected charts

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
    nzMessageService: NzMessageService,
    userService: UserService,
    chartService: ChartService) {
    this.httpClient = httpClient;
    this.formService = formService;
    this.router = router;
    this.nzMessageService = nzMessageService;
    this.chartService = chartService;
    
    this.colorPaletteForm = formService.colorPaletteForm({
      [Color.MC]: "#fefefe",
    });
    this.cableStitchForm = formService.cableStitchForm();
    this.cableStitchFormPreview = formService.formToCableStitch(this.cableStitchForm, this.selectedColor);

    const user = userService.getUser();
    if (!user) {
      router.navigate(["/login"]);
      return;
    }

    this.parentId = Number(activatedRoute.snapshot.paramMap.get("id"));
    if (this.parentId) {
      this.isLoading = true;
      // Created chart is a variation on an existing chart
      httpClient.getChartById(this.parentId).subscribe({
        next: (chart) => {
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

    this.isPanelEditor = activatedRoute.snapshot.routeConfig?.path?.includes("panels") ?? false;
    if (this.isPanelEditor) {
      this.userFavorites = user.favorites;
    }
  }

  initializePattern(width: number, height: number): Stitch[][] {
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
    if (!this.selectedStitch) {
      this.selectedStitch = this.atomicStitchInventory.find(stitch => stitch.type === AtomicStitchType.Knit);
    }
    [...this.atomicStitchInventory, ...this.cableStitchInventory].forEach(stitch => stitch.color = this.selectedColor);
    this.selectedStitchTrigger++;
  }

  colorDeleted(color: Color) {
    this.chartForm?.controls.pattern.value.forEach(row => {
      row.forEach(stitch => {
        if (stitch.color === color) {
          stitch.color = Color.MC;
        }
      })
    })
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
    if (!this.selectedStitch) return;
    const row = this.chartForm?.controls.pattern.value.find(row => row.includes(stitch));
    const stitchIndex = row?.indexOf(stitch);
    
    if (this.chartService.isAtomicStitch(stitch)
      && this.chartService.isAtomicStitch(this.selectedStitch)) {
      const selectedIsNoStitch = this.selectedStitch.type === AtomicStitchType.NoStitch;
      stitch.color = selectedIsNoStitch ? "NO_STITCH" : this.selectedColor;
      stitch.type = this.selectedStitch.type;
    } else if (this.chartService.isCompositeStitch(stitch) && this.chartService.isAtomicStitch(this.selectedStitch)) {
      if (stitchIndex === undefined || !row) return;

      const newSequence = [...new Array(stitch.sequence.length)].map(_ => new AtomicStitch(stitch.color, AtomicStitchType.Knit));
      newSequence[0] = this.selectedStitch;
      row?.splice(stitchIndex, 1, ...newSequence);

    } else if (this.chartService.isCableStitch(this.selectedStitch)) {
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
        row.splice(
          stitchIndex,
          0,
          new CableStitch(
            this.selectedColor,
            this.selectedStitch.sequence.map(sequenceElement => sequenceElement.type),
            this.selectedStitch.toCableNeedle,
            this.selectedStitch.holdCableNeedle)
        );

        const difference = stitchSum - stitchSize;
        if (difference > 0) {
          // Composite stitches were removed and thus the row count is off, adjust
          row.splice(stitchIndex + 1, 0, ...[...new Array(difference)].map(_ => new AtomicStitch(Color.MC, AtomicStitchType.Knit)));
        }
      } else {
        this.nzMessageService.error("Stitch can't be added outside of chart!");
      }
    }
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
        ...[...new Array(stitchCountChange)].map(_ =>
          [...new Array(this.chartForm!.controls.width.value)]
            .map(_ => new AtomicStitch(Color.MC, AtomicStitchType.Knit))
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
          ...[...new Array(stitchCountChange)].map(_ => new AtomicStitch(Color.MC, AtomicStitchType.Knit))
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

    this.chartForm.controls.pattern.value.forEach((row, i) => {
      let stitchCounter = 0;
      const currentWidthAtIndex = row.findIndex(stitch => {
        // Removing from index might not be exactly the given width (as stitch groups count as 1 in the array)
        stitchCounter += this.getStitchNumber(stitch);
        return stitchCounter > this.pendingNewWidth!;
      });

      row.splice(currentWidthAtIndex);
      const stitchDifference = this.pendingNewWidth! - row.reduce((sum, stitch) => sum += this.getStitchNumber(stitch), 0);
      // When splitting composite stitches, we must compensate for the entire group being removed
      if (stitchDifference > 0) {
        row.push(...[...new Array(stitchDifference)].map(_ => new AtomicStitch(Color.MC, AtomicStitchType.Knit)));
      }
    });

    this.previousWidth = this.pendingNewWidth;
    this.pendingNewWidth = undefined;
  }

  getStitchNumber(stitch: Stitch): number {
    // Get number of squares stitch occupies on pattern
    if (this.chartService.isAtomicStitch(stitch)) {
      return 1;
    } else if (this.chartService.isCompositeStitch(stitch)) {
      return stitch.sequence.length;
    }

    return 0;
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
      const newStitches = [...new Array(difference)].map(_ => AtomicStitchType.Knit) as (AtomicStitchType.Knit | AtomicStitchType.Purl)[];
      this.cableStitchForm.controls.sequence.value.push(...newStitches);
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

  openAddChartsModal() {
    this.isAddChartsModalVisible = true;
    this.chartsSelected = this.chartInventory.map(chart => chart.id).filter(id => id !== undefined);
  }

  closeAddChartsModal() {
    this.isAddChartsModalVisible = false;
  }

  setChartSelected(chartId: number, state: boolean) {
    if (state) {
      // Select chart
      this.chartsSelected.push(chartId);
    } else {
      // Deselect chart
      const index = this.chartsSelected.indexOf(chartId);
      if (index !== -1) {
        this.chartsSelected.splice(index, 1);
      }
    }
  }

  addCharts() {
    this.chartInventory = [];
    this.chartsSelected.forEach(id => {
      const chart = this.userFavorites.find(favorite => favorite.id === id);
      if (chart) this.chartInventory.push(chart);
    })
    this.isAddChartsModalVisible = false;
  }
}
