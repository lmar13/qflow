import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { EnvironmentProviderService } from "./environment-provider.service";
import { Column } from "../model";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ColumnService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  getAll(): Observable<Column[]> {
    return this.httpClient.get<Column[]>(`${this.baseUrl}/column`);
    // return this.httpClient.get<Column[]>(`./../../../../assets/data/columns.json`)
  }

  getById(id: string): Observable<Column> {
    return this.httpClient.get<Column>(`${this.baseUrl}/column/${id}`);
  }

  getForBoard(id: string): Observable<Column[]> {
    return this.httpClient.get<Column[]>(
      `${this.baseUrl}/columnForBoard/${id}`
    );
  }

  addMany(columns: Column[]): Observable<Column[]> {
    return this.httpClient
      .post<Column[]>(`${this.baseUrl}/columns`, columns)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Column[])
      );
  }
}
