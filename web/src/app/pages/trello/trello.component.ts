import { StateService } from './../../@core/data/state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

export const subMenu: NbMenuItem[] = [
  {
    title: 'All projects',
    link: '/pages/trello',
  },
  {
    title: 'My projects',
    link: '/pages/trello/user',
  },
];

@Component({
  selector: 'ngx-trello',
  styles: ['nb-card {height: calc(100vh - 210px);}'],
  template: `
    <div class="row">
      <nb-card style="width: 100%">
        <nb-card-header>Trello</nb-card-header>
        <nb-card-body>
          <router-outlet></router-outlet>
        </nb-card-body>
      </nb-card>
    </div>
  `
})
export class TrelloComponent implements OnInit, OnDestroy {
  layouts = []

  constructor(private stateService: StateService) {
    this.stateService.getLayoutStates()
      .subscribe((layouts: any[]) => {
        this.layouts = layouts
        this.layoutSelect({
          name: 'Two Column',
          icon: 'nb-layout-two-column',
          id: 'two-column',
        })
      });
  }

  ngOnInit() {

  }

  layoutSelect(layout: any): boolean {
    this.layouts = this.layouts.map((l: any) => {
      l.selected = false;
      return l;
    });

    layout.selected = true;
    this.stateService.setLayoutState(layout);
    return false;
  }

  ngOnDestroy() {
    this.layoutSelect({
      name: 'One Column',
      icon: 'nb-layout-default',
      id: 'one-column',
    })
  }
}
