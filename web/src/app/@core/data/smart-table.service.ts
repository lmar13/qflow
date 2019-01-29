import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Board } from '../model';
import { EnvironmentProviderService } from './environment-provider.service';

@Injectable({
  providedIn: 'root'
})
export class SmartTableService {

  private selectedBoardSource = new BehaviorSubject("init");
  selectedBoard = this.selectedBoardSource.asObservable();
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService,
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  getData(): Observable<Board[]> {
    // return this.httpClient.get<string[]>(`./../../../assets/data/data.json`);
    return this.httpClient.get<Board[]>(`${this.baseUrl}/boards`)
  }

  getBoardById(id: string): Observable<Board> {
    return this.httpClient.get<Board>(`${this.baseUrl}/board/${id}`)
  }

  getDataForUser(id: string): Observable<Board[]> {
    // return this.httpClient.get<string[]>(`./../../../assets/data/data.json`);
    return this.httpClient.get<Board[]>(`${this.baseUrl}/board`, {
      params: {
        // userId: id
        userId: '6065178'
      }
    })
  }

  changeSelectedBoard(id: string) {
    this.selectedBoardSource.next(id);
  }
}
