import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AtomicStitch, AtomicStitchType, Color } from '../model/Chart';
import { StitchComponent } from '../../stitch/stitch.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-chart-editor',
  imports: [NzLayoutModule, StitchComponent, NzFlexModule],
  templateUrl: './chart-editor.component.html',
  styleUrl: './chart-editor.component.less'
})
export class ChartEditorComponent {
  atomicStitchInventory = Object.keys(AtomicStitchType)
    .filter(key => isNaN(Number(key)))
    .map(stitchType => new AtomicStitch(Color.MC, stitchType as AtomicStitchType));

  colors: Map<Color, string> = new Map();
}
