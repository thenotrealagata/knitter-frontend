import { AfterViewInit, Component, input, OnChanges, OnInit, output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Chart } from '../../../shared/model/Chart';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ParagraphPipe } from '../../../shared/pipes/paragraph.pipe';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClientService } from '../../../shared/services/http-client.service';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-charts-listing-element',
  imports: [NzGridModule, NzCardModule, ParagraphPipe, RouterLink, NzIconModule, NzSkeletonModule, NzSpaceModule],
  templateUrl: './charts-listing-element.component.html',
  styleUrl: './charts-listing-element.component.less'
})
export class ChartsListingElementComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('viewTemplate') viewMoreTemplate?: TemplateRef<any>;
  @ViewChild('favoriteTemplate') favoriteTemplate?: TemplateRef<any>;
  cardActions: TemplateRef<void>[] = [];

  chart = input.required<Chart>();
  isFavorited = input<boolean>();
  isPanel = input<boolean>(false);

  toggleFavorite = output();

  cardMode = input<'horizontal' | 'vertical'>('vertical');
  showDescription = input<boolean>(true);
  showSize = input<boolean>(true);
  
  showFavorite = input<boolean>(false);
  showViewMore = input<boolean>(true);
  customActions = input<TemplateRef<void>[]>([]);

  imageSrc?: string;

  httpClient: HttpClientService

  constructor(httpClient: HttpClientService) {
    this.httpClient = httpClient;
  }

  ngOnInit(): void {
    if (!this.chart().filePath) return;

    // Inputs are first available in the OnInit lifecycle hook
    this.httpClient.getImage(this.chart().filePath).subscribe({
      next: (img) => {
        this.imageSrc = URL.createObjectURL(img);
      },
      error: (err) => {

      }
    })
  }

  ngAfterViewInit(): void {
    // TemplateRefs are first available after view init
    this.regenerateActionList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showFavorite'] || changes['showViewMore']) {
      this.regenerateActionList();
    }
  }

  regenerateActionList() {
    this.cardActions = [];

    if (this.showViewMore() && this.viewMoreTemplate) {
      this.cardActions.push(this.viewMoreTemplate);
    }
    if (this.showFavorite() && this.favoriteTemplate) {
      this.cardActions.push(this.favoriteTemplate);
    }
    
    this.cardActions.push(...this.customActions());
  }
}
