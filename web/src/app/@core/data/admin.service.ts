import { HttpClient } from '@angular/common/http';

import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../model';
import { EnvironmentProviderService } from './environment-provider.service';


let counter = 0;

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient,
    envProvider: EnvironmentProviderService,
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/users`);
  }

  updateUserById(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}/users/${user._id}`, user);
  }
}
