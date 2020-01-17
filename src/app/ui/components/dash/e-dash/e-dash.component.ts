import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-e-dash",
  templateUrl: "./e-dash.component.html",
  styleUrls: ["./e-dash.component.scss"]
})
export class EDashComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
