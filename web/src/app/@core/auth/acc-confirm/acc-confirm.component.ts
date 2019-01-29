import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'ngx-acc-confirm',
  templateUrl: './acc-confirm.component.html',
  styleUrls: ['./acc-confirm.component.scss']
})
export class AccConfirmComponent implements OnInit {
  email: string;
  hasError = false;
  error: string;
  showConfirm = false;

  constructor(private authService: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(param => (
      this.authService.activateAccount(param.token)
        .subscribe(result => {
          this.showConfirm = result;
          console.log(result);
        })));

  }



  resendEmail() {
    this.authService.resendToken(this.email).subscribe(data => {
      // if(!data['ok']) {
      //   this.error = data['error']['msg'];
      //   this.hasError = true;
      // } else {
      //   this.hasError = false;
      // }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login'])
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
