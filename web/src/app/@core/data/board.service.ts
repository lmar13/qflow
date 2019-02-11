import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { Observable } from "rxjs/Rx";
import { Board } from "../model";
import { EnvironmentProviderService } from "./environment-provider.service";
import { ColumnService } from "./column.service";
import { CardService } from "./card.service";
import { SubcardService } from "./subcard.service";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BoardService {
  boardsCache: Board[] = [];
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService,
    private columnService: ColumnService,
    private cardService: CardService,
    private subcardService: SubcardService,
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  getAll(): Observable<Board[]> {
    return this.httpClient.get<Board[]>(`${this.baseUrl}/boards`);
  }

  getDataForUser(id: string): Observable<Board[]> {
    // return this.httpClient.get<string[]>(`./../../../assets/data/data.json`);
    return this.httpClient.get<Board[]>(`${this.baseUrl}/boardsForUser/${id}`);
  }

  getById(id: string): Observable<Board> {
    return this.httpClient.get<Board>(`${this.baseUrl}/board/${id}`);
  }

  getBoardWithColumnsAndCards(id: string): Observable<any> {
    return Observable.forkJoin(
      this.getById(id),
      this.columnService.getForBoard(id),
      this.cardService.getAllForBoardId(id)
    );
  }

  getBoardWithColumnsAndSubcards(
    boardId: string,
    cardId: string
  ): Observable<any> {
    return Observable.forkJoin(
      this.getById(boardId),
      this.columnService.getForBoard(boardId),
      this.subcardService.getAllSubcardsForBoardIdAndCardId(boardId, cardId)
    );
  }

  edit(board: Board): Observable<Board> {
    return this.httpClient
      .put<Board>(`${this.baseUrl}/board/${board._id}`, board)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Board)
      );
  }

  add(board: Board): Observable<Board> {
    return this.httpClient.post<Board>(`${this.baseUrl}/board`, board).pipe(
      catchError(err => {
        throw err;
      }),
      map(value => value as Board)
    );
  }

  delete(id: string): Observable<Board> {
    return this.httpClient
      .delete(`${this.baseUrl}/board/${id}`)
      .pipe(map(value => value as Board));
  }
}
