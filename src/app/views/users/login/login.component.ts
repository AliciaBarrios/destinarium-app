import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDTO } from '../../../models/auth.dto';
import { AuthService } from '../../../services/auth.services';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SharedService } from '../../../services/shared.services';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: AuthDTO;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {
    const msg = this.sharedService.getLoginRedirectMessage();
    if (msg) {
      this.sharedService.managementToast('toast', true, undefined, msg);
      this.sharedService.clearLoginRedirectMessage();
    }
  }

  login(): void {
    let responseOK: boolean = false;
    let errorResponse: HttpErrorResponse;
  
    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;
  
    this.authService.login(this.loginUser).pipe(
      finalize(async () => {
        await this.sharedService.managementToast(
        'toast',
        responseOK,
        errorResponse as any
        );

        if (responseOK) {
          this.router.navigateByUrl('/');
        }
      })
    ).subscribe({
      next: (authToken) => {
        responseOK = true;
        this.loginUser.user_id = authToken.user_id;
        this.loginUser.access_token = authToken.access_token;
        // save token to localstorage for next requests
        this.localStorageService.set('user_id', this.loginUser.user_id);
        this.localStorageService.set('access_token', this.loginUser.access_token);

        this.authService.setAuthState(true);
      },
      error: (error: HttpErrorResponse) => {
        responseOK = false;
        errorResponse = error.error;
  
        this.sharedService.errorLog(error.error);
      }
    });
  }
}