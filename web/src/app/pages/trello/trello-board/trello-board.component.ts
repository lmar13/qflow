import { UserService } from './../../../@core/data/users.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../../@core/data/ws.service';
import { Board, Card, Column, User } from '../../../@core/model';
import { TrelloCardService } from '../trello-card/trello-card.service';
import { TrelloBoardService } from './trello-board.service';

@Component({
  selector: 'ngx-trello-board',
  templateUrl: './trello-board.component.html',
  styleUrls: ['./trello-board.component.scss']
})
export class TrelloBoardComponent implements OnInit, OnDestroy {

  board = {} as Board;
  columns = [] as Column[];
  cards = [] as Card[];
  users = [] as User[];
  moveCardData = null;
  subscriptions: Subscription[] = [];

  options: SortablejsOptions = {
    group: 'board',
    onUpdate: (event: any) => {
      this.updateCardPosition(event);
    },
    onAdd: (event: any) => {
      this.updateCardPosition(event);
    }
  };

  constructor(
    private socketService: WebSocketService,
    private boardService: TrelloBoardService,
    private cardService: TrelloCardService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initConfig();
    this.initFetchData();
  }

  ngOnDestroy(){
    console.log(`leaving board ${this.board._id}`);
    this.socketService.leave(this.board._id);
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  initConfig() {
    this.route.params.subscribe(param => {
      this.board._id = param.boardId;
      this.socketService.join(param.boardId);
      this.socketService.onRecconection().subscribe(() => {
        this.socketService.join(param.boardId);
      });
    });

    this.socketService.onUpdateCard().subscribe(cards => {
      this.cards = cards;
      this.columns = this.refreshDataInColumn();
    });

    this.socketService.onAddCard().subscribe(card => {
      this.cards.push(card);
      this.columns = this.refreshDataInColumn();
    });

    this.socketService.onEditCard().subscribe(card => {
      this.cards = this.cards.map(val => val._id === card._id ? card : val);
      this.columns = this.refreshDataInColumn();
    });

    this.socketService.onDeleteCard().subscribe(card => {
      this.cards = this.cards.filter(val => val._id !== card._id);
      this.columns = this.refreshDataInColumn();
    });

    this.subscriptions.push(this.cardService.editCardState.subscribe(card => this.editCard(card)));
  }

  initFetchData() {
    this.boardService.getBoardWithColumnsAndCards(this.board._id)
      .subscribe(data => {
        [this.board, this.columns, this.cards] = data
        this.columns = this.refreshDataInColumn();
      });

    this.userService.getUsers().subscribe(users => this.users = users);
  }

  refreshDataInColumn() {
    return this.columns.map(val => {
      return {
        ...val,
        cards: !this.cards['info'] ? this.cards.filter(card => val._id === card.columnId) : []
      }
    });
  }

  moveCard(data) {
    this.moveCardData = data;
  }

  addCard(card: Card) {
    this.cardService.add(card)
      .subscribe(card => {
        this.cards.push(card);
        this.columns = this.refreshDataInColumn();
        this.socketService.addCard(this.board._id, card);
      });
  }

  editCard(card: Card) {
    this.cardService.edit(card)
      .subscribe(card => {
        this.cards = this.cards.map(val => val._id === card._id ? card : val);
        this.columns = this.refreshDataInColumn();
        this.socketService.editCard(this.board._id, card);
      });
  }

  updateCardPosition(event) {
    const actionType = event.type;
    const cardId = event.item.dataset.cardId;

    const newColumnId = event.target.dataset.columnId;
    const newContainerData = this.moveCardData
      .map((val, index) => ({...val, order: index, columnId: newColumnId}));

    const prevColumnId = event.from.dataset.columnId;
    const prevContainer = this.columns.filter(val => val._id === prevColumnId)[0];
    let prevContainerData = prevContainer['cards'];

    let editCards = [];
    if(actionType === 'add') {
      prevContainerData = prevContainerData
        .filter(val => val._id !== cardId)
        .map((val, index) => ({...val, order: index}));
      editCards = [
        ...this.cards.filter(val => (
            val.columnId !== newColumnId &&
            val.columnId !== prevColumnId
        )),
        ...prevContainerData,
        ...newContainerData
      ];
    } else {
      editCards = [
        ...this.cards.filter(val => (
            val.columnId !== newColumnId
        )),
        ...newContainerData
      ];
    }

    this.cardService.editAll(this.board._id, editCards)
      .subscribe(cards => {
        this.cards = cards;
        this.socketService.updateCard(this.board._id, cards);
      });
  }

  deleteCard(card: Card) {
    this.cardService.delete(card._id).subscribe(res => {
      this.cards = this.cards.filter(val => val._id !== card._id);
      this.columns = this.refreshDataInColumn();
      this.socketService.deleteCard(this.board._id, card);
    });
  }
}
