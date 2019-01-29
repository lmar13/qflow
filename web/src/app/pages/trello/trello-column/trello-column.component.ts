import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card, Column, Board} from '../../../@core/model';
import { WebSocketService } from '../../../@core/data/ws.service';
import { TrelloColumnService } from './trello-column.service';
import { TrelloCardService } from '../trello-card/trello-card.service';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
  selector: 'ngx-trello-column',
  templateUrl: './trello-column.component.html',
  styleUrls: ['./trello-column.component.scss'],
})
export class TrelloColumnComponent implements OnInit {
  @Input() column: Column;
  @Input() board: Board;
  @Input() cards: Card[];

  @Output() onAddCard = new EventEmitter<Card>();
  @Output() onCardUpdate = new EventEmitter<Card>();

  editingColumn = false;
  addingCard = false;
  addCardText: string;
  currentTitle: string;

  options: SortablejsOptions = {
    group: 'board',
    onUpdate: (event: any) => {
      // this.postChangesToServer(event);
      console.log('update');
      this.onCardUpdate.emit(event);
    },
    onAdd: (event: any) => {
      // this.postChangesToServer(event);
      console.log('add');
      this.onCardUpdate.emit(event);
    }
  };

  constructor(private el: ElementRef,
    private ws: WebSocketService,
    private cardService: TrelloCardService) {
  }

  ngOnInit() {
      // this.cardsForColumn(this.column._id);
  }

  cardsForColumn(columnId: string) {
    // if(this.cards && !this.cards['info']){
      this.cards = this.cards
        .filter(val => columnId === val.columnId)
    // }
  }

  postChangesToServer(event: any) {
    const columnId = event.target.dataset.columnId;
    const cardId = event.item.dataset.cardId;
    const newIndex = event.newIndex;

    this.cards = this.cards.map(val => {
      if(val._id === cardId) {
        const item = {...val, order: newIndex, columnId: columnId}
        // this.sendCardToServer(item, false);

        return item;
      }
      return val;
    }).map((val, index) => {
      if(val._id !== cardId) {
        const item = {...val, order: index};
        // this.sendCardToServer(item, true);

        return item;
      }
      return val
    });

    // this.cardsForColumn(columnId);
  }

  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  addCard() {
    let newCard = {
      title: this.addCardText,
      order: (this.cards.length),
      content: '',
      columnId: this.column._id,
      boardId: this.board._id
    } as Card;

    this.cards = [...this.cards, newCard]
    this.cardService.add(newCard)
      .subscribe(card => {
        this.onAddCard.emit(card);
        // this.ws.addCard(card.boardId, card);
      });
  }

  addCardOnEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (this.addCardText && this.addCardText.trim() !== '') {
        this.addCard();
        this.addCardText = '';
      } else {
        this.clearAddCard();
      }
    } else if (event.keyCode === 27) {
      this.clearAddCard();
    }
  }

  enableAddCard() {
    this.addingCard = true;
    let input = this.el.nativeElement
      .getElementsByClassName('add-card')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function() { input.focus(); }, 0);
  }

  addCardOnBlur() {
    if (this.addingCard) {
      if (this.addCardText && this.addCardText.trim() !== '') {
        this.addCard();
      }
    }
    this.clearAddCard();
  }

  clearAddCard() {
    this.addingCard = false;
    this.addCardText = '';
  }
}
