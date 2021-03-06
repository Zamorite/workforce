import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Job } from "src/app/core/models/job.model";
import { UtilService } from "src/app/core/services/util.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DataService } from "src/app/core/services/data.service";
import { Router } from "@angular/router";
import { NotifService } from "src/app/core/services/notif.service";

@Component({
  selector: "app-new-request",
  templateUrl: "./new-request.component.html",
  styleUrls: ["./new-request.component.scss"],
})
export class NewRequestComponent implements OnInit {
  requestForm: FormGroup;

  job: Job = {
    title: null,
    ownerName: null,
    ownerPhone: null,
    ownerAddress: null,
    description: null,
    location: null,
    durNum: 1,
    durType: null,
    expiryDate: null,
    no: 1,
    sector: null,
  };

  sectors = [
    "Office Assistants",
    "Private Drivers",
    "Child Minders",
    "Cleaning",
    "Manual Labourers",
    "Private Nurses",
    "Adult Careers",
    "Sales Girl",
    "Sales Boys",
    "Student Pick-up and Drop-off",
    "Manufacturing",
    "Senior Appointment",
    "Marketing and Creative",
    "Engineering",
    "Teachers",
    "Other",
  ];

  durTypes = ["day", "week", "month", "year", "decade"];

  constructor(
    public util: UtilService,
    private fb: FormBuilder,
    public auth: AuthService,
    private data: DataService,
    private router: Router,
    private notif: NotifService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((u) => {
      this.job = {
        ...this.job,
        owner: u.email,
        ownerName: `${u.fname} ${u.lname}`,
        ownerPhone: u.phone,
        ownerAddress: u.address,
      };
    });

    this.buildForm();
  }

  buildForm(): void {
    this.requestForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required, Validators.minLength(25)]],
      location: ["", [Validators.required, Validators.minLength(10)]],
      durNum: ["", [Validators.required, Validators.min(1)]],
      durType: ["", [Validators.required]],
      expiryDate: ["", [Validators.required]],
      no: ["", [Validators.required, Validators.min(1)]],
      sector: ["", [Validators.required]],
    });

    this.requestForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.requestForm) {
      return;
    }
    const form = this.requestForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = "";
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + " ";
        }
      }
    }
  }

  formErrors = {
    title: "",
    description: "",
    location: "",
    durNum: "",
    durType: "",
    expiryDate: "",
    no: "",
    sector: "",
  };

  validationMessages = {
    title: {
      required: "Job title is required.",
      minlength: "This must be at least 2 characters long.",
    },
    description: {
      required: "Job description is required.",
      minlength: "This must be at least 25 characters long.",
    },
    location: {
      required: "Job location is required.",
      minlength: "This must be at least 10 characters long.",
    },
    durNum: {
      required: "How long?",
      min: "Why are you here, then?",
    },
    expiryDate: {
      required: "When does this vacancy expire?",
      // minlength: "This must be at least 2 characters long."
    },
    no: {
      required: "How many people are needed?",
      min: "Why are you here, then?",
    },
    sector: {
      required: "Choose an appropriate sector for your potential employees",
      // minlength: "This must be at least 2 characters long."
    },
    durType: {
      required: "Choose a duration unit",
      // minlength: "This must be at least 2 characters long."
    },
  };

  request(): void {
    this.notif.load("Sending your request...");

    this.data
      .addJob(this.job)
      .then(() => {
        this.requestForm.reset;
        this.notif.remove();
        this.notif.success("Request submitted successflly.");
        this.router.navigate(["/", "dashboard"]);
      })
      .catch((e) => {
        this.notif.remove();
        this.notif.logError(e);
      });
    console.log(this.job);
  }
}
