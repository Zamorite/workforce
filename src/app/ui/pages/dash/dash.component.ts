import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.scss"]
})
export class DashComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {
  }
}
