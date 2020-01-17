import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.scss']
})
export class EmployersComponent implements OnInit {
  employers: Observable<any[]>

  constructor(private data: DataService) { }

  ngOnInit() {
    this.employers = this.data.getEmployers();
  }

}
