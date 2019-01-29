import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserIsAuthorizeGuard } from './../@core/auth/shared/user-is-authorize.guard';
import { UserIsSignedInGuard } from './../@core/auth/shared/user-is-signed-in.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'trello',
      loadChildren: './trello/trello.module#TrelloModule',
      canLoad: [UserIsSignedInGuard]
    },
    {
      path: 'admin',
      loadChildren: 'app/pages/admin/admin.module#AdminModule',
      canLoad: [UserIsAuthorizeGuard]
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
