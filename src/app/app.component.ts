import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { UserService } from './shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';

const ngZorroModules = [
  NzPageHeaderModule, NzDropDownModule, NzSpaceModule, NzIconModule, NzButtonModule
]

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...ngZorroModules],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'knitter-frontend';

  sessionService: UserService;

  constructor (sessionService: UserService, translate: TranslateService) {
    this.sessionService = sessionService;
    translate.setDefaultLang('en');
  }
}
