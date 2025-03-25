import { Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { Chart } from '../../../model/Chart';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ParagraphPipe } from '../../../shared/pipes/paragraph.pipe';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClientService } from '../../../shared/services/http-client.service';

@Component({
  selector: 'app-charts-listing-element',
  imports: [NzGridModule, NzCardModule, ParagraphPipe, RouterLink, NzIconModule],
  templateUrl: './charts-listing-element.component.html',
  styleUrl: './charts-listing-element.component.less'
})
export class ChartsListingElementComponent implements OnInit {
  chart = input.required<Chart>();
  isFavorited = input<boolean>();

  toggleFavorite = output();

  cardMode = input<'horizontal' | 'vertical'>('vertical');
  showDescription = input<boolean>(true);
  showTags = input<boolean>(true);
  showSize = input<boolean>(true);
  
  showFavorite = input<boolean>(false);
  showViewMore = input<boolean>(true);

  imageSrc?: string;

  httpClient: HttpClientService

  constructor(httpClient: HttpClientService) {
    this.httpClient = httpClient;
  }

  ngOnInit(): void {
    if (!this.chart().filePath) return;
    
    this.httpClient.getImage(this.chart().filePath).subscribe({
      next: (img) => {
        this.imageSrc = URL.createObjectURL(img);
      },
      error: (err) => {

      }
    })
  }
}
