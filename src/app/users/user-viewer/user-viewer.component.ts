import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../../shared/services/http-client.service';
import { User } from '../../shared/model/User';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ChartsListingElementComponent } from "../../charts/charts-listing/charts-listing-element/charts-listing-element.component";
import { Chart, Panel } from '../../shared/model/Chart';
import { NzDividerComponent } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-user-viewer',
  imports: [NzGridModule, NzCardModule, ChartsListingElementComponent, NzDividerComponent],
  templateUrl: './user-viewer.component.html',
  styleUrl: './user-viewer.component.less'
})
export class UserViewerComponent {
  user?: User;
  charts?: Chart[];
  panels?: Panel[];

  httpClient: HttpClientService;

  constructor(activatedRoute: ActivatedRoute, httpClient: HttpClientService, nzMessageService: NzMessageService, router: Router) {
    const username = activatedRoute.snapshot.paramMap.get('username');
    this.httpClient = httpClient;

    if (username) {
      httpClient.getUser(username).subscribe({
        next: (user) => {
          this.user = user;
          this.getChartsByUser(user);
        },
        error: (err) => {
          nzMessageService.error("User not found");
          router.navigate(['/charts/list']);
        }
      })
    } else {
      nzMessageService.error("User not found");
      router.navigate(["/404"]);
    }
  }

  getChartsByUser(user: User) {
    this.httpClient.getCharts(user.username).subscribe({
      next: (charts) => {
        this.charts = charts;
      },
      error: (err) => {

      }
    })

    this.httpClient.getPanels(user.username).subscribe({
      next: (panels) => {
        this.panels = panels;
      },
      error: (err) => {

      }
    })
  }
}
