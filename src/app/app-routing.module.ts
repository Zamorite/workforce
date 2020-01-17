import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignInComponent } from "./ui/pages/sign-in/sign-in.component";
import { SignUpComponent } from "./ui/pages/sign-up/sign-up.component";
import { DashComponent } from "./ui/pages/dash/dash.component";
import { EmployeeComponent } from "./ui/components/employee/employee.component";
import { EmployerComponent } from "./ui/components/employer/employer.component";
import { EmployeesComponent } from "./ui/components/employees/employees.component";
import { EmployersComponent } from "./ui/components/employers/employers.component";
import { HomeComponent } from "./ui/pages/home/home.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { DashSummaryComponent } from "./ui/components/dash-summary/dash-summary.component";
import { RequestComponent } from "./ui/components/request/request.component";
import { RequestsComponent } from "./ui/components/requests/requests.component";
import { NewRequestComponent } from "./ui/components/new-request/new-request.component";
import { InvitesComponent } from "./ui/components/invites/invites.component";
import { AdminGuard } from "./core/guards/admin.guard";
import { EmployerGuard } from "./core/guards/employer.guard";
import { EmployeeGuard } from "./core/guards/employee.guard";
import { PostJobComponent } from './pages/post-job/post-job.component';
import { AppliedComponent } from './ui/components/applied/applied.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },
  {
    path: "auth",
    children: [
      { path: "", pathMatch: "full", redirectTo: "sign_in" },
      { path: "sign_in", pathMatch: "full", component: SignInComponent },
      { path: "sign_up", pathMatch: "full", component: SignUpComponent }
    ]
  },
  { path: "post_job", pathMatch: "full", component: PostJobComponent },
  {
    path: "dashboard",
    // pathMatch: "full",
    component: DashComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", pathMatch: "full", component: DashSummaryComponent },
      {
        path: "employee/:email",
        pathMatch: "full",
        component: EmployeeComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "employer/:email",
        pathMatch: "full",
        component: EmployerComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "employees",
        pathMatch: "full",
        component: EmployeesComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "employers",
        pathMatch: "full",
        component: EmployersComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "new_request",
        pathMatch: "full",
        component: NewRequestComponent,
        canActivate: [EmployerGuard]
      },
      {
        path: "invites",
        pathMatch: "full",
        component: InvitesComponent,
        canActivate: [EmployeeGuard]
      },
      {
        path: "applied",
        pathMatch: "full",
        component: AppliedComponent,
        canActivate: [EmployeeGuard]
      },
      { path: "requests", pathMatch: "full", component: RequestsComponent },
      { path: "request/:id", pathMatch: "full", component: RequestComponent },
      { path: "**", pathMatch: "full", redirectTo: "" }
    ]
  },
  { path: "**", pathMatch: "full", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
