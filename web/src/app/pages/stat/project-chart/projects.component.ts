import { Component, OnDestroy } from "@angular/core";
import { ProjectChartService } from "../../../@core/data/project-chart.service";
import { ProjectChart, ProjectChartSummary } from "../../../@core/model";

@Component({
  selector: "ngx-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent implements OnDestroy {
  private alive = true;

  chartPanelSummary: ProjectChartSummary[];
  period: string = "week";
  projectChartData = {
    chartLabel: [],
    data: []
  } as ProjectChart;

  constructor(private projectChartService: ProjectChartService) {
    this.projectChartService.getProjectSummary().subscribe(result => {
      this.chartPanelSummary = result;
    });

    this.getProjectChartData(this.period);
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getProjectChartData(value);
  }

  getProjectChartData(period: string) {
    this.projectChartService.getProjectChartData(period).subscribe(result => {
      console.log(result);
      this.projectChartData = result;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
