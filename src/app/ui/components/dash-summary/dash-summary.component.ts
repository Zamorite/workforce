import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dash-summary',
  templateUrl: './dash-summary.component.html',
  styleUrls: ['./dash-summary.component.scss']
})
export class DashSummaryComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
