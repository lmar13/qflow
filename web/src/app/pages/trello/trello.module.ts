import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { NbActionsModule, NbDialogModule, NbDatepickerModule } from "@nebular/theme";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { OrderBy, Where } from "../../@core/pipes";
import { ThemeModule } from "../../@theme/theme.module";
import { TrelloBoardComponent } from "./trello-board/trello-board.component";
import { TrelloCardComponent } from "./trello-card/trello-card.component";
import { TrelloColumnComponent } from "./trello-column/trello-column.component";
import { TrelloListComponent } from "./trello-list/trello-list.component";
import { TrelloRoutingModule } from "./trello-routing.module";
import { TrelloComponent } from "./trello.component";
// import { WebSocketService } from "../../@core/data/ws.service";
import { SortablejsModule } from "angular-sortablejs";
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AddCardComponent } from './add-card/add-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { EditCardComponent } from './edit-card/edit-card.component';
import { EditBoardComponent } from './edit-board/edit-board.component';
import { AddBoardComponent } from './add-board/add-board.component';


const TRELLO_COMPONENTS = [
  TrelloComponent,
  TrelloListComponent,
  TrelloBoardComponent,
  TrelloCardComponent,
  TrelloColumnComponent,
  AddCardComponent,
  EditCardComponent,
  EditBoardComponent,
  OrderBy,
  Where,
];

@NgModule({
  imports: [
    TrelloRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
    // NbActionsModule,
    SortablejsModule,
    DragDropModule,
    NbDialogModule.forChild(),
    NbDatepickerModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...TRELLO_COMPONENTS,
    AddBoardComponent,

  ],
  providers: [
    // SmartTableService,
    // WebSocketService,
  ]
})
export class TrelloModule {
}
