import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-a-dash',
  templateUrl: './a-dash.component.html',
  styleUrls: ['./a-dash.component.scss']
})
export class ADashComponent implements OnInit {
  allReq: number;
  deliveredReq: number;

  constructor(public auth: AuthService, private data: DataService) {}

  ngOnInit() {
    this.data.getRequests().subscribe(res => (this.allReq = res.length));
    this.data.getDeliveredRequests().subscribe(res => {
      this.deliveredReq = res.length;
    });
  }

}
