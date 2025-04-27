import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AuthenticationForm } from '../shared/services/form.interfaces';
import { FormService } from '../shared/services/form.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClientService } from '../shared/services/http-client.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  imports: [ NzFormModule, ReactiveFormsModule, NzButtonModule, NzInputModule, RouterLink],
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
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.httpClient = httpClient;
    this.formService = formService;
    this.nzMessageService = nzMessageService;
    this.sessionService = sessionService;
    this.router = router;

    this.login = activatedRoute.snapshot.routeConfig?.path === 'login';
    this.authForm = formService.authenticationForm(this.login ? [] : [ Validators.minLength(5) ]);
  }

  authenticate() {
    let hasError = false;
    Object.values(this.authForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
      hasError = hasError || control.invalid;
    });
    if(hasError) {
      this.nzMessageService.error('Please provide all the required fields.');
      return;
    }

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
}
