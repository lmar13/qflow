import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { EnvironmentProviderService } from "./environment-provider.service";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SkillsService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  get(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/skills`);
  }

  getUsersForSkills(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/usersForSkills`);
  }

  getByName(skillName: string): Observable<any> {
    console.log(skillName);
    return this.httpClient.get(`${this.baseUrl}/usersForSkills/${skillName}`);
  }
}
