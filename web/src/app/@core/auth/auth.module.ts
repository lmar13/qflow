import { NgModule } from '@angular/core';
import { AuthRoutingModule, components } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NbInputModule, NbCheckboxModule, NbAlertModule } from '@nebular/theme';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NbAuthModule,
    NbInputModule,
    NbCheckboxModule,
    NbAlertModule,
  ],
  declarations: [
    components
  ]
})
export class AuthModule { }
