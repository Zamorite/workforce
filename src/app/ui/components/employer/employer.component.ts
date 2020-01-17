import { Component, OnInit } from "@angular/core";
import { User } from "src/app/core/models/user";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/core/services/data.service";

@Component({
  selector: "app-employer",
  templateUrl: "./employer.component.html",
  styleUrls: ["./employer.component.scss"]
})
export class EmployerComponent implements OnInit {
  employer: Observable<User>;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private data: DataService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const email = <string>params["email"];
      if (email != null) {
        this.employer = this.data.getUser(email);
      }
    });
  }
}
