import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "src/app/core/services/data.service";

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.scss"],
})
export class EmployeesComponent implements OnInit {
  employees: Observable<any[]>;

  durTypes = ["day", "week", "month", "year", "decade"];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.employees = this.data.getEmployees();
  }
}
