import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ngx-stat",
  template: `
    <nb-card>
      <nb-card-header>
        Statistics
      </nb-card-header>
      <nb-card-body>
        <router-outlet></router-outlet>
      </nb-card-body>
    </nb-card>
  `
})
export class StatComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
