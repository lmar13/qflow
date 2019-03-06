import { Component } from "@angular/core";
import { NbMenuItem } from "@nebular/theme";
import { AuthService } from "../@core/auth/shared/auth.service";
import { MenuService } from './../@core/data/menu.service';


@Component({
  selector: "ngx-pages",
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `
})
export class PagesComponent {
  menu = [] as NbMenuItem[];

  constructor(private authService: AuthService,
              private menuService: MenuService) {
    if (this.authService.decToken.role !== "admin") {
      this.menuService.getMenuForUser().subscribe(menu => this.menu = menu);
    }
    else {
      this.menuService.getMenuForAdmin().subscribe(menu => this.menu = menu);
    }
  }
}
