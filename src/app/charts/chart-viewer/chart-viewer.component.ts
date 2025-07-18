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
import { ChartsListingElementComponent } from "../charts-listing/charts-listing-element/charts-listing-element.component";

@Component({
  selector: 'app-chart-viewer',
  imports: [ChartBlockComponent, ColorPaletteComponent, NzGridModule, NzIconModule, NzButtonModule, PatternDescriptionPipe, NzPopconfirmModule, StitchComponent, ChartsListingElementComponent],
  templateUrl: './chart-viewer.component.html',
  styleUrl: './chart-viewer.component.less'
})
export class ChartViewerComponent {
  isPanel: boolean;
  isLoading = true;
  chart?: Chart | Panel;
  variationData?: Chart;
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
    const userId = this.userService.getUser()?.id;
    this.canDelete = this.userService.getUser() !== null
      && (!this.isPanel && userId === this.chart?.userId
      || this.isPanel && userId === (this.chart as any).user.id);
    this.stitchesUsed = this.getStitchesUsed(this.chart);

    if(this.chart.parentId !== undefined) {
      this.httpClient.getChartById(this.chart.parentId).subscribe(
        {
          next: (variationData) => { 
            this.variationData = variationData;
          },
          error: (err) => {
          }
        }
      )
    }

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
    if (this.chart?.id === undefined) return;
    await this.userService.toggleFavorite(this.chart?.id, !this.isFavorite);

    this.user = this.userService.getUser();
    this.isFavorite = this.user?.favorites.some(chart => chart.id === this.chart?.id) ?? false;
  }

  createVariation() {
    if (this.chart?.id === undefined) return;
    this.router.navigate([`/charts/create/${this.chart.id}`]);
  }

  deleteResource() {
    if (this.chart?.id === undefined) return;

    if (this.isPanel) {
      this.httpClient.deletePanel(this.chart.id).subscribe({
        next: () => {
          this.nzMessageService.success("Panel deleted successfully.");
          this.router.navigate(["/panels/list"]);
        },
        error: (err) => {
          this.nzMessageService.error("Panel couldn't be deleted.");
        }
      });
    } else {
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
  }

  getStitchesUsed(chart: Chart): Stitch[] {
    const stitches = [] as Stitch[];
    chart.pattern.forEach(row => {
      row.forEach((stitch) => {
        if (!stitches.some(includedStitch => this.chartService.areStitchesEqual(includedStitch, stitch))) {
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
}
