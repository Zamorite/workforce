import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UtilService {
  public authMode = "employee";

  constructor() {}

  randId() {
    const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return randLetter + Date.now();
  }

  authEmployer() {
    return (this.authMode = "employer");
  }

  authEmployee() {
    return (this.authMode = "employee");
  }

  toggleAuthMode() {
    return (this.authMode =
      this.authMode == "employee" ? "employer" : "employee");
  }
}
