import { Routes, RouterModule } from "@angular/router";
import { TrelloComponent } from "./trello.component";
import { TrelloListComponent } from "./trello-list/trello-list.component";
import { TrelloBoardComponent } from "./trello-board/trello-board.component";
import { NgModule } from "@angular/core";

const routes: Routes = [{
  path: '',
  component: TrelloComponent,
  children: [
    {
      path: '',
      component: TrelloListComponent,
    },
    {
      path: 'board/:boardId',
      component: TrelloBoardComponent,
    },
    {
      path: ':userId',
      component: TrelloListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrelloRoutingModule {
}
