
import { of as observableOf,  Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { EnvironmentProviderService } from './environment-provider.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient,
    envProvider: EnvironmentProviderService,
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/${userId}`)
  }

  updateUserById(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}/users/${user._id}`, user);
  }
}
