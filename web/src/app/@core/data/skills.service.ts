import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { EnvironmentProviderService } from "./environment-provider.service";
import { catchError, map } from "rxjs/operators";
import { Skill, User } from "../model";

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

  get(): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(`${this.baseUrl}/skills`);
  }

  getUsersForSkills(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/usersForSkills`);
  }

  getUsersBySkill(skillId: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/usersForSkills/${skillId}`);
  }

  addSkill(skill: string): Observable<Skill> {
    return this.httpClient.post<Skill>(`${this.baseUrl}/skill`, skill).pipe(
      catchError(err => {
        throw err;
      }),
      map(value => value as Skill)
    );
  }

  updateSkillById(skill: Skill): Observable<Skill> {
    return this.httpClient.put<Skill>(`${this.baseUrl}/skill/${skill._id}`, skill).pipe(
      catchError(err => {
        throw err;
      }),
      map(value => value as Skill)
    );
  }

  deleteSkillById(skill: Skill): Observable<Skill> {
    return this.httpClient.delete<Skill>(`${this.baseUrl}/skill/${skill._id}`);
  }
}
