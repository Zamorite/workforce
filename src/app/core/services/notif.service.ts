import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import Notiflix from "notiflix-angular";

@Injectable({
  providedIn: "root"
})
export class NotifService {
  uid: string;

  constructor(private afs: AngularFirestore) {
    Notiflix.Notify.Init({
      timeout: 4500,
      plainText: false,
      messageMaxLength: 150
    });

    Notiflix.Loading.Init({ svgColor: "#BF865D", messageColor: "#d8d8d8" });
  }

  logError(message: string, error?: any) {
    Notiflix.Notify.Failure(`Oops! <br/>${message}`);
  }

  success(message: string) {
    Notiflix.Notify.Success(`Great! <br/>${message}`);
  }
  
  warn(message: string) {
    Notiflix.Notify.Warning(`Oops! <br/>${message}`);
  }

  noAuth(action?: string) {
    Notiflix.Notify.Warning(
      `Authentication Required! <br/>You must be signed in to ${
        action ? action.toLowerCase() : "do that"
      }.`
    );
  }

  noPerm(role?: string, action?: string) {
    Notiflix.Notify.Warning(
      `Insufficient Permissions! <br/>Only ${role} are allowed to ${
        action ? action.toLowerCase() : "do that"
      }.`
    );
  }

  load(message?: string) {
    Notiflix.Loading.Hourglass(message ? message : 'Loading...');
  }

  remove() {
    Notiflix.Loading.Remove();
  }
}
