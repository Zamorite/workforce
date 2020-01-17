import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/core/services/util.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private router: Router,
    public util: UtilService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  toSignUp() {
    this.router.navigate(["/", "auth", "up"]);
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
        ]
      ]
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
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
    email: "",
    password: ""
  };

  validationMessages = {
    email: {
      required: "Email is required.",
      email: "Email must be a valid email"
    },
    password: {
      required: "Password is required.",
      pattern: "Password must include at least one letter and one number.",
      minlength: "Password must be at least 8 characters long.",
      maxlength: "Password cannot be more than 40 characters long."
    }
  };

  signIn(): void {
    this.auth.emailLogin(this.userForm.value);
  }

}
