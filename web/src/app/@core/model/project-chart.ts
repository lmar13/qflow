import { Observable } from "rxjs/Observable";
export interface ProjectChart {
  chartLabel: string[];
  data: number[][];
}

export interface ProjectChartSummary {
  title: string;
  value: number;
}
