import { Observable, Subject } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { EnvironmentProviderService } from "./environment-provider.service";
import { Card } from "../model";

@Injectable({
  providedIn: "root"
})
export class SubcardService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  getAll(): Observable<Card[]> {
    return this.httpClient.get<Card[]>(`${this.baseUrl}/subcards`);
  }

  // getAllForBoardId(boardId: string): Observable<Card[]> {
  //   return this.httpClient.get<Card[]>(
  //     `${this.baseUrl}/board/${boardId}/cards`
  //   );
  // }

  getAllSubcardsForBoardIdAndCardId(
    boardId: string,
    cardId: string
  ): Observable<Card[]> {
    return this.httpClient.get<Card[]>(
      `${this.baseUrl}/board/${boardId}/card/${cardId}/subcards`
    );
  }

  getById(id: string): Observable<Card> {
    return this.httpClient.get<Card>(`${this.baseUrl}/subcard/${id}`);
  }

  edit(card: Card): Observable<Card> {
    return this.httpClient
      .put<Card>(`${this.baseUrl}/subcard/${card._id}`, card)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Card)
      );
  }

  editAll(boardId: string, subcards: Card[]): Observable<Card[]> {
    return this.httpClient
      .put<Card[]>(`${this.baseUrl}/subcardAll`, { boardId, subcards })
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Card[])
      );
  }

  add(card: Card): Observable<Card> {
    return this.httpClient.post<Card>(`${this.baseUrl}/subcard`, card).pipe(
      catchError(err => {
        throw err;
      }),
      map(value => value as Card)
    );
  }

  delete(id: string): Observable<Card> {
    return this.httpClient.delete(`${this.baseUrl}/subcard/${id}`).pipe(
      catchError(err => {
        throw err;
      }),
      map(value => value as Card)
    );
  }
}
