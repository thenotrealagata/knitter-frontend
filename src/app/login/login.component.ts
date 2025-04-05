import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AuthenticationForm } from '../shared/services/form.interfaces';
import { FormService } from '../shared/services/form.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../shared/services/http-client.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  imports: [ NzFormModule, ReactiveFormsModule, NzButtonModule, NzInputModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  authForm: FormGroup<AuthenticationForm>;
  login = true; // False when registering

  httpClient: HttpClientService;
  formService: FormService;
  nzMessageService: NzMessageService;
  sessionService: UserService;
  router: Router;

  constructor(formService: FormService,
    httpClient: HttpClientService,
    nzMessageService: NzMessageService,
    sessionService: UserService,
    router: Router) {
    this.httpClient = httpClient;
    this.formService = formService;
    this.nzMessageService = nzMessageService;
    this.sessionService = sessionService;
    this.router = router;

    this.authForm = formService.authenticationForm();
  }

  authenticate() {
    const request = this.formService.formToAuthRequest(this.authForm);
    if (this.login) {
      // Send authentication request
      this.httpClient.login(request).subscribe({
        next: (authToken) => {
          this.sessionService.setUsername(request.username);
          this.sessionService.createSession(authToken.message);
          this.nzMessageService.success('Successful login');
          this.router.navigate(['/charts/list']);
        },
        error: (err) => {
          this.nzMessageService.error('Login unsuccessful.');
          this.authForm.reset();
        }
      })
    } else {
      // Create new user
      this.httpClient.register(request).subscribe({
        next: () => {
          this.nzMessageService.success('Successful registration. Log in with your credentials.');
          this.login = true;
          this.authForm.reset();
        },
        error: (err) => {
          if (err.status === 409) {
            this.nzMessageService.error('The given username exists, please choose another one.');
          } else {
            this.nzMessageService.error('Unsuccessful registration.');
          }
        }
      })
    }
  }

  toggleLoginMode() {
    this.login = !this.login;
    this.authForm.reset();
  }
}
