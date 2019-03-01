import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDatepickerModule, NbDialogModule, NbTabsetModule } from "@nebular/theme";
import { NgSelectModule } from "@ng-select/ng-select";
// import { WebSocketService } from "../../@core/data/ws.service";
import { SortablejsModule } from "angular-sortablejs";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { TagInputModule } from "ngx-chips";
import { OrderBy, Where } from "../../@core/pipes";
import { ThemeModule } from "../../@theme/theme.module";
import { AddBoardComponent } from "./boards/add-board/add-board.component";
import { BoardComponent } from "./boards/board/board.component";
import { EditBoardComponent } from "./boards/edit-board/edit-board.component";
import { AddCardComponent } from "./cards/add-card/add-card.component";
import { CardFilterComponent } from "./cards/card-filter/card-filter.component";
import { CardComponent } from "./cards/card/card.component";
import { EditCardComponent } from "./cards/edit-card/edit-card.component";
import { ColumnComponent } from "./columns/column/column.component";
import { ListComponent } from "./list/list.component";
import { PMRoutingModule } from "./pm-routing.module";
import { PMComponent } from "./pm.component";
import { SubboardComponent } from "./subboard/subboard.component";

const PM_COMPONENTS = [
  PMComponent,
  ListComponent,
  BoardComponent,
  CardComponent,
  ColumnComponent,
  AddCardComponent,
  EditCardComponent,
  AddBoardComponent,
  EditBoardComponent,
  SubboardComponent,
  CardFilterComponent,
  OrderBy,
  Where
];

@NgModule({
  imports: [
    PMRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
    // NbActionsModule,
    SortablejsModule,
    DragDropModule,
    NbDialogModule.forChild(),
    NbDatepickerModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NbTabsetModule,
  ],
  declarations: [...PM_COMPONENTS],
  providers: [
    // SmartTableService,
    // WebSocketService,
  ]
})
export class PMModule {}
