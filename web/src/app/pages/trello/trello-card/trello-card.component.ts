import { User } from './../../../@core/model/user.model';
import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, NgZone} from '@angular/core';
import { Card, Column } from '../../../@core/model';
import { WebSocketService } from '../../../@core/data/ws.service';
import { TrelloCardService } from './trello-card.service';


@Component({
  selector: 'ngx-trello-card',
  templateUrl: './trello-card.component.html',
  styleUrls: ['./trello-card.component.scss'],
})
export class TrelloCardComponent implements OnInit {
  @Input() card: Card;
  @Input() columns: Column[];
  @Input() users: User[];

  @Output() cardEdit = new EventEmitter<Card>();
  @Output() onDeleteCard = new EventEmitter<Card>();

  editingCard = false;
  currentTitle: string;
  zone: NgZone;

  constructor(private el: ElementRef,
    private _ref: ChangeDetectorRef,
    private ws: WebSocketService,
    private _cardService: TrelloCardService) {
    // this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit() {
  }
  //TODO: check lifecycle
  private ngOnDestroy() {
    //this._ws.onCardUpdate.unsubscribe();
  }

  deleteCard() {
    this.onDeleteCard.emit(this.card);
  }

}
