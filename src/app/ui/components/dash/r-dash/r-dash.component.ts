import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-r-dash",
  templateUrl: "./r-dash.component.html",
  styleUrls: ["./r-dash.component.scss"]
})
export class RDashComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
