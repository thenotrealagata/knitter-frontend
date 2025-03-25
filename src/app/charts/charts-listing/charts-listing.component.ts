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

@Component({
  selector: 'app-charts-listing',
  imports: [NzCardModule, NzIconModule, NzTagModule, NzGridModule, ChartsListingElementComponent],
  templateUrl: './charts-listing.component.html',
  styleUrl: './charts-listing.component.less'
})
export class ChartsListingComponent {
  user: User | null;
  username: string | null;
  charts: Chart[] = [];

  httpService: HttpClientService;
  userService: UserService;
  
  constructor(httpService: HttpClientService, sessionService: UserService) {
    this.user = sessionService.getUser();
    this.username = sessionService.getUsername();

    this.httpService = httpService;
    this.userService = sessionService;

    // TODO probably 5 layers of programming war crimes were done here
    if(!this.user && this.username) {
      httpService.getUser(this.username).subscribe({
        next: (user) => {
          sessionService.setUser(user);
          this.user = user;
        },
        error: (err) => {

        }
      });
    }

    httpService.getCharts().subscribe({
      next: (charts) => {
        this.charts = charts;
      },
      error: (err) => {

      }
    });
  }

  isFavorited = (chartId: number, user: User) => {
    return user.favorites.some(favorite => favorite.id === chartId) ?? false;
  }

  async toggleFavorite(chartId: number, addFavorite: boolean) {
    await this.userService.toggleFavorite(chartId, addFavorite);
    this.user = this.userService.getUser();
  }
}
