import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { EnvironmentProviderService } from '../../data/environment-provider.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly notAuthorizedRelatedHttpCodes = [401, 403, 407, 511];
  private readonly appToken: string;

  constructor(
    private authService: AuthService,
    environmentProviderService: EnvironmentProviderService
    ) {
    this.appToken = environmentProviderService.current.appToken;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('##$$$$______ hit Auth');

    const modifiedReq = req.clone({
      setHeaders: {
        'Authorization': this.authService.getAuthorizationHeaderValue(), // token for users
      },
      withCredentials: true // send authorization cookies [ true, false ]
    });

    return next.handle(modifiedReq)
      .pipe(
        catchError(err => {
          if (this.isAuthError(err)) {
            this.authService.logout();
          }
          // return of(err);
          return throwError(err);
        })
      );
  }

  private isAuthError = (error: any) => error instanceof HttpErrorResponse && this.notAuthorizedRelatedHttpCodes.includes(error.status);

}
