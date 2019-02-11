import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "ngx-pm",
  styles: [
    `
      nb-card {
        height: calc(100vh - 210px);
        width: 100%;
      }
      :host .navigation .link {
        text-decoration: none;
      }
      :host .navigation .link .icon {
        font-size: 2rem;
      }
    `
  ],
  template: `
    <div class="row">
      <nb-card>
        <nb-card-header>
          <nav class="navigation row">
            <div class="col">
              <a href="#" (click)="back()" class="link" aria-label="Back">
                <i class="icon nb-arrow-thin-left"></i>
              </a>
            </div>
            <div
              class="col-md-8"
              style="text-align: center; padding-top: 10px;"
            >
              Project Manager
            </div>
            <div class="col">
              <!--<a
                routerLink="/"
                class="link"
                aria-label="Home"
                style="float: right;"
              >
                <i class="icon nb-home"></i>
              </a> -->
            </div>
          </nav>
        </nb-card-header>
        <nb-card-body>
          <router-outlet></router-outlet>
        </nb-card-body>
      </nb-card>
    </div>
  `
})
export class PMComponent implements OnInit, OnDestroy {
  constructor(private location: Location) {}

  ngOnInit() {}

  ngOnDestroy() {}

  back() {
    this.location.back();
    return false;
  }
}
