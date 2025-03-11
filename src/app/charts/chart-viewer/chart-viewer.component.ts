import { Component } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartBlockComponent } from "../chart-block/chart-block.component";
import { Chart, Stitch } from '../model/Chart';
import { ColorPaletteComponent } from "../color-palette/color-palette.component";
import { FormGroup } from '@angular/forms';
import { ColorPaletteForm } from '../../shared/services/form.interfaces';
import { FormService } from '../../shared/services/form.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PatternDescriptionPipe } from '../../shared/pipes/pattern-description.pipe';

@Component({
  selector: 'app-chart-viewer',
  imports: [ChartBlockComponent, ColorPaletteComponent, NzGridModule, NzIconModule, NzButtonModule, PatternDescriptionPipe],
  templateUrl: './chart-viewer.component.html',
  styleUrl: './chart-viewer.component.less'
})
export class ChartViewerComponent {
  isLoading = true;
  chart?: Chart;
  colorPaletteForm?: FormGroup<ColorPaletteForm>;

  hoveredStitch?: Stitch;

  isFavorite: boolean = false;
  patternToDescription?: Stitch[][];

  constructor(httpClient: HttpClientService, activatedRoute: ActivatedRoute, formService: FormService, router: Router) {
    const chartId = Number(activatedRoute.snapshot.paramMap.get("id"));
    httpClient.getChartById(chartId).subscribe({
      next: (chart) => {
        console.log('get', chart);
        this.chart = chart;
        this.colorPaletteForm = formService.colorPaletteForm(chart.colors);
        this.patternToDescription = [...chart.pattern].reverse();
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          router.navigate(['/404'])
        }
      }
    });
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

}
