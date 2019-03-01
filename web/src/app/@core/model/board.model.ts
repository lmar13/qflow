import { Card } from "./card.model";

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
  planDate: Date,
  dueDate: Date,
  assignedUsers: [{
    _id: string;
    email: string;
  }],
  assignedSkills: [{
    _id: string;
    name: string;
    userId: string[];
  }]
}
