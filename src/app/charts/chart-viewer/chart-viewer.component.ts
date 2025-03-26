import { Component } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartBlockComponent } from "../chart-block/chart-block.component";
import { Chart, Stitch } from '../../model/Chart';
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

@Component({
  selector: 'app-chart-viewer',
  imports: [ChartBlockComponent, ColorPaletteComponent, NzGridModule, NzIconModule, NzButtonModule, PatternDescriptionPipe, NzPopconfirmModule],
  templateUrl: './chart-viewer.component.html',
  styleUrl: './chart-viewer.component.less'
})
export class ChartViewerComponent {
  isLoading = true;
  chart?: Chart;
  imageSrc?: string;
  colorPaletteForm?: FormGroup<ColorPaletteForm>;

  hoveredStitch?: Stitch;

  canDelete: boolean = false;
  isFavorite: boolean;
  patternToDescription?: Stitch[][];

  userService: UserService;
  router: Router;
  httpClient: HttpClientService;
  nzMessageService: NzMessageService;

  constructor(
    httpClient: HttpClientService,
    activatedRoute: ActivatedRoute,
    formService: FormService,
    router: Router,
    userService: UserService,
    nzMessageService: NzMessageService)
  {
    this.router = router;
    this.httpClient = httpClient;
    this.userService = userService;
    this.nzMessageService = nzMessageService;

    const chartId = Number(activatedRoute.snapshot.paramMap.get("id"));
    httpClient.getChartById(chartId).subscribe({
      next: (chart) => {
        this.chart = chart;
        this.colorPaletteForm = formService.colorPaletteForm(chart.colors);
        this.patternToDescription = [...chart.pattern].reverse();
        this.isLoading = false;

        this.loadChartImage();
      },
      error: (err) => {
        if (err.status === 404) {
          router.navigate(['/404'])
        }
      }
    });

    this.isFavorite = userService.isFavorite(chartId);
    this.canDelete = userService.getUser()?.id === this.chart?.userId;
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

  stitchEvent(event: { stitch: Stitch; event: "click" | "mouseenter" | "mouseout"; }) {
    switch (event.event) {
      case "mouseenter":
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

    this.isFavorite = this.userService.getUser()?.favorites.some(chart => chart.id === this.chart?.id) ?? false;
  }

  createVariation() {
    if (!this.chart?.id) return;
    this.router.navigate([`/charts/create/${this.chart.id}`]);
  }

  deleteChart() {
    if (!this.chart?.id) return;
    this.httpClient.deleteChart(this.chart.id).subscribe({
      next: () => {

      },
      error: (err) => {

      }
    });
  }
}
