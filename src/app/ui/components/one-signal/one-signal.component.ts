import { Component, OnInit } from "@angular/core";
import { OneSignalService } from "ngx-onesignal";

@Component({
  selector: "app-one-signal",
  templateUrl: "./one-signal.component.html",
  styleUrls: ["./one-signal.component.scss"]
})
export class OneSignalComponent implements OnInit {
  constructor(public readonly onesignal: OneSignalService) {
    // tslint:disable-next-line:no-angle-bracket-type-assertion
    (<any>window).ngxOnesignal = onesignal;
  }

  ngOnInit() {}

  onSubscribe() {
    this.onesignal.subscribe();
    console.clear();
    console.log(':)\tSubscribed Succesfully.');
  }

  onUnSubscribe() {
    this.onesignal.unsubscribe();
    console.clear();
    console.log(':)\tUnsubscribed Succesfully.');
  }
}
