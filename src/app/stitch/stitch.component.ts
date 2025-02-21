import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { Color, Stitch } from '../charts/model/Chart';

@Component({
  selector: 'app-stitch',
  imports: [],
  templateUrl: './stitch.component.html',
  styleUrl: './stitch.component.less'
})
export class StitchComponent implements OnChanges {
  stitch = input<Stitch>();
  colors = input<Map<Color, string>>();
  isHoverable = input<boolean>();
  showInfo = input<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

}
