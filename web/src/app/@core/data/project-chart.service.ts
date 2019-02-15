import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { Observable } from "rxjs/Rx";
import { PeriodsService } from "../mock/periods.service";
import { EnvironmentProviderService } from "./environment-provider.service";
import { map } from "rxjs/operators";
import { ProjectChart } from "../model/project-chart";

@Injectable({
  providedIn: "root"
})
export class ProjectChartService {
  private baseUrl: string;
  private data = {};

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService,
    private period: PeriodsService
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
    this.data = {
      week: this.getDataForWeekPeriod(),
      month: this.getDataForMonthPeriod(),
      year: this.getDataForYearPeriod()
    };
  }

  private getDataForWeekPeriod(): Observable<any> {
    return Observable.forkJoin(
      of(this.period.getWeeks()),
      this.httpClient.get(`${this.baseUrl}/stat/week`)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  }

  private getDataForMonthPeriod(): Observable<any> {
    return Observable.forkJoin(
      of(this.period.getMonths()),
      this.httpClient.get(`${this.baseUrl}/stat/month`)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  }

  private getDataForYearPeriod(): Observable<any> {
    return Observable.forkJoin(
      of(this.period.getYears()),
      this.httpClient.get(`${this.baseUrl}/stat/year`)
    ).pipe(map(([chartLabel, data]) => ({ chartLabel, data } as ProjectChart)));
  }

  getProjectChartData(period: string): Observable<any> {
    return this.data[period];
  }
}
