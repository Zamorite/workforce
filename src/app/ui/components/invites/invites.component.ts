import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { Job } from 'src/app/core/models/job.model';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {
  invites: Observable<any>;
  email: string;

  constructor(
    public auth: AuthService,
    private data: DataService,
    private notif: NotifService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(u => {
      if (u) {
        this.email = u.email;
        this.invites = this.data.getMyInvites(u.email);
        // this.invites = this.data.joinOwners(partInvites);
      }
    });
  }

  acceptInvite(job: Job, user: User) {
    this.data
      .acceptInvite(job, user)
      .then(() =>
        this.notif.success("You have successfully accepted the invitation.")
      );
  }

}
