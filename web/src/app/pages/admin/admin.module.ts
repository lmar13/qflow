import { AdminComponent } from './admin.component';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TagInputModule } from 'ngx-chips';
import { ThemeModule } from "../../@theme/theme.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { UserListComponent } from './user-list/user-list.component';


const ADMIN_COMPONENTS = [
  AdminComponent,
  UserListComponent,
];

@NgModule({
  imports: [
    AdminRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...ADMIN_COMPONENTS,
    UserListComponent
  ],
  providers: [
  ]
})
export class AdminModule {
}
