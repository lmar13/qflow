import { AuthService } from './../../../@core/auth/shared/auth.service';
import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { filter, map } from 'rxjs/operators';
import { User } from '../../../@core/model';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  whiteLogo = true;

  user: User;
  isAuth: boolean;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private authService: AuthService,
              private themeService: NbThemeService,
              private analyticsService: AnalyticsService,
              private router: Router) {
  }

  ngOnInit() {
    this.isAuth = this.authService.isAuth;
    this.user = this.authService.decToken;

    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({item: { title }}) => title)
      )
      .subscribe(title => title === 'Log out' ? this.authService.logout() : this.router.navigate(["/pages/user"]));

    this.themeService.onThemeChange().subscribe((theme: any) => this.whiteLogo = theme.name === 'default' ? false : true);
    // this.themeService.onThemeChange().subscribe((theme: any) => console.log(theme));
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
