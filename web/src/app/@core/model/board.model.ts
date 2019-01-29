import { Card } from "./card.model";
import { AutoCompleteTag } from "./auto-complete-tag.model";

export interface Board {
	_id: string;
	title: string;
  cards: Card[];
  owner: {
    _id: string;
    email: string;
  };
  startDate: Date;
  endDate: Date;
  assignedUsers: AutoCompleteTag[];
}
