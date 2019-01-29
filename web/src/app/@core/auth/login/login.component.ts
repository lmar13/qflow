import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

export interface Credentials {
    email: string;
    password: string;
}
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {
  authForm: FormGroup;
  hasLoginError = false;
  submitted = false;
  rememberMe = false;

  firstTime = true;
  pickEmail = true;

  credentials = {} as Credentials;

  constructor(private authService: AuthService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
  }

  login(): void {
    this.credentials = this.authForm.value;



    console.log
    console.log(this.credentials);
    this.authService.login(this.credentials)
      .subscribe((result: boolean) => {
        this.hasLoginError = !result;
        this.submitted = true;
      });
  }

  private createForm() {
    this.authForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        // (control: AbstractControl) => this.userNameFormat(control)
      ])],
      password: ['', Validators.required],
      rememberMe: [{value: this.rememberMe, disabled: true}],
    });
  }

  userNameFormat(control: AbstractControl): ValidationErrors | null {
    const inputValue: string = control.value;
    const includeText = ['@', '@tr.com', '@thomsonreuters.com', '@refinitiv.com'];

    if ( inputValue.toLowerCase().includes(includeText[0])
      || inputValue.toLowerCase().includes(includeText[1])
      || inputValue.toLowerCase().includes(includeText[2])
      || inputValue.toLowerCase().includes(includeText[3])) {
        return { usernameFormat: true };
    } else {
      return null;
    }
  }

  checkIf(control: string): boolean {
    if (this.authForm.controls[control].pristine) {
      return true;
    } else {
      if (this.authForm.controls[control].errors) {
        return false;
      } else {
        return true;
      }
    }
  }

}
