import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ngx-admin",
  styles: ["nb-card {height: calc(100vh - 210px);}"],
  template: `
    <div class="row">
      <nb-card style="width: 100%">
        <nb-card-header>Admin</nb-card-header>
        <nb-card-body>
          <router-outlet></router-outlet>
        </nb-card-body>
      </nb-card>
    </div>
  `
})
export class AdminComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
