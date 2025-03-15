import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../../shared/services/http-client.service';
import { User } from '../../model/User';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-viewer',
  imports: [],
  templateUrl: './user-viewer.component.html',
  styleUrl: './user-viewer.component.less'
})
export class UserViewerComponent {
  user?: User;

  constructor(activatedRoute: ActivatedRoute, httpService: HttpClientService, nzMessageService: NzMessageService, router: Router) {
    const username = activatedRoute.snapshot.paramMap.get('username');

    if (username) {
      httpService.getUser(username).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          nzMessageService.error("User not found");
          router.navigate(['/charts/list']);
        }
      })
    }
  }
}
