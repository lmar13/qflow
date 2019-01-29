import { AuthComponent } from './auth.component';
import { AccForgotComponent } from './acc-forgot/acc-forgot.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { AccConfirmComponent } from './acc-confirm/acc-confirm.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      },
      {
        path: 'activation/:token',
        component: AccConfirmComponent
      },
      {
        path: 'forgot',
        component: AccForgotComponent
      },
      {
        path: 'reset/:token',
        component: ChangePassComponent
      },
    ]
  },

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}

export const components = [
  LoginComponent,
  SignUpComponent,
  AccConfirmComponent,
  ChangePassComponent,
  AccForgotComponent,
  AuthComponent
];
