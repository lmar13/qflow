import { Component, Input, OnInit } from '@angular/core';
import { Card, Column } from '../../../@core/model';
import { User } from './../../../@core/model/user.model';


@Component({
  selector: 'ngx-trello-card',
  templateUrl: './trello-card.component.html',
  styleUrls: ['./trello-card.component.scss'],
})
export class TrelloCardComponent implements OnInit {
  @Input() card: Card;
  @Input() columns: Column[];
  @Input() users: User[];
  @Input() selected: boolean;

  constructor() { }

  ngOnInit() {
  }

}
