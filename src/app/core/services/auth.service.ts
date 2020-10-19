import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { User } from "../models/user";
import { Credentials } from "../models/credentials";
import { NotifService } from "src/app/core/services/notif.service";
import { DataService } from "./data.service";

@Injectable()
export class AuthService {
  user$: Observable<User>;

  errorMap = {
    "auth/user-not-found":
      "You don't seem to have an account. Try signing up instead.",
    "auth/user-disabled":
      "You account seems to have been disabled. Try reporting this to the admin.",
    "auth/weak-password":
      "That password could be cracked in minutes. Try a more complex combination.",
    "auth/wrong-password":
      "That is definitely not your password. Have you forgotten it?",
    "auth/email-already-in-use":
      "Looks like you already have an account here. Try signing in instead.",
    "auth/credential-already-in-use":
      "Looks like you already have an account here. Try signing in instead.",
    "auth/operation-not-allowed": "Hello hacker! Such things don't work here.",
    "auth/network-request-failed":
      "You seem to be offline.  Please check your connection and try again.",
    "auth/timeout": "Looks like we ran out of time. Please try again.",
    "auth/invalid-email": "Your email address doesn't look quite right.",
  };

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private dataService: DataService,
    private notif: NotifService
  ) {
    // *Get auth data, then get firestore user document || null
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.email}`).valueChanges();
        } else {
          return of(null);
        }
      })

      // Add these lines to set/read the user data to local storage
      // tap(user => localStorage.setItem('user', JSON.stringify(user))),
      // startWith(JSON.parse(localStorage.getItem('user'))),
    );
  }

  // ***Login/Signup
  // **Email/Password

  emailSignUp(user: User, role = "employee") {
    // return this.af.auth.createUser(user)
    return this.afAuth.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((credential) => {
        console.log("success");
        this.updateUserData(credential.user, user, role)
          .then(() => {
            this.router.navigate(["/", "dashboard"]);

            // handle greeting directly
            this.notif.remove();
            this.notif.success(`Welcome on board, ${user.fname}.`);
          })
          .then(() =>
            this.dataService.sendWelcomeMail(user, role == "employee")
          );
        // .then(() => this.notif.success("Updated User Successfully !"))
        // .catch((e) => this.notif.logError("Could not Update User", e));
        // this.notif.success("Welcome on board.");
      })
      .catch((error) => {
        console.log(error);
        this.notif.remove();
        this.notif.logError(error);
        // TODO: Consider the code below 👌🏽
        // this.notif.logError(this.errorMap[error.code]);
      });
  }

  emailLogin(credentials: Credentials) {
    //  return this.af.auth.login(credentials,
    this.notif.load("Signing you in...");
    return this.afAuth.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        console.log("success");
        this.notif.remove();
        this.notif.success("Welcome back.");
        this.router.navigate(["/", "dashboard"]);
      })
      .catch((error) => {
        console.log(error);
        this.notif.remove();
        this.notif.logError(this.errorMap[error.code]);
      });
  }

  // **OAuth

  googleLogin(role = "employee") {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider, role);
  }

  private oAuthLogin(provider, role: String) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then((credential) => this.updateUserData(credential.user, null, role));
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(["/"]));
  }

  private updateUserData(fireUser, user: User, role: String) {
    // *Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${fireUser.email}`
    );

    // console.log(`🔥 fireUser`);
    // console.log(fireUser);

    // console.log(`🙋🏽‍♂️ user`);
    // console.log(user);

    const data: User = {
      ...user,
      uid: fireUser.uid,
      createdAt: new Date(),
      appointDate: new Date(),
      durNum: 0,
      // durType: "day",
      email: fireUser.email,
      roles: {
        admin: role == "admin",
        employee: role == "employee",
        employer: role == "employer",
      },
    };

    console.log("⌛ Attempting to update user");

    return userRef
      .get()
      .toPromise()
      .then((doc) => {
        if (!doc.exists) {
          userRef.set(data, { merge: true });
        } else {
          userRef.update(data);
        }
      })
      .catch((err) => {
        console.log(`[LOGIN] ${err}`);
      });
    // =========================================================================================
    // try {
    //   return userRef.set(data, { merge: true }).then(() => {
    //     this.notif.success("Updated User Successfully !");
    //     console.log("✔ Updated User successfully");
    //   });
    // } catch (error) {
    //   this.notif.logError("Could not Update User", error);
    //   console.group(`⚠ Could not updare User: ${error}`);

    //   // retry without {merge: true}
    //   try {
    //     return userRef.set(data).then(() => {
    //       this.notif.success("Updated User Successfully !");
    //       console.log("✔ Updated User successfully");
    //     });
    //   } catch (error) {
    //     this.notif.logError("Could not Update User", error);
    //     console.group(`⚠ Could not updare User: ${error}`);
    //   }
    // }

    // =============================================================================
    // .then(() => {
    //   this.notif.success("Updated User Successfully !");
    //   console.log("✔ Updated User successfully");
    // })
    // .catch((e) => {
    //   this.notif.logError("Could not Update User", e);
    //   console.group(`⚠ Could not updare User: ${e}`);
    // })
    // .finally(() => {
    //   this.notif.logError("What exactly happened there ?");
    //   console.log("😕 What exactly happened there ?");
    // });
  }

  // ***Role-based Authorization

  isAdmin(user: User): boolean {
    const allowed = ["admin"];
    return this.checkAuthorization(user, allowed);
  }

  isEmployer(user: User): boolean {
    const allowed = ["employer"];
    return this.checkAuthorization(user, allowed);
  }

  isEmployee(user: User): boolean {
    const allowed = ["employee"];
    return this.checkAuthorization(user, allowed);
  }

  // *determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false;
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }

  // *reset password
  resetPassword(email: string) {
    this.notif.load("Sending Reset Link...");
    var auth = firebase.auth();

    return auth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log("success");
        this.notif.remove();
        this.notif.success(`Reset link has been sent to ${email}`);
      })
      .catch((error) => {
        console.log(error);
        this.notif.remove();
        this.notif.logError(this.errorMap[error.code]);
      });
  }
}
