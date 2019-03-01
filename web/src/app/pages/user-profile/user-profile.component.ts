import { SkillsService } from './../../@core/data/skills.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SignUpCredentials } from '../../@core/auth';
import { AuthService } from '../../@core/auth/shared/auth.service';
import {Location} from '@angular/common';
import { User, Skill } from '../../@core/model';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  form: FormGroup;
  passGroup: FormGroup;

  user: User;
  skills: Skill[];

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private skillsService: SkillsService,
    private userService: UserService,
    private location: Location) {
      this.userService.getUserById(this.authService.decToken._id)
        .subscribe(user => {
          this.user = user
          this.createForm()
        });
      this.skillsService.get().subscribe(skills => this.skills = skills);
    }

  ngOnInit() {
    // this.createForm();
  }

  back() {
    this.location.back();
    return false;
  }

  save() {
    this.form.value;
    this.userService.updateUserById({
      ...this.form.value,
      _id: this.user._id,
      role: this.user.role,
      isVerified: this.user.isVerified

    }).subscribe(() => console.log('send to server'))
  }

  private createForm() {
    this.form = this.fb.group({
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      email: [this.user.email, Validators.compose([
        Validators.required,
        (control: AbstractControl) => this.invalidEmail(control)])],
      empId: [this.user.empId, Validators.compose([
        Validators.required,
        // (control: AbstractControl) => this.invalidEmpId(control)
      ])],
      skills: [this.user.skills, Validators.required]
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
}
