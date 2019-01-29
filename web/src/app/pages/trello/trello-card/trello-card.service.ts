import { Observable, Subject } from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Card } from '../../../@core/model';
import { EnvironmentProviderService } from '../../../@core/data/environment-provider.service';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TrelloCardService {
  private baseUrl: string;

  private editCardStateSource = new Subject<Card>();
  editCardState = this.editCardStateSource.asObservable();

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService) {
      this.baseUrl = envProvider.current.apiBaseUri;
  }

  getAll(): Observable<Card[]> {
    return this.httpClient
        .get<Card[]>(`${this.baseUrl}/card`)
  }

  getAllForBoardId(boardId: string): Observable<Card[]> {
    return this.httpClient
        .get<Card[]>(`${this.baseUrl}/board/${boardId}/cards`)
  }

  getById(id: string): Observable<Card> {
    return this.httpClient
        .get<Card>(`${this.baseUrl}/card/${id}`)
  }

  edit(card: Card): Observable<Card> {
    return this.httpClient.put<Card>(`${this.baseUrl}/card/${card._id}`, card)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Card)
      );
  }

  editAll(boardId: string, cards: Card[]): Observable<Card[]> {
    return this.httpClient.put<Card[]>(`${this.baseUrl}/cardAll`, { boardId, cards })
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Card[])
      )
  }

  add(card: Card): Observable<Card> {
    return this.httpClient.post<Card>(`${this.baseUrl}/card`, card)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Card)
      );
  }

  delete(id: string): Observable<Card> {
    return this.httpClient.delete(`${this.baseUrl}/card/${id}`)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Card)
      );
  }

  changeEditState(card: Card) {
    this.editCardStateSource.next(card);
  }
}
