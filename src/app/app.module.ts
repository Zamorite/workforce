import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { SignInComponent } from "./ui/pages/sign-in/sign-in.component";
import { SignUpComponent } from "./ui/pages/sign-up/sign-up.component";
import { DashComponent } from "./ui/pages/dash/dash.component";
import { EmployerComponent } from "./ui/components/employer/employer.component";
import { EmployeeComponent } from "./ui/components/employee/employee.component";
import { EmployersComponent } from "./ui/components/employers/employers.component";
import { EmployeesComponent } from "./ui/components/employees/employees.component";
import { HomeComponent } from "./ui/pages/home/home.component";
import { HeaderComponent } from "./ui/components/header/header.component";
import { FooterComponent } from "./ui/components/footer/footer.component";
import { AngularFireModule } from "@angular/fire";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "./core/services/auth.service";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { RequestComponent } from "./ui/components/request/request.component";
import { RequestsComponent } from "./ui/components/requests/requests.component";
import { NewRequestComponent } from "./ui/components/new-request/new-request.component";
import { InvitesComponent } from "./ui/components/invites/invites.component";
import { EDashComponent } from "./ui/components/dash/e-dash/e-dash.component";
import { RDashComponent } from "./ui/components/dash/r-dash/r-dash.component";
import { ADashComponent } from "./ui/components/dash/a-dash/a-dash.component";
import { DashSummaryComponent } from "./ui/components/dash-summary/dash-summary.component";
import { PostJobComponent } from "./pages/post-job/post-job.component";
import { AppliedComponent } from "./ui/components/applied/applied.component";
import { MomentModule } from "ngx-moment";

const fireConfig = environment.fireConfig;

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashComponent,
    EmployerComponent,
    EmployeeComponent,
    EmployersComponent,
    EmployeesComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RequestComponent,
    RequestsComponent,
    NewRequestComponent,
    InvitesComponent,
    EDashComponent,
    RDashComponent,
    ADashComponent,
    DashSummaryComponent,
    PostJobComponent,
    AppliedComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(fireConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MomentModule.forRoot(),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
