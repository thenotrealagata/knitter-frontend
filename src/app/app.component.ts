import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';

const ngZorroModules = [
  NzPageHeaderModule, NzDropDownModule, NzSpaceModule, NzIconModule, NzButtonModule, NzAvatarComponent
]

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  RouterLink, NgIf, ...ngZorroModules],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'knitter-frontend';

  user = {
    id: 0,
    username: "annie-the-knitter",
    favorites: [1, 2],
  };
}
