import { ProjectsMyComponent } from "./project-my-chart/projects-my.component";
import { ProjectsUsersComponent } from "./project-user-chart/projects-users.component";
import { ChartPanelSummaryComponent } from "./chart-panel-summary/chart-panel-summary.component";
import { ChartPanelHeaderComponent } from "./chart-panel-header/chart-panel-header.component";
import { LegendChartComponent } from "./legend-chart/legend-chart.component";
import { NgModule } from "@angular/core";
import { StatRoutingModule } from "./stat-routing.module";
import { StatComponent } from "./stat.component";
import { ThemeModule } from "../../@theme/theme.module";
import { ProjectsComponent } from "./project-chart/projects.component";
import { ProjectChartComponent } from "./charts/project-chart.component";
import { ChartModule } from "angular2-chartjs";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxChartsModule } from "@swimlane/ngx-charts";

const STAT_COMPONENTS = [
  StatComponent,
  ProjectsComponent,
  ProjectsUsersComponent,
  ProjectsMyComponent,
  ProjectChartComponent,
  LegendChartComponent,
  ChartPanelHeaderComponent,
  ChartPanelSummaryComponent
];

@NgModule({
  imports: [
    StatRoutingModule,
    ThemeModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule
  ],
  declarations: [...STAT_COMPONENTS]
})
export class StatModule {}
