import { AutoCompleteTag } from "./auto-complete-tag.model";

export interface Card {
  _id: string;
  title: string;
  content: string;
  columnId: string;
  boardId: string;
  cardId: string;
  order: number;
  owner: {
    _id: string;
    email: string;
  };
  assignedUsers: AutoCompleteTag[];
  startDate: Date;
  endDate: Date;
}
