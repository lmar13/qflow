import { ProjectsMyComponent } from "./project-my-chart/projects-my.component";
import { ProjectsUsersComponent } from "./project-user-chart/projects-users.component";
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
      },
      {
        path: "users",
        component: ProjectsUsersComponent
      },
      {
        path: "my",
        component: ProjectsMyComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatRoutingModule {}
