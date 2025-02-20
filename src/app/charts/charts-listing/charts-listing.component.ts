import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ParagraphPipe } from '../../shared/pipes/paragraph.pipe';
import { RouterLink } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-charts-listing',
  imports: [NzCardModule, NzIconModule, ParagraphPipe, NzTagModule, RouterLink, NzGridModule],
  templateUrl: './charts-listing.component.html',
  styleUrl: './charts-listing.component.less'
})
export class ChartsListingComponent {
  exampleChart = [{
    id: 0,
    title: "Basic lace stitch",
    username: "annie_the_knitter",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet imperdiet est. Nulla sed eros in risus pharetra ultrices non at odio. Pellentesque faucibus aliquet metus sed facilisis. Aliquam at lacus eget erat varius luctus. Proin velit leo, pharetra sed rhoncus a, tristique vel tortor. Nunc fringilla ante tortor, eu egestas lorem volutpat sed. Cras feugiat aliquet eros, in imperdiet lectus eleifend sed. Nam aliquam euismod turpis rhoncus cursus. Integer ac blandit odio. Sed sed lacus felis. Pellentesque vehicula fringilla quam ac volutpat. Donec dictum aliquam molestie. Proin tincidunt ultricies mauris ac sagittis. Ut a mauris cursus neque suscipit aliquam quis nec erat. Etiam ac ipsum nec nisl pulvinar volutpat.",
    isFavourited: true,
    tags: ["lace", "cable"],
    width: 20,
    height: 15,
    imgSource: "https://i.pinimg.com/736x/3a/be/31/3abe314e77dcaa2653d84ed3bff64093.jpg"
  }, {
    id: 1,
    title: "Basic lace stitch 2",
    username: "annie_the_knitter",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet imperdiet est. Nulla sed eros in risus pharetra ultrices non at odio. Pellentesque faucibus aliquet metus sed facilisis. Aliquam at lacus eget erat varius luctus. Proin velit leo, pharetra sed rhoncus a, tristique vel tortor. Nunc fringilla ante tortor, eu egestas lorem volutpat sed. Cras feugiat aliquet eros, in imperdiet lectus eleifend sed. Nam aliquam euismod turpis rhoncus cursus. Integer ac blandit odio. Sed sed lacus felis. Pellentesque vehicula fringilla quam ac volutpat. Donec dictum aliquam molestie. Proin tincidunt ultricies mauris ac sagittis. Ut a mauris cursus neque suscipit aliquam quis nec erat. Etiam ac ipsum nec nisl pulvinar volutpat.",
    isFavourited: true,
    tags: ["lace", "cable"],
    width: 20,
    height: 15,
    imgSource: "https://i.pinimg.com/736x/3a/be/31/3abe314e77dcaa2653d84ed3bff64093.jpg"
  }, {
    id: 2,
    title: "Basic lace stitch 3",
    username: "annie_the_knitter",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet imperdiet est. Nulla sed eros in risus pharetra ultrices non at odio. Pellentesque faucibus aliquet metus sed facilisis. Aliquam at lacus eget erat varius luctus. Proin velit leo, pharetra sed rhoncus a, tristique vel tortor. Nunc fringilla ante tortor, eu egestas lorem volutpat sed. Cras feugiat aliquet eros, in imperdiet lectus eleifend sed. Nam aliquam euismod turpis rhoncus cursus. Integer ac blandit odio. Sed sed lacus felis. Pellentesque vehicula fringilla quam ac volutpat. Donec dictum aliquam molestie. Proin tincidunt ultricies mauris ac sagittis. Ut a mauris cursus neque suscipit aliquam quis nec erat. Etiam ac ipsum nec nisl pulvinar volutpat.",
    isFavourited: true,
    tags: ["lace", "cable"],
    width: 20,
    height: 15,
    imgSource: "https://i.pinimg.com/736x/3a/be/31/3abe314e77dcaa2653d84ed3bff64093.jpg"
  }];

}
