import { Card } from './card.model'

export interface Column {
  _id: string;
  title: string;
  cards: Card[];
}
