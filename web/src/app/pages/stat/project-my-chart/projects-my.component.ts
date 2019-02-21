import { AuthService } from "./../../../@core/auth/shared/auth.service";
import { Component, OnDestroy } from "@angular/core";
import { ProjectChartService } from "../../../@core/data/project-chart.service";
import { UserService } from "../../../@core/data/users.service";
import { ProjectChart, ProjectChartSummary, User } from "../../../@core/model";

@Component({
  selector: "ngx-projects",
  templateUrl: "./projects-my.component.html",
  styleUrls: ["./projects-my.component.scss"]
})
export class ProjectsMyComponent implements OnDestroy {
  private alive = true;

  chartPanelSummary: ProjectChartSummary[];
  period: string = "week";
  selectedUsers: User[] = [];
  projectChartData = {
    chartLabel: [],
    data: []
  } as ProjectChart;

  constructor(
    private projectChartService: ProjectChartService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.selectedUsers.push(this.authService.decToken);

    this.getProjectSummaryForUsers(this.selectedUsers);
    this.getProjectChartDataForUsers(this.period, this.selectedUsers);
  }

  setUsersAndGetChartData(value) {
    if (typeof value === "string" && this.period !== value) {
      this.period = value;
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
