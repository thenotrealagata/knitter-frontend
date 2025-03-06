import { Component } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { ActivatedRoute } from '@angular/router';
import { ChartBlockComponent } from "../chart-block/chart-block.component";
import { Chart } from '../model/Chart';

@Component({
  selector: 'app-chart-viewer',
  imports: [ChartBlockComponent],
  templateUrl: './chart-viewer.component.html',
  styleUrl: './chart-viewer.component.less'
})
export class ChartViewerComponent {
  chartId: number;
  isLoading = true;
  chart?: Chart;

  constructor(httpClient: HttpClientService, activatedRoute: ActivatedRoute) {
    this.chartId = Number(activatedRoute.snapshot.paramMap.get("id"));
    httpClient.getChartById(this.chartId).subscribe({
      next: (chart) => {
        console.log('get', chart);
        this.chart = chart;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

}
