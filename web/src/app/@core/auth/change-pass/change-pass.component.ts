import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService } from './../shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {
  form: FormGroup;

  hasError = false;
  signedUp = false;
  canChangePassword = null;
  private token: string;
  email: string;

  error: string;
  showConfirm = false;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(param => this.token = param.token);
    // this.canChangePass();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      pass: ['', Validators.compose([
        Validators.required,
        (control: AbstractControl) => this.invalidPass(control)])],
      confirmPass: ['', Validators.required]
    }, {validator: this.checkPasswords});
  }

  // canChangePass() {
  //   this.authService.canChangePass(this.token)
  //     .subscribe(result => {
  //       this.canChangePassword = !result;
  //     });
  // }

  changePass() {
    this.authService.changePass(this.form.value, this.token)
      .subscribe(result => {
        this.hasError = !result;
        this.signedUp = true;
      });
  }

  goToLogin() {
    this.router.navigate(['/auth/login'])
  }

  invalidPass(control: AbstractControl): ValidationErrors | null {
    const inputValue: string = control.value;

    // console.log(this.authForm.errors);

    if (inputValue) {
      if (inputValue === '' || inputValue.length >= 4 ) {
        return null;
      }
      return { invalidPass: true };
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
