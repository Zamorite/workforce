import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { Job } from 'src/app/core/models/job.model';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  request: Observable<any>;
  confirmed: Observable<any>;

  matchedEmployees: Observable<User[]>;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private data: DataService,
    private notif: NotifService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = <string>params["id"];
      if (id != null) {
        this.request = this.data.getRequest(id);

        this.request.subscribe(r => {
          this.matchedEmployees = this.data.getUserBySector(r.sector);
        });

        this.auth.user$.subscribe(
          u => (this.confirmed = this.data.getConfirmed(id))
        );
      }
    });
  }

  sendInvite(req: Job, user: User) {
    console.log("sending invite...");

    return this.data
      .addInvite(req, user.email)
      .then(() =>
        this.notif.success(`An invitation has been sent to ${user.fname}.`)
      );
  }

  removeApplicant(req: Job, user: User) {
    console.log("removing applicant...");

    return this.data
      .removeApplicant(req, user.email)
      .then(() =>
        this.notif.success(`${user.fname}'s application has been removed.`)
      );
  }

  deliverApplicants(reqId: string, ownerID: string, no: number) {
    console.log("delivering applicants...");

    return this.data
      .deliverApplicants(reqId, ownerID, no)
      .then(() =>
        this.notif.success(
          `${no} applicant${no > 1 ? "s have" : ' has'} been delivered.`
        )
      );
  }

  cantSubmit() {
    this.notif.logError("Cannot deliver an empty list.");
  }

}
