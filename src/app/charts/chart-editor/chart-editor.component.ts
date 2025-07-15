import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AtomicStitch, AtomicStitchType, CableNeedleDirection, CableStitch, Chart, Color, CompositeStitch, Panel, Stitch } from '../../shared/model/Chart';
import { StitchComponent } from '../stitch/stitch.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { FormService } from '../../shared/services/form.service';
import { CableStitchForm, ChartForm, ColorPaletteForm } from '../../shared/services/form.interfaces';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CanDeactivate } from '../../shared/guards/can-deactivate/can-deactivate-interface';
import { demoChart1, demoChart2 } from './demoCharts';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartViewerComponent } from "../chart-viewer/chart-viewer.component";

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
  imports: [StitchComponent, ColorPaletteComponent, PatternDescriptionPipe, ReactiveFormsModule, FormsModule, TranslatePipe, ...ngZorroModules, ChartBlockComponent, ChartsListingElementComponent, ChartViewerComponent],
  templateUrl: './chart-editor.component.html',
  styleUrl: './chart-editor.component.less'
})
export class ChartEditorComponent implements CanDeactivate {
  selectedElement: Stitch | Chart | undefined;
  selectedColor: Color = Color.MC;
  selectedStitchTrigger = 0;

  parentId: number | undefined = undefined;
  chartForm: FormGroup<ChartForm> | undefined;
  colorPaletteForm: FormGroup<ColorPaletteForm>;

  // When creating panel, allow adding previously saved charts to editor
  isPanelEditor = true;
  userFavorites: Chart[] = [
    demoChart1,
    demoChart2
  ];
  chartsAdded: Chart[] = [];

  pendingNewWidth: number | undefined;
  pendingNewHeight: number | undefined;
  confirmNewWidthPopconfirmVisible = false;
  confirmNewHeightPopconfirmVisible = false;
  previousWidth: number | undefined;
  previousHeight: number | undefined;

  uploadedFileName: string | undefined;

  isLoading = false; // Creating a variation
  isSaving = false;
  saved = false;

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
  chartInventory: Chart[] = [ demoChart2 ]; // Only relevant for panel editor

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

  translate: TranslateService;
  currentLanguage: 'en' | 'hu';

  // For demo
  isDocumentationModalVisible: boolean = false;
  isPreviewModalVisible = false;
  previewPanel?: Panel;
  previewFile?: File;
  imageUrl?: string | ArrayBuffer | null;

  constructor(
    formService: FormService,
    httpClient: HttpClientService,
    router: Router,
    nzMessageService: NzMessageService,
    userService: UserService,
    chartService: ChartService,
    translate: TranslateService) {
    this.httpClient = httpClient;
    this.formService = formService;
    this.router = router;
    this.nzMessageService = nzMessageService;
    this.chartService = chartService;
    this.translate = translate;
    this.currentLanguage = (translate.currentLang || 'en') as 'en' | 'hu';
    
    this.colorPaletteForm = formService.colorPaletteForm({
      [Color.MC]: "#fefefe",
      [Color.CC1]: "#6e307b"
    });
    this.cableStitchForm = formService.cableStitchForm();
    this.cableStitchFormPreview = formService.formToCableStitch(this.cableStitchForm, this.selectedColor);

    this.isLoading = false;
    // Initialize chart
    this.chartForm = formService.chartForm({
      width: 25,
      height: 15,
      flat: true,
      pattern: this.initializePattern(25, 15)
    });
    this.previousHeight = this.chartForm.controls.height.value;
    this.previousWidth = this.chartForm.controls.width.value;
  }

  canDeactivate(): boolean {
    return this.saved;
  }

