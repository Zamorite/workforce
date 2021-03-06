import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { take, map, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { NotifService } from "../services/notif.service";

@Injectable({
  providedIn: "root"
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notif: NotifService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user$.pipe(
      take(1),
      map(user => {
        if (this.auth.isAdmin(user)) {
          return true;
        } else {
          this.notif.noPerm("admins", "visit such pages");
          this.router.navigate(["/"]);
          return false;
        }
      })
    );
  }
}
