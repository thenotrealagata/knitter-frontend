import { Component } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartBlockComponent } from "../chart-block/chart-block.component";
import { AtomicStitch, CableStitch, Chart, Color, Panel, Stitch } from '../../shared/model/Chart';
import { ColorPaletteComponent } from "../color-palette/color-palette.component";
import { FormGroup } from '@angular/forms';
import { ColorPaletteForm } from '../../shared/services/form.interfaces';
import { FormService } from '../../shared/services/form.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PatternDescriptionPipe } from '../../shared/pipes/pattern-description.pipe';
import { UserService } from '../../shared/services/user.service';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../shared/model/User';
import { ChartService } from '../../shared/services/chart.service';
import { StitchComponent } from '../stitch/stitch.component';

@Component({
  selector: 'app-chart-viewer',
  imports: [ChartBlockComponent, ColorPaletteComponent, NzGridModule, NzIconModule, NzButtonModule, PatternDescriptionPipe, NzPopconfirmModule, StitchComponent],
  templateUrl: './chart-viewer.component.html',
  styleUrl: './chart-viewer.component.less'
})
export class ChartViewerComponent {
  isPanel: boolean;
  isLoading = true;
  chart?: Chart | Panel;
  imageSrc?: string;
  colorPaletteForm?: FormGroup<ColorPaletteForm>;

  hoveredStitch?: Stitch;

  canDelete = false;
  isFavorite = false;
  patternToDescription?: Stitch[][];
  stitchesUsed: Stitch[] = [];

  userService: UserService;
  router: Router;
  httpClient: HttpClientService;
  nzMessageService: NzMessageService;
  chartService: ChartService;
  formService: FormService;

  user: User | null;

  constructor(
    httpClient: HttpClientService,
    activatedRoute: ActivatedRoute,
    formService: FormService,
    router: Router,
    userService: UserService,
    nzMessageService: NzMessageService,
    chartService: ChartService
  )
  {
    this.router = router;
    this.httpClient = httpClient;
    this.userService = userService;
    this.user = userService.getUser();
    this.nzMessageService = nzMessageService;
    this.chartService = chartService;
    this.formService = formService;

    this.isPanel = activatedRoute.snapshot.routeConfig?.path?.includes("panels") ?? false;

    const resourceId = Number(activatedRoute.snapshot.paramMap.get("id"));
    const observable = this.isPanel ? httpClient.getPanelById(resourceId) : httpClient.getChartById(resourceId);

    observable.subscribe({
      next: (chart) => { 
        this.chart = chart;
        this.initializeViewer();
       },
      error: (err) => {
        if (err.status === 404) {
          router.navigate(['/404'])
        }
      }
    });
  }

  initializeViewer() {
    if (!this.chart) return;

    this.colorPaletteForm = this.formService.colorPaletteForm(this.chart.colors);
    this.patternToDescription = [...this.chart.pattern].reverse();
    this.isLoading = false;
    this.isFavorite = this.userService.isFavorite(this.chart.id!);
    this.canDelete = this.userService.getUser()?.id === this.chart?.userId;
    this.stitchesUsed = this.getStitchesUsed(this.chart);

    this.loadChartImage();
  }

  loadChartImage() {
    if (!this.chart) return;

    this.httpClient.getImage(this.chart.filePath).subscribe({
      next: (img) => {
        this.imageSrc = URL.createObjectURL(img);
      },
      error: (err) => {
      }
    })
  }

  stitchEvent(event: { stitch: Stitch; event: "click" | "mouseover" | "mouseout"; }) {
    switch (event.event) {
      case "mouseover":
        this.hoveredStitch = event.stitch;
        break;
      case "mouseout":
        this.hoveredStitch = undefined;
        break;
    }
  }

  async toggleFavorite() {
    if (!this.chart?.id) return;
    await this.userService.toggleFavorite(this.chart?.id, !this.isFavorite);

    this.user = this.userService.getUser();
    this.isFavorite = this.user?.favorites.some(chart => chart.id === this.chart?.id) ?? false;
  }

  createVariation() {
    if (!this.chart?.id) return;
    this.router.navigate([`/charts/create/${this.chart.id}`]);
  }

  deleteChart() {
    if (!this.chart?.id) return;
    this.httpClient.deleteChart(this.chart.id).subscribe({
      next: () => {
        this.nzMessageService.success("Chart deleted successfully.");
        this.router.navigate(["/charts/list"]);
      },
      error: (err) => {
        this.nzMessageService.error("Chart couldn't be deleted.");
      }
    });
  }

  getStitchesUsed(chart: Chart): Stitch[] {
    const stitches = [] as Stitch[];
    chart.pattern.forEach(row => {
      row.forEach((stitch) => {
        if (!stitches.some(includedStitch => this.isStitchEqual(includedStitch, stitch))) {
          // Stitch is not included in set yet, copy it with MC
          if (this.chartService.isAtomicStitch(stitch)) {
            stitches.push(new AtomicStitch(stitch.color === "NO_STITCH" ? "NO_STITCH" : Color.MC, stitch.type));
          } else if (this.chartService.isCableStitch(stitch)) {
            stitches.push(new CableStitch(Color.MC, stitch.sequence, stitch.toCableNeedle, stitch.holdCableNeedle));
          }
        }
      })
    });

    return stitches;
  }

  isStitchEqual(stitch1: Stitch, stitch2: Stitch) {
    // todo does this work for no stitch?
    return (this.chartService.isAtomicStitch(stitch1) && this.chartService.isAtomicStitch(stitch2) && stitch1.type === stitch2.type)
    || (this.chartService.isCableStitch(stitch1) && this.chartService.isCableStitch(stitch2)
      && stitch1.holdCableNeedle === stitch2.holdCableNeedle
      && stitch1.toCableNeedle === stitch2.toCableNeedle
      && stitch1.sequence.length === stitch2.sequence.length
      && stitch1.sequence.every((stitch, i) => stitch2.sequence[i] === stitch))
  }
}
