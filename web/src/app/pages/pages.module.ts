import { NgSelectModule } from '@ng-select/ng-select';
import { NbAuthModule } from '@nebular/auth';
import { NgModule } from "@angular/core";
import { ThemeModule } from "../@theme/theme.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { TaskRegisterComponent } from "./task-register/task-register.component";
import { UserProfileComponent } from './user-profile/user-profile.component';

const PAGES_COMPONENTS = [PagesComponent, TaskRegisterComponent];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,
    NbAuthModule,
    NgSelectModule,
  ],
  declarations: [...PAGES_COMPONENTS, UserProfileComponent]
})
export class PagesModule {}
