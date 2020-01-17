import { Component, OnInit } from "@angular/core";
import { User } from "src/app/core/models/user";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/core/services/data.service";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.scss"]
})
export class EmployeeComponent implements OnInit {
  employee: Observable<User>;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private data: DataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const email = <string>params["email"];
      if (email != null) {
        this.employee = this.data.getUser(email);
      }
    });
  }
}
