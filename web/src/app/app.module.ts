/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'angular-sortablejs';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { CoreModule } from './@core/core.module';
import { ENVIRONMENT_TOKEN } from './@core/data/environment';
import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './@core/auth/shared/auth.interceptor';
import { NbDatepickerModule } from '@nebular/theme';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    NgbModule.forRoot(),
    NbDatepickerModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    SortablejsModule.forRoot({ animation: 150 })
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: ENVIRONMENT_TOKEN,
      useValue: environment
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
})
export class AppModule {
}
