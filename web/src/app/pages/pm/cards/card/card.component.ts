import { Component, Input, OnInit } from "@angular/core";
import { Card, Column, User } from "../../../../@core/model";

@Component({
  selector: "ngx-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"]
})
export class CardComponent implements OnInit {
  @Input() card: Card;
  @Input() columns: Column[];
  @Input() users: User[];
  @Input() selected: boolean;

  constructor() {}

  ngOnInit() {}
}
