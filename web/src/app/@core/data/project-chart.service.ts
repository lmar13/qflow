import { PeriodsService } from "./periods.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { Observable } from "rxjs/Rx";
import { EnvironmentProviderService } from "./environment-provider.service";
import { map } from "rxjs/operators";
import { ProjectChart, User } from "../model";

@Injectable({
  providedIn: "root"
})
export class ProjectChartService {
  private baseUrl: string;
  private data = {};
  private dataForUsers = {};

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService,
    private periodsService: PeriodsService
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
    this.data = {
      week: this.getDataForWeekPeriod(),
      month: this.getDataForMonthPeriod(),
      year: this.getDataForYearPeriod()
    };

    this.dataForUsers = {
      week: this.getDataForUsersAndWeekPeriod,
      month: this.getDataForUsersAndMonthPeriod,
      year: this.getDataForUsersAndYearPeriod
    };
  }

  // For all

  private getDataForWeekPeriod(): Observable<any> {
    return Observable.forkJoin(
      of(this.periodsService.getWeeks()),
      this.httpClient.get(`${this.baseUrl}/stat/week`)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  }

  private getDataForMonthPeriod(): Observable<any> {
    return Observable.forkJoin(
      of(this.periodsService.getMonths()),
      this.httpClient.get(`${this.baseUrl}/stat/month`)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  }

  private getDataForYearPeriod(): Observable<any> {
    return Observable.forkJoin(
      of(this.periodsService.getYears()),
      this.httpClient.get(`${this.baseUrl}/stat/year`)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  }

  // For users - arrow function to use it with parameter, because of changing binding of this

  private getDataForUsersAndWeekPeriod = (users): Observable<any> => {
    return Observable.forkJoin(
      of(this.periodsService.getWeeks()),
      this.httpClient.post(`${this.baseUrl}/stat/week`, users)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  };

  private getDataForUsersAndMonthPeriod = (users): Observable<any> => {
    return Observable.forkJoin(
      of(this.periodsService.getMonths()),
      this.httpClient.post(`${this.baseUrl}/stat/month`, users)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  };

  private getDataForUsersAndYearPeriod = (users): Observable<any> => {
    return Observable.forkJoin(
      of(this.periodsService.getYears()),
      this.httpClient.post(`${this.baseUrl}/stat/year`, users)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  };

  getProjectChartData(period: string): Observable<any> {
    return this.data[period];
  }

  getProjectChartDataForUsers(period: string, users: User[]): Observable<any> {
    return this.dataForUsers[period](users);
  }

  getProjectSummary(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/stat/summary`);
  }

  getProjectSummaryForUsers(users: User[]): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/stat/summary`, users);
  }
}
