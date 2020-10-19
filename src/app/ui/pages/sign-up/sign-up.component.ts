import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "src/app/core/models/user";
import { UtilService } from "src/app/core/services/util.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/core/services/auth.service";
import { UploadService } from "src/app/core/services/upload.service";
import { NotifService } from "src/app/core/services/notif.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  otherSector: boolean = false;
  specifySectorMessage: string = "Please enter your sector name.";

  role: string = "employee";
  cPassword: string;

  @ViewChild("proofInput", { static: false }) proofInput;
  @ViewChild("proof2Input", { static: false }) proof2Input;

  proof: File;
  proofError: string;
  proof2: File;
  proof2Error: string;

  gForm: FormGroup;
  eForm: FormGroup;
  rForm: FormGroup;

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

  general = {
    fname: null,
    lname: null,
    email: null,
    password: null,

    phone: null,
    address: null,
  };

  employee = {
    profession: null,
    sector: null,

    referee1Name: null,
    referee1Phone: null,
    referee1Email: null,
    referee1Job: null,
    referee1Rel: null,
    referee1Address: null,

    referee2Name: null,
    referee2Phone: null,
    referee2Email: null,
    referee2Job: null,
    referee2Rel: null,
    referee2Address: null,
  };

  employer = {
    jobTitle: null,
    company: null,
  };

  constructor(
    public util: UtilService,
    private fb: FormBuilder,
    private auth: AuthService,
    private us: UploadService,
    private notif: NotifService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["role"]) {
        this.role = <string>params["role"];
      }
    });

    this.buildForms();
  }

  buildForms(): void {
    this.gForm = this.fb.group({
      fname: ["", [Validators.required, Validators.minLength(2)]],
      lname: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(11)]],
      address: ["", [Validators.required, Validators.minLength(10)]],

      password: [
        "",
        [
          Validators.required,
          //Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"),
          Validators.minLength(8),
        ],
      ],
      cPassword: ["", [Validators.required]],
    });

    this.rForm = this.fb.group({
      jobTitle: ["", [Validators.required, Validators.minLength(2)]],
      company: ["", [Validators.required, Validators.minLength(2)]],
    });

    this.eForm = this.fb.group({
      profession: ["", [Validators.required, Validators.minLength(2)]],
      sector: ["", [Validators.required, Validators.minLength(2)]],

      referee1Name: ["", [Validators.required, Validators.minLength(2)]],
      referee1Phone: ["", [Validators.required, Validators.minLength(11)]],
      referee1Email: ["", [Validators.required, Validators.email]],
      referee1Job: ["", [Validators.required, Validators.minLength(2)]],
      referee1Rel: ["", [Validators.required, Validators.minLength(2)]],
      referee1Address: ["", [Validators.required, Validators.minLength(10)]],

      referee2Name: ["", [Validators.required, Validators.minLength(2)]],
      referee2Phone: ["", [Validators.required, Validators.minLength(11)]],
      referee2Email: ["", [Validators.required, Validators.email]],
      referee2Job: ["", [Validators.required, Validators.minLength(2)]],
      referee2Rel: ["", [Validators.required, Validators.minLength(2)]],
      referee2Address: ["", [Validators.required, Validators.minLength(10)]],
    });

    this.gForm.valueChanges.subscribe((data) =>
      this.onValueChanged(this.gForm, data)
    );
    this.rForm.valueChanges.subscribe((data) =>
      this.onValueChanged(this.rForm, data)
    );
    this.eForm.valueChanges.subscribe((data) =>
      this.onValueChanged(this.eForm, data)
    );

    this.onValueChanged(null); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(inputForm: FormGroup, data?: any) {
    if (!inputForm) {
      return;
    }
    const form = inputForm;
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
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",

    jobTitle: "",
    company: "",

    profession: "",
    sector: "",

    referee1Name: "",
    referee1Phone: "",
    referee1Email: "",
    referee1Job: "",
    referee1Rel: "",
    referee1Address: "",

    referee2Name: "",
    referee2Phone: "",
    referee2Email: "",
    referee2Job: "",
    referee2Rel: "",
    referee2Address: "",

    password: "",
    cPassword: "",
  };

  validationMessages = {
    fname: {
      required: "First name is required.",
      minlength: "First name must be at least 2 characters long.",
    },
    lname: {
      required: "Last name is required.",
      minlength: "Last name must be at least 2 characters long.",
    },
    email: {
      required: "Email is required.",
      email: "Email must be a valid email",
    },
    password: {
      required: "Password is required.",
      pattern: "Password must include at least one letter and one number.",
      minlength: "Password must be at least 8 characters long.",
      maxlength: "Password cannot be more than 40 characters long.",
    },
    cPassword: {
      required: "Retype password.",
    },
    phone: {
      required: "Phone is required.",
      minlength: "Phone must be at least 11 characters long.",
    },
    address: {
      required: "Address is required.",
      minlength: "Address must be at least 10 characters long.",
    },

    profession: {
      required: "Profession is required.",
      minlength: "Profession must be at least 2 characters long.",
    },

    sector: {
      required: "Choose an appropriate sector for your profession",
      minlength: "Sector must be at least 2 characters long.",
    },

    jobTitle: {
      required: "Your job title is required.",
      minlength: "Job titles must be at least 2 characters long.",
    },

    company: {
      required: "Your Company Name is required.",
      minlength: "Company name must be at least 2 characters long.",
    },

    referee1Name: {
      required: "Referee's Name is required.",
      minlength: "Referee's Name must be at least 2 characters long.",
    },
    referee1Phone: {
      required: "Referee's phone number is required.",
      minlength: "Referee's phone number must be at least 11 characters long.",
    },
    referee1Email: {
      required: "Referee's email is required.",
      email: "Referee's email must a valid email.",
    },
    referee1Job: {
      required: "Referee's occupation is required.",
      minlength: "Referee's occupation must be at least 2 characters long.",
    },
    referee1Rel: {
      required: "Who is the referee to you?",
      minlength:
        "Relationship with referee must be at least 2 characters long.",
    },
    referee1Address: {
      required: "Referee's address is required.",
      minlength: "Referee's address must be at least 2 characters long.",
    },

    referee2Name: {
      required: "Referee's Name is required.",
      minlength: "Referee's Name must be at least 2 characters long.",
    },
    referee2Phone: {
      required: "Referee's phone number is required.",
      minlength: "Referee's phone number must be at least 11 characters long.",
    },
    referee2Email: {
      required: "Referee's email is required.",
      email: "Referee's email must a valid email.",
    },
    referee2Job: {
      required: "Referee's occupation is required.",
      minlength: "Referee's occupation must be at least 2 characters long.",
    },
    referee2Rel: {
      required: "Who is the referee to you?",
      minlength:
        "Relationship with referee must be at least 2 characters long.",
    },
    referee2Address: {
      required: "Referee's address is required.",
      minlength: "Referee's address must be at least 2 characters long.",
    },
  };

  signUp(): void {
    this.notif.load("Creating your Account...");

    // nullify counter part
    this.employee = this.role == "employer" ? null : this.employee;
    this.employer = this.role == "employee" ? null : this.employer;

    const user: User = {
      ...this.general,
      ...this.employer,
      ...this.employee,
    };

    console.group("User", user);

    // this.auth.emailSignUp(user, this.role).then(() => {
    //   this.notif.remove();
    //   this.notif.success(`Welcome on board, ${user.name}.`);
    //   // this.projectData.reset();
    // });

    // this.us.upload(this.pix, "avatars", url => {
    //   user.photoURL = url;

    if (this.proof) {
      this.us
        .upload(this.proof, "proofs", (pUrl) => {
          user.proofURL = pUrl;

          this.us
            .upload(this.proof2, "proofs", (p2Url) => {
              user.proof2URL = p2Url;

              this.auth.emailSignUp(user, this.role);
            })
            .catch((e) => {
              this.notif.logError(e);
              this.notif.remove();
            });
        })
        .catch((e) => {
          this.notif.logError(e);
          this.notif.remove();
        });
    } else {
      this.auth.emailSignUp(user, this.role);
    }
    // });
  }

  setProof() {
    var files = this.proofInput.nativeElement.files;

    console.log(`Length: ${files.length}`);
    console.log(files);

    if (files.length >= 1) {
      this.proof = files[0];
      this.proofError = null;
    } else {
      this.proof = null;
      this.proofError =
        "You have to select a form of ID (Passport, Driver licence or National ID)";
    }
  }

  setProof2() {
    var files = this.proof2Input.nativeElement.files;

    console.log(`Length: ${files.length}`);
    console.log(files);

    if (files.length >= 1) {
      this.proof2 = files[0];
      this.proof2Error = null;
    } else {
      this.proof2 = null;
      this.proof2Error =
        "You have to select an utility bill e.g PHCN Bill, Water Bill, etc.";
    }
  }

  verifySector() {
    if (["Other", ""].includes(this.employee.sector)) {
      this.otherSector = true;
      this.employee.sector = "";
      this.formErrors.sector = "Specify sector name";
    } else {
      this.sectors.push(this.employee.sector);
      this.employee.sector = this.employee.sector;

      this.otherSector = false;
    }
  }

  resetSector() {
    this.employee.sector = null;
    this.otherSector = false;
  }
}
