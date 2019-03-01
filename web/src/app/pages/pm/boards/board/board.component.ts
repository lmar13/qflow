import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SortablejsOptions } from "angular-sortablejs";
import { WebSocketService } from "../../../../@core/data/ws.service";
import { BoardService } from "../../../../@core/data/board.service";
import { Board, Column, Card, User, CardFilter } from "../../../../@core/model";
import { CardService } from "../../../../@core/data/card.service";
import { UserService } from "../../../../@core/data/users.service";
import { NbSidebarService, NbMenuItem } from "@nebular/theme";

@Component({
  selector: "ngx-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit, OnDestroy {
  board = {} as Board;
  columns = [] as Column[];
  cards = [] as Card[];
  notFilteredCards = [] as Card[];
  users = [] as User[];
  selectedCard: string;

  options: SortablejsOptions = {
    group: "board",
    onUpdate: (event: any) => {
      this.updateCardPosition(event);
    },
    onAdd: (event: any) => {
      this.updateCardPosition(event);
    }
  };

  constructor(
    private socketService: WebSocketService,
    private boardService: BoardService,
    private cardService: CardService,
    private userService: UserService,
    private route: ActivatedRoute,
    private sidebarService: NbSidebarService
  ) {}

  ngOnInit() {
    this.initConfig();
    this.initFetchData();
  }

  ngOnDestroy() {
    console.log(`leaving board ${this.board._id}`);
    this.socketService.leave(this.board._id);
  }

  initConfig() {
    this.route.params.subscribe(param => {
      this.board._id = param.boardId;
      this.socketService.join(param.boardId);
      this.socketService.onReconnection().subscribe(() => {
        this.socketService.join(param.boardId);
      });
    });

    this.socketService.onUpdateCard().subscribe(() => {
      this.fetchBoardData();
    });

    this.socketService.onAddCard().subscribe(() => {
      this.fetchBoardData();
    });

    this.socketService.onEditCard().subscribe(() => {
      this.fetchBoardData();
    });

    this.socketService.onDeleteCard().subscribe(() => {
      this.fetchBoardData();
    });
  }

  initFetchData() {
    this.fetchBoardData();
    this.userService.getUsers().subscribe(users => (this.users = users));
  }

  fetchBoardData() {
    this.boardService
      .getBoardWithColumnsAndCards(this.board._id)
      .subscribe(data => {
        [this.board, this.columns, this.cards] = data;
        this.notFilteredCards = this.cards;
        this.refreshDataInColumn();
      });
  }

  refreshDataInColumn() {
    this.columns = this.columns.map(val => {
      return {
        ...val,
        cards: !this.cards["info"]
          ? this.cards.filter(card => val._id === card.columnId)
          : []
      };
    });
  }

  addCard(card: Card) {
    this.cardService.add(card).subscribe(card => {
      this.fetchBoardData();
      this.socketService.addCard(this.board._id, card);
    });
  }

  editCard(card: Card) {
    this.cardService.edit(card).subscribe(card => {
      this.fetchBoardData();
      this.socketService.editCard(this.board._id, card);
    });
  }

  updateCardPosition(event) {
    const cardId = event.item.dataset.cardId;
    const nextColumnId = event.to.dataset.columnId;
    const newIndex = event.newIndex;

    this.cards = [
      ...this.cards.filter(card => card._id !== cardId),
      {
        ...this.cards.filter(card => card._id === cardId)[0],
        order: newIndex,
        columnId: nextColumnId
      }
    ];

    this.cardService.editAll(this.board._id, this.cards).subscribe(cards => {
      this.fetchBoardData();
      this.socketService.updateCard(this.board._id, cards);
    });
  }

  deleteCard() {
    if (this.selectedCard) {
      let card = this.cards.filter(card => card._id === this.selectedCard)[0];
      this.cardService.delete(card._id).subscribe(res => {
        this.fetchBoardData();
        this.socketService.deleteCard(this.board._id, card);
      });
    } else {
      alert("You need to choose card first");
    }
  }

  selectCard(cardId) {
    this.selectedCard = this.selectedCard !== cardId ? cardId : null;
  }

  toggleFiltersSidebar(): boolean {
    this.sidebarService.toggle(false, "filters-sidebar");
    return false;
  }

  applyFilters(filter: CardFilter) {
    this.cards = this.notFilteredCards;

    if (filter.userFilter.length <= 0) {
      this.refreshDataInColumn();
      return;
    }

    this.cards = this.cards.filter(card =>
      card.assignedUsers.some(user =>
        filter.userFilter.some(val => val === user._id)
      )
    );
    this.refreshDataInColumn();
  }
}
