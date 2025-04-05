import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { HttpClientService } from '../../shared/services/http-client.service';
import { Chart } from '../../model/Chart';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../model/User';
import { ChartsListingElementComponent } from "./charts-listing-element/charts-listing-element.component";
import { CurryPipe } from '../../shared/pipes/curry.pipe';

@Component({
  selector: 'app-charts-listing',
  imports: [NzCardModule, NzIconModule, NzTagModule, NzGridModule, ChartsListingElementComponent, CurryPipe],
  templateUrl: './charts-listing.component.html',
  styleUrl: './charts-listing.component.less'
})
export class ChartsListingComponent {
  user: User | null;
  username: string | null;
  charts: Chart[] = [];

  httpClient: HttpClientService;
  userService: UserService;
  
  constructor(httpClient: HttpClientService, sessionService: UserService) {
    this.user = sessionService.getUser();
    this.username = sessionService.getUsername();

    this.httpClient = httpClient;
    this.userService = sessionService;

    if(!this.user && this.username) {
      httpClient.getUser(this.username).subscribe({
        next: (user) => {
          sessionService.setUser(user);
          this.user = user;
        },
        error: (err) => {

        }
      });
    }

    httpClient.getCharts().subscribe({
      next: (charts) => {
        this.charts = charts;
      },
      error: (err) => {

      }
    });
  }

  isFavorited = (chartId: number, user: User) => {
    return user && user.favorites.some(favorite => favorite.id === chartId);
  }

  async toggleFavorite(chartId: number, addFavorite: boolean) {
    await this.userService.toggleFavorite(chartId, addFavorite);
    this.user = this.userService.getUser();
  }
}
