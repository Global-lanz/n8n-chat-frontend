import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AppActions from '@store/actions/app.actions';
import * as AppSelectors from '@store/selectors/app.selectors';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  botName$: Observable<string>;
  appLogo$: Observable<string | null>;
  version = environment.version;
  showPassword = false;
  embedFallbackUrl = environment.embedFallbackUrl;
  // Password login is only ever reachable as a top-level page for the app's
  // own direct customers. A page running inside an iframe only happens via
  // the embed-SSO widget — there, /auth/callback (not this form) is the
  // intended entry point, so credentials should never be collected here.
  // This check is unconditional (not per-account) so it can't be used to
  // probe whether a given email is an embed-provisioned account.
  isEmbedded = window.self !== window.top;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loading$ = this.store.select(AppSelectors.selectAuthLoading);
    this.error$ = this.store.select(AppSelectors.selectAuthError);
    this.botName$ = this.store.select(AppSelectors.selectBotName);
    this.appLogo$ = this.store.select(AppSelectors.selectAppLogo);
  }

  ngOnInit(): void {
    if (environment.authPortalUrl) {
      window.location.href = environment.authPortalUrl;
      return;
    }
    this.store.dispatch(AppActions.loadConfig());
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AppActions.login({ email, password }));
    }
  }
}