  initializePattern(width: number, height: number): Stitch[][] {
    // Initialize with stockinette pattern (in the round) or garter stitch (knitted flat)
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
    if (!this.selectedElement) {
      this.selectedElement = this.atomicStitchInventory.find(stitch => stitch.type === AtomicStitchType.Knit);
    }
    [...this.atomicStitchInventory, ...this.cableStitchInventory].forEach(stitch => {
      if (stitch.color !== 'NO_STITCH') { stitch.color = this.selectedColor; }
    });
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

  selectElement(element: Stitch | Chart) {
    this.selectedElement = element;
  }

  stitchEvent(event: { stitch: Stitch; event: "click" | "mouseover" | "mouseout"; }) {
    switch (event.event) {
      case "click":
        this.drawStitch(event.stitch);
        break;
      case "mouseover":
        break;
    }
  }

  drawStitch(startPoint: Stitch, stitch?: Stitch) {
    if (!stitch) {
      if (!this.selectedElement) return;
      else if (!this.chartService.isStitch(this.selectedElement)) {
        this.drawChart(startPoint);
        return;
      }
    }

    const drawStitch = stitch ?? this.selectedElement as Stitch;
    const row = this.chartForm?.controls.pattern.value.find(row => row.includes(startPoint));
    const stitchIndex = row?.indexOf(startPoint);
    
    if (this.chartService.isAtomicStitch(startPoint)
      && this.chartService.isAtomicStitch(drawStitch)) {
      const selectedIsNoStitch = drawStitch.type === AtomicStitchType.NoStitch;
      startPoint.color = selectedIsNoStitch ? "NO_STITCH" : drawStitch.color;
      startPoint.type = drawStitch.type;
    } else if (this.chartService.isCompositeStitch(startPoint) && this.chartService.isAtomicStitch(drawStitch)) {
      if (stitchIndex === undefined || !row) return;

      const newSequence = [...new Array(startPoint.sequence.length)].map(_ => new AtomicStitch(startPoint.color, AtomicStitchType.Knit));
      newSequence[0] = new AtomicStitch(drawStitch.color, drawStitch.type);
      row?.splice(stitchIndex, 1, ...newSequence);

    } else if (this.chartService.isCableStitch(drawStitch)) {
      const stitchSize = drawStitch.sequence.length;
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
            drawStitch.color,
            drawStitch.sequence,
            drawStitch.toCableNeedle,
            drawStitch.holdCableNeedle)
        );

        const difference = stitchSum - stitchSize;
        if (difference > 0) {
          // Composite stitches were removed and thus the row count is off, adjust
          row.splice(stitchIndex + 1, 0, ...[...new Array(difference)].map(_ => new AtomicStitch(Color.MC, AtomicStitchType.Knit)));
        }
      } else {
        this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.DRAW_STITCH_OUTSIDE_AREA"));
      }
    }
  }

  drawChart(startPoint: Stitch) {
    const chart = this.selectedElement as Chart;
    const pattern = chart.pattern;

    const rowIndex = this.chartForm?.controls.pattern.value.findIndex(row => row.includes(startPoint))!;
    const row = this.chartForm?.controls.pattern.value[rowIndex];
    const stitchIndex = row?.indexOf(startPoint);
    if (stitchIndex === undefined) return;

    if (this.chartForm &&
      (stitchIndex + chart.width > this.chartForm.controls.width.value ||
        rowIndex + chart.height > this.chartForm.controls.height.value)) {
      // Chart does not fit into drawing area
      this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.DRAW_CHART_OUTSIDE_AREA"));
      return;
    }

    // Chart can be added, copy over elements
    const formPattern = this.chartForm?.controls.pattern.value!;
    pattern.forEach((row, patternRowIndex) => {
      row.forEach((stitch, patternStitchIndex) => {
        const formStitch = formPattern[rowIndex + patternRowIndex][stitchIndex + patternStitchIndex];
        this.drawStitch(formStitch, stitch);
      });
    })

    this.chartsAdded.push(chart);
  }

  onFileUpload = (file: NzUploadFile) => {
    const fileName = file.name;
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.INVALID_FILE_TYPE"));
    } else if (file.size && file.size > 3000000) {
      // File limit on the backend is 3 MB
      this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.INVALID_FILE_SIZE"));
    } else {
      this.previewFile = file as any;

      const reader = new FileReader();
      reader.readAsDataURL(this.previewFile as Blob); 
      reader.onload = (_event) => { 
          this.imageUrl = reader.result; 
      }
      this.uploadedFileName = fileName;
      /*this.httpClient.uploadImage(file as any).subscribe({
        next: (imageName) => {
          this.chartForm?.controls.image.setValue(imageName.message);
          this.uploadedFileName = fileName;
        },
        error: (error) => {
          this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.FILE_UPLOAD_ERROR"));
        }
      })*/
    }

    return "";
  }

  preview() {
    if (!this.chartForm) {
      this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.PREVIEW_ERROR"));
      return;
    }

    let hasError = false;
    Object.values(this.chartForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
      hasError = hasError || control.invalid;
    });

    if (hasError) {
      this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.PREVIEW_INVALID_FORM"));
      return;
    }

    this.previewPanel = this.formService.formToPanel(this.chartForm, this.colorPaletteForm, this.chartsAdded, undefined);
    this.isPreviewModalVisible = true;
  }

  closePreviewModal() {
    this.isPreviewModalVisible = false;
  }

  save() {
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
      this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.SAVE_INVALID_FORM"));
      return;
    }

    this.isSaving = true;
    if (this.isPanelEditor) {
      this.httpClient.createPanel(this.formService.formToPanel(this.chartForm, this.colorPaletteForm, this.chartsAdded, this.parentId)).subscribe(
        {
          next: (chart: Chart) => {
            this.saved = true;
            this.router.navigate([`/panels/view/${chart.id}`]);
          },
          error: (err) => {
            this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.SAVE_ERROR_PANEL"));
          },
          complete: () => {
            this.isSaving = false;
          }
        }
      )
    } else {
      this.httpClient.createChart(this.formService.formToChart(this.chartForm, this.colorPaletteForm, this.parentId)).subscribe(
        {
          next: (chart: Chart) => {
            this.saved = true;
            this.router.navigate([`/charts/view/${chart.id}`]);
          },
          error: (err) => {
            this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.SAVE_ERROR_CHART"));
          },
          complete: () => {
            this.isSaving = false;
          }
        }
      )
    } 
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
      this.nzMessageService.error(this.translate.instant("CHART_EDITOR.MESSAGES.STITCH_ALREADY_IN_INVENTORY"));
    }
  }

  inventoryContainsStitch(stitch: CableStitch): boolean {
    return this.cableStitchInventory.some(cableStitch => 
      cableStitch.holdCableNeedle === stitch.holdCableNeedle
        && cableStitch.toCableNeedle === stitch.toCableNeedle
        && cableStitch.sequence.length === stitch.sequence.length
        && cableStitch.sequence.every((atomicStitch, i) => stitch.sequence.at(i) === atomicStitch)
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

  useLanguage(language: 'en' | 'hu') {
    this.translate.use(language);
  }

  setDocumentationModalVisible(state: boolean) {
    this.isDocumentationModalVisible = state;
  }
}
