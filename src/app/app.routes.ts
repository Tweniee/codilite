import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OtpComponent } from './otp/otp.component';
import { ProfileComponent } from './profile/profile.component';
import { CodeBoxComponent } from './code-box/code-box.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'verify-otp', component: OtpComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'code-box', component: CodeBoxComponent },
  { path: '', redirectTo: 'code-box', pathMatch: 'full' }
];
