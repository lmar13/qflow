import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../auth/shared/auth.service';

export interface SignUpCredentials {
  name: string;
  surname: string;
  email: string;
  empID: number;
  passwords: {
    pass: string;
    confirmPass: string;
  };
}

@Component({
  selector: 'ngx-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  passGroup: FormGroup;
  hasLoginError = false;
  submitted = false;

  credentials = {} as SignUpCredentials;

  constructor(private fb: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
    this.createForm();
  }

  signUp() {
    this.credentials = this.registerForm.value;
    this.authService.signUp(this.credentials)
      .subscribe((result: boolean) => {
        this.hasLoginError = !result;
        this.submitted = true;
      });
  }

  private createForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        (control: AbstractControl) => this.invalidEmail(control)])],
      empId: ['', Validators.compose([
        Validators.required,
        (control: AbstractControl) => this.invalidEmpId(control)])],
      passwords: this.fb.group({
        pass: ['', Validators.compose([
          Validators.required,
          Validators.minLength(4)
        ])],
        confirmPass: ['', Validators.required]
      }, {validator: this.checkPasswords})
    });
  }

  invalidEmail(control: AbstractControl): ValidationErrors | null {
    const inputValue: string = control.value;

    if (inputValue) {
      if (inputValue === '' || (!inputValue.startsWith('@') && inputValue.endsWith('@refinitiv.com'))) {
        return null;
      }
      return { invalidEmail: true };
    }
  }

  invalidEmpId(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;

    if (inputValue) {
      if ((inputValue === '' || inputValue.length === 7) && !isNaN(inputValue)) {
          return null;
      }
      return { invalidEmpId: true };
    }
  }

  checkPasswords(group: FormGroup): ValidationErrors | null {
    const pass = group.get('pass').value;
    const confirmPass = group.get('confirmPass').value;

    if (confirmPass === '' || confirmPass === pass) {
      return null;
    }

    return { notEquivalent: true };
  }
}
