import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { PMComponent } from "./pm.component";
import { BoardComponent } from "./boards/board/board.component";
import { ListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    component: PMComponent,
    children: [
      {
        path: "",
        component: ListComponent
      },
      {
        path: "board/:boardId",
        component: BoardComponent
      },
      {
        path: ":userId",
        component: ListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PMRoutingModule {}
