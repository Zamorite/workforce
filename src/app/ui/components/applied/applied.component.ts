import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { DataService } from "src/app/core/services/data.service";
import { NotifService } from "src/app/core/services/notif.service";

@Component({
  selector: "app-applied",
  templateUrl: "./applied.component.html",
  styleUrls: ["./applied.component.scss"],
})
export class AppliedComponent implements OnInit {
  invites: Observable<any>;
  email: string;

  durTypes = ["day", "week", "month", "year", "decade"];

  constructor(
    public auth: AuthService,
    private data: DataService,
    private notif: NotifService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((u) => {
      if (u) {
        this.email = u.email;
        this.invites = this.data.getMyApplications(u.email);
        // this.invites = this.data.joinOwners(partInvites);
      }
    });
  }
}
