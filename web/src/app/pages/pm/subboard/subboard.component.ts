import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SortablejsOptions } from "angular-sortablejs";
import { Board, Column, Card, User } from "../../../@core/model";
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
    // private cardService: CardService,
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
      // this.socketService.join(param.boardId);
      // this.socketService.onReconnection().subscribe(() => {
      //   this.socketService.join(param.boardId);
      // });
    });

    this.socketService.onUpdateCard().subscribe(cards => {
      this.subcards = cards;
      this.columns = this.refreshDataInColumn();
    });

    this.socketService.onAddCard().subscribe(card => {
      this.subcards.push(card);
      this.columns = this.refreshDataInColumn();
    });

    this.socketService.onEditCard().subscribe(card => {
      this.subcards = this.subcards.map(val =>
        val._id === card._id ? card : val
      );
      this.columns = this.refreshDataInColumn();
    });

    this.socketService.onDeleteCard().subscribe(card => {
      this.subcards = this.subcards.filter(val => val._id !== card._id);
      this.columns = this.refreshDataInColumn();
    });
  }

  initFetchData() {
    this.boardService
      .getBoardWithColumnsAndSubcards(this.board._id, this.card._id)
      .subscribe(data => {
        [this.board, this.columns, this.subcards] = data;
        this.columns = this.refreshDataInColumn();
      });

    this.userService.getUsers().subscribe(users => (this.users = users));
  }

  refreshDataInColumn() {
    return this.columns.map(val => {
      return {
        ...val,
        cards: !this.subcards["info"]
          ? this.subcards.filter(card => val._id === card.columnId)
          : []
      };
    });
  }

  moveCard(data) {
    this.moveCardData = data;
  }

  addCard(card: Card) {
    this.subcardService.add(card).subscribe(card => {
      this.subcards.push(card);
      this.columns = this.refreshDataInColumn();
      this.socketService.addCard(this.board._id, card);
    });
  }

  editCard(card: Card) {
    this.subcardService.edit(card).subscribe(card => {
      this.subcards = this.subcards.map(val =>
        val._id === card._id ? card : val
      );
      this.columns = this.refreshDataInColumn();
      this.socketService.editCard(this.board._id, card);
    });
  }

  updateCardPosition(event) {
    console.log(event);
    console.log(this.moveCardData);

    const actionType = event.type;
    const cardId = event.item.dataset.cardId;

    const newColumnId = event.target.dataset.columnId;
    const newContainerData = this.moveCardData.map((val, index) => ({
      ...val,
      order: index,
      columnId: newColumnId
    }));

    const prevColumnId = event.from.dataset.columnId;
    const prevContainer = this.columns.filter(
      val => val._id === prevColumnId
    )[0];
    let prevContainerData = prevContainer["cards"];

    let editCards = [];
    if (actionType === "add") {
      prevContainerData = prevContainerData
        .filter(val => val._id !== cardId)
        .map((val, index) => ({ ...val, order: index }));
      editCards = [
        ...this.subcards.filter(
          val => val.columnId !== newColumnId && val.columnId !== prevColumnId
        ),
        ...prevContainerData,
        ...newContainerData
      ];
    } else {
      editCards = [
        ...this.subcards.filter(val => val.columnId !== newColumnId),
        ...newContainerData
      ];
    }

    this.subcardService.editAll(this.board._id, editCards).subscribe(cards => {
      this.subcards = cards;
      this.socketService.updateCard(this.board._id, cards);
    });
  }

  deleteCard() {
    if (this.selectedCard) {
      let card = this.subcards.filter(
        card => card._id === this.selectedCard
      )[0];
      this.subcardService.delete(card._id).subscribe(res => {
        this.subcards = this.subcards.filter(val => val._id !== card._id);
        this.columns = this.refreshDataInColumn();
        this.socketService.deleteCard(this.board._id, card);
      });
    } else {
      alert("You need to choose card first");
    }
  }

  selectCard(cardId) {
    this.selectedCard = this.selectedCard !== cardId ? cardId : null;
  }
}
