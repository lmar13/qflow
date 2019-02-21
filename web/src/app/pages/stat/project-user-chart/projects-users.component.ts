import { Component, OnDestroy } from "@angular/core";
import { ProjectChartService } from "../../../@core/data/project-chart.service";
import { UserService } from "../../../@core/data/users.service";
import { ProjectChart, ProjectChartSummary, User } from "../../../@core/model";

@Component({
  selector: "ngx-projects",
  templateUrl: "./projects-users.component.html",
  styleUrls: ["./projects-users.component.scss"]
})
export class ProjectsUsersComponent implements OnDestroy {
  private alive = true;

  chartPanelSummary: ProjectChartSummary[];
  period: string = "week";
  users: User[] = null;
  selectedUsers: User[] = [];
  projectChartData = {
    chartLabel: [],
    data: []
  } as ProjectChart;

  constructor(
    private projectChartService: ProjectChartService,
    private userService: UserService
  ) {
    this.getProjectSummaryForUsers(this.selectedUsers);
    this.userService.getUsers().subscribe(users => (this.users = users));
    this.getProjectChartDataForUsers(this.period, this.selectedUsers);
  }

  setUsersAndGetChartData(value) {
    if (typeof value === "string" && this.period !== value) {
      this.period = value;
    } else if (typeof value === "object") {
      this.selectedUsers = value;
    }

    this.getProjectChartDataForUsers(this.period, this.selectedUsers);
    this.getProjectSummaryForUsers(this.selectedUsers);
  }

  getProjectSummaryForUsers(users: User[]) {
    this.projectChartService
      .getProjectSummaryForUsers(users)
      .subscribe(result => (this.chartPanelSummary = result));
  }

  getProjectChartDataForUsers(period: string, users: User[]) {
    this.projectChartService
      .getProjectChartDataForUsers(period, users)
      .subscribe(result => {
        console.log("userResult", result);
        this.projectChartData = result;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
