import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { AuthService } from '../@core/auth/shared/auth.service';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {
  menu = MENU_ITEMS;

  constructor(private authService: AuthService) {
    if(this.authService.decToken.role !== 'admin'){
      this.menu = MENU_ITEMS.filter(val => val.title !== 'Admin Panel');
    }
  }
}
