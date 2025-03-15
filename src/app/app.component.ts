import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { SessionService } from './session.service';

const ngZorroModules = [
  NzPageHeaderModule, NzDropDownModule, NzSpaceModule, NzIconModule, NzButtonModule, NzAvatarComponent
]

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  RouterLink, ...ngZorroModules],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'knitter-frontend';

  sessionService: SessionService;

  constructor (sessionService: SessionService) {
    this.sessionService = sessionService;
  }
}
