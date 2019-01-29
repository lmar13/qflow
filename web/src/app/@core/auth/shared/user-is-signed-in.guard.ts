import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserIsSignedInGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleActivation();
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.handleActivation();
  }

  private handleActivation(): boolean | Promise<boolean> {
    const isAuth = this.authService.isAuth;

    if (!isAuth) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
