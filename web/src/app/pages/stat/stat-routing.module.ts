import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectsComponent } from "./project-chart/projects.component";
import { StatComponent } from "./stat.component";

const routes: Routes = [
  {
    path: "",
    component: StatComponent,
    children: [
      {
        path: "projects",
        component: ProjectsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatRoutingModule {}
