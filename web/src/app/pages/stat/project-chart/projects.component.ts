import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import {
  OrdersProfitChartData,
  OrderProfitChartSummary
} from "../../../@core/data/orders-profit-chart";
import { ProfitChart } from "../../../@core/data/profit-chart";
import { ProjectChartService } from "../../../@core/data/project-chart.service";

@Component({
  selector: "ngx-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent implements OnDestroy {
  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = "week";
  // profitChartData: ProfitChart;
  profitChartData = {
    chartLabel: [],
    data: []
  } as ProfitChart;

  constructor(
    private ordersProfitChartService: OrdersProfitChartData,
    private projectChartService: ProjectChartService
  ) {
    this.ordersProfitChartService
      .getOrderProfitChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe(summary => {
        this.chartPanelSummary = summary;
      });

    // this.getProfitChartData(this.period);
    this.getProfitChartDataNew(this.period);
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getProfitChartDataNew(value);
    // this.getProfitChartData(value);
  }

  getProfitChartDataNew(period: string) {
    this.projectChartService.getProjectChartData(period).subscribe(result => {
      console.log(result);
      this.profitChartData = result;
    });
  }

  // getProfitChartData(period: string) {
  //   this.ordersProfitChartService
  //     .getProfitChartData(period)
  //     .pipe(takeWhile(() => this.alive))
  //     .subscribe(profitChartData => {
  //       this.profitChartData = profitChartData;
  //     });
  // }

  ngOnDestroy() {
    this.alive = false;
  }
}
