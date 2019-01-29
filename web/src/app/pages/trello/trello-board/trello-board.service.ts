import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Board, Column, Card } from '../../../@core/model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EnvironmentProviderService } from '../../../@core/data/environment-provider.service';
import { catchError, map } from 'rxjs/operators';
import { TrelloColumnService } from '../trello-column/trello-column.service';
import { TrelloCardService } from '../trello-card/trello-card.service';

@Injectable({
  providedIn: 'root'
})
export class TrelloBoardService {
  boardsCache: Board[] = [];
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService,
    private columnService: TrelloColumnService,
    private cardService: TrelloCardService
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  getAll(): Observable<Board[]> {
    return this.httpClient.get<Board[]>(`${this.baseUrl}/boards`)
  }

  getDataForUser(id: string): Observable<Board[]> {
    // return this.httpClient.get<string[]>(`./../../../assets/data/data.json`);
    return this.httpClient.get<Board[]>(`${this.baseUrl}/boardsForUser/${id}`)
  }

  getById(id: string): Observable<Board> {
    return this.httpClient.get<Board>(`${this.baseUrl}/board/${id}`)
  }

  getBoardWithColumnsAndCards(id: string): Observable<any> {
    return Observable.forkJoin(
      this.getById(id),
      this.columnService.getAll(),
      this.cardService.getAllForBoardId(id)
    );
  }

  edit(board: Board): Observable<Board> {
    return this.httpClient.put<Board>(`${this.baseUrl}/board/${board._id}`, board)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Board)
      );
  }

  add(board: Board): Observable<Board> {
    return this.httpClient.post<Board>(`${this.baseUrl}/board`, board)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Board)
      );
  }

  delete(id: string): Observable<boolean> {
    return this.httpClient.delete(`${this.baseUrl}/board/${id}`, {
      observe: 'response'
    }).pipe(
      map
      ((response: HttpResponse<Object>) => response.ok)
    );
  }

}
