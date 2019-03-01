import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SortablejsOptions } from "angular-sortablejs";
import { Board, Column, Card, User, CardFilter } from "../../../@core/model";
import { WebSocketService } from "../../../@core/data/ws.service";
import { BoardService } from "../../../@core/data/board.service";
// import { CardService } from "../../../@core/data/card.service";
import { UserService } from "../../../@core/data/users.service";
import { SubcardService } from "../../../@core/data/subcard.service";

@Component({
  selector: "ngx-subboard",
  templateUrl: "./subboard.component.html",
  styleUrls: ["./subboard.component.scss"]
})
export class SubboardComponent implements OnInit, OnDestroy {
  @Input() card: Card;

  board = {} as Board;
  columns = [] as Column[];
  subcards = [] as Card[];
  notFilteredSubcards = [] as Card[];
  users = [] as User[];
  moveCardData = null;
  selectedCard: string;

  options: SortablejsOptions = {
    group: "subboard",
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
    private subcardService: SubcardService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initConfig();
    this.initFetchData();
  }

  ngOnDestroy() {
    // console.log(`leaving board ${this.board._id}`);
    // this.socketService.leave(this.board._id);
  }

  initConfig() {
    this.route.params.subscribe(param => {
      this.board._id = param.boardId;
    });

    this.socketService.onUpdateSubcard().subscribe(cards => {
      this.fetchSubboardData();
    });

    this.socketService.onAddCard().subscribe(card => {
      this.fetchSubboardData();
    });

    this.socketService.onEditCard().subscribe(card => {
      this.fetchSubboardData();
    });

    this.socketService.onDeleteCard().subscribe(card => {
      this.fetchSubboardData();
    });
  }

  initFetchData() {
    this.fetchSubboardData();
    this.userService.getUsers().subscribe(users => (this.users = users));
  }

  fetchSubboardData() {
    this.boardService
      .getBoardWithColumnsAndSubcards(this.board._id, this.card._id)
      .subscribe(data => {
        [this.board, this.columns, this.subcards] = data;
        this.notFilteredSubcards = this.subcards;
        this.refreshDataInColumn();
      });
  }

  refreshDataInColumn() {
    this.columns = this.columns.map(val => {
      return {
        ...val,
        cards: !this.subcards["info"]
          ? this.subcards.filter(card => val._id === card.columnId)
          : []
      };
    });
  }

  addCard(card: Card) {
    this.subcardService.add(card).subscribe(card => {
      this.fetchSubboardData();
      this.socketService.addCard(this.board._id, card);
    });
  }

  editCard(card: Card) {
    this.subcardService.edit(card).subscribe(card => {
      this.fetchSubboardData();
      this.socketService.editCard(this.board._id, card);
    });
  }

  updateCardPosition(event) {
    const cardId = event.item.dataset.cardId;
    const nextColumnId = event.to.dataset.columnId;
    const newIndex = event.newIndex;

    this.subcards = [
      ...this.subcards.filter(card => card._id !== cardId),
      {
        ...this.subcards.filter(card => card._id === cardId)[0],
        order: newIndex,
        columnId: nextColumnId
      }
    ];

    this.subcardService
      .editAll(this.board._id, this.subcards)
      .subscribe(cards => {
        this.fetchSubboardData();
        this.socketService.updateSubcard(this.board._id, cards);
      });
  }

  deleteCard() {
    if (this.selectedCard) {
      let card = this.subcards.filter(
        card => card._id === this.selectedCard
      )[0];
      this.subcardService.delete(card._id).subscribe(res => {
        this.fetchSubboardData();
        this.socketService.deleteCard(this.board._id, card);
      });
    } else {
      alert("You need to choose card first");
    }
  }

  selectCard(cardId) {
    this.selectedCard = this.selectedCard !== cardId ? cardId : null;
  }

  applyFilters(filter: CardFilter) {
    this.subcards = this.notFilteredSubcards;

    if (filter.userFilter.length <= 0) {
      this.refreshDataInColumn();
      return;
    }

    this.subcards = this.subcards.filter(card =>
      card.assignedUsers.some(user =>
        filter.userFilter.some(val => val === user._id)
      )
    );
    this.refreshDataInColumn();
  }
}
