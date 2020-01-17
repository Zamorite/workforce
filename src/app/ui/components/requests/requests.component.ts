import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "src/app/core/services/data.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"]
})
export class RequestsComponent implements OnInit {
  requests: Observable<any>;

  constructor(
    private data: DataService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(u => {
      if (this.auth.isAdmin(u)) {
        this.requests = this.data.getRequests();
        this.data.clearRequests();
      } else {
        this.requests = this.data.getMyRequests(u.email);
      }
    });

  }
}
