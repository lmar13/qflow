import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'ngx-acc-forgot',
  templateUrl: './acc-forgot.component.html',
  styleUrls: ['./acc-forgot.component.scss']
})
export class AccForgotComponent implements OnInit {
  hasError = false;
  email: string;
  submitted = false;

  constructor(private authService: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  sendEmail() {
    this.authService.sendResetToken(this.email).subscribe(result => {
      this.hasError = !result;
      this.submitted = true;
    });
  }

  companyEmail(control: AbstractControl): ValidationErrors | null {
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

}
