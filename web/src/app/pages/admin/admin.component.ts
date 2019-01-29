import { StateService } from '../../@core/data/state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

const createMenuElements = () => {
  const authObj = localStorage.getItem('authUser');
  const menu = {
    title: 'All projects',
    link: '/pages/trello',
  };
  if(authObj) {
    return [menu,
      {
        title: 'All projects',
        link: `/pages/trello/${JSON.parse(authObj)['empId']}`,
      }
    ]
  }
  return [menu];
}

export const subMenu: NbMenuItem[] = createMenuElements();
// export const subMenu: NbMenuItem[] = [
//   {
//     title: 'All projects',
//     link: '/pages/trello',
//   },
//   {
//     title: 'My projects',
//     link: `/pages/trello/`,  // change to correct value
//   },
// ];

@Component({
  selector: 'ngx-trello',
  styles: ['nb-card {height: calc(100vh - 210px);}'],
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

  constructor() {

  }

  ngOnInit() {

  }
}
