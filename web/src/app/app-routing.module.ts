import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "pages", loadChildren: "app/pages/pages.module#PagesModule" },
  { path: "auth", loadChildren: "app/@core/auth/auth.module#AuthModule" },
  { path: "", redirectTo: "pages", pathMatch: "full" },
  { path: "**", redirectTo: "pages" }
];

const config: ExtraOptions = {
  // useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
