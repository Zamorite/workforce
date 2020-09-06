import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  // AngularFirestoreCollection
} from "@angular/fire/firestore";
// import { AuthService } from "./auth.service";
import { Observable, combineLatest, of, defer } from "rxjs";
import { map, defaultIfEmpty, switchMap } from "rxjs/operators";
import { firestore } from "firebase";
import { NotifService } from "./notif.service";
// import { UploadService } from "./upload.service";
import { Job } from "../models/job.model";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(
    private afs: AngularFirestore,
    // private auth: AuthService,
    private notif: NotifService // private file: UploadService // private moment: M
  ) {}

  getUser(email: string): Observable<any> {
    const user$ = this.afs.doc(`users/${email}`);
    return user$ ? user$.valueChanges() : of(null);
  }

  getUserBySector(sector: string): Observable<any> {
    const userCol$ = this.afs.collection(`users/`, (ref) =>
      ref.where("sector", "==", sector)
    );
    return userCol$.valueChanges();
  }

  getConfirmed(jobId: string): Observable<any> {
    const userCol$ = this.afs.collection(`invites/${jobId}/confirmed`);
    return userCol$.valueChanges();
  }

  getEmployees() {
    return this.afs
      .collection(`users`, (ref) => ref.where("roles.employee", "==", true))
      .valueChanges();
  }

  getEmployers() {
    return this.afs
      .collection(`users`, (ref) => ref.where("roles.employer", "==", true))
      .valueChanges();
  }

  // Firestore Joins

  joinOwners(requests$: Observable<any>) {
    return defer(() => {
      let requests;
      const joinKeys = {};

      return requests$.pipe(
        switchMap((req) => {
          // Unique User IDs
          requests = req;
          const uids = Array.from(new Set(req.map((v) => v.owner)));

          // Firestore User Doc Reads
          const userDocs = uids.map((u) =>
            this.afs.doc(`users/${u}`).valueChanges()
          );

          return userDocs.length ? combineLatest(userDocs) : of([]);
        }),
        map((arr) => {
          arr.forEach((v) => (joinKeys[(v as any).uid] = v));

          requests = requests.map((v) => {
            return { ...v, owner: joinKeys[v.owner] };
          });

          return requests;
        }),
        defaultIfEmpty(false)
      );
    });
  }

  joinOwner(request$: Observable<any>) {
    return defer(() => {
      let request;
      const joinKeys = {};

      return request$.pipe(
        switchMap((req) => {
          // Unique User IDs
          request = req;

          const oid = req.owner;

          // Firestore User Doc Reads
          const userDoc = this.afs.doc(`users/${oid}`).valueChanges();

          return userDoc ? userDoc : of(null);
        }),
        map((doc$) => {
          joinKeys[(doc$ as any).uid] = doc$;
          request = { ...request, owner: joinKeys[request.owner] };

          return request;
        }),
        defaultIfEmpty(false)
      );
    });
  }

  /*
    CRUD for Posts and Answers....
  */

  addJob(request: Job) {
    request.id = request.id ? request.id : this.afs.createId();
    request.createdAt = new Date();

    const RCol$ = this.afs.collection(`requests`);

    return (
      RCol$.doc(request.id)
        .set(request)
        .then(() => {
          this.afs
            .doc(`users/${request.owner}`)
            .update({ requests: firestore.FieldValue.increment(1) })
            .catch((e) => console.warn("Could not update number of requests."));

          this.afs
            .doc(`users/admin@wrk4s.com`)
            .update({ newRequests: firestore.FieldValue.increment(1) })
            .catch((e) =>
              console.warn("Could not update number of new requests.")
            );
        })
        // .catch((err) => {
        //   this.notif.remove();
        //   this.notif.logError(err);
        // })
        .finally(() => {
          return Promise.resolve(true);
        })
    );
  }

  deleteJob(id: string) {
    const request$ = this.afs.doc(`requests/${id}`);
    request$
      .delete()
      .catch((err) => this.notif.logError(err))
      .finally(() => {
        return Promise.resolve(true);
      });
  }

  addInvite(job: Job, inviteeEmail: string) {
    let alreadInvited = (job.invitees || []).includes(inviteeEmail);

    if (!alreadInvited) {
      const RCol$ = this.afs.collection(`requests`);
      const userDoc$ = this.afs.doc(`users/${inviteeEmail}`);

      return RCol$.doc(job.id)
        .update({ invitees: firestore.FieldValue.arrayUnion(inviteeEmail) })
        .then((res) =>
          userDoc$
            .update({ invitations: firestore.FieldValue.increment(1) })
            .catch((err) => this.notif.logError(err))
            .finally(() => {
              this.afs.collection(`emails`).add({
                to: inviteeEmail,
                message: {
                  subject: "New Job Invite! WorkForce",
                  text: `You have been sent a job invitation to work as ${job.title} somewhere in ${job.location}.\nFor more details, please log into your account on https://wrk4s.com.`,
                  // html:
                  //   "This is the <code>HTML</code> section of the email body.",
                },
              });
              return Promise.resolve(true);
            })
        )
        .catch((err) => this.notif.logError(err))
        .finally(() => {
          return Promise.resolve(true);
        });
    }
  }

  removeInvite(job: Job, inviteeEmail: string) {
    let alreadInvited = (job.confirmed || []).includes(inviteeEmail);

    if (alreadInvited) {
      const RCol$ = this.afs.collection(`requests`);
      const userDoc$ = this.afs.doc(`users/${inviteeEmail}`);

      return RCol$.doc(job.id)
        .update({ invitees: firestore.FieldValue.arrayRemove(inviteeEmail) })
        .then((res) =>
          userDoc$
            .update({ invitations: firestore.FieldValue.increment(-1) })
            .catch((err) => this.notif.logError(err))
            .finally(() => {
              this.afs.collection(`emails`).add({
                to: inviteeEmail,
                message: {
                  subject: "Withdrawal of Job Invite! WorkForce",
                  text: `Sorry, your application to work as ${job.title} somewhere in ${job.location} has just been declined.`,
                  // html:
                  //   "This is the <code>HTML</code> section of the email body.",
                },
              });
              return Promise.resolve(true);
            })
        )
        .catch((err) => this.notif.logError(err))
        .finally(() => {
          return Promise.resolve(true);
        });
    }
  }

  acceptInvite(job: Job, user: User) {
    let alreadyConfirmed = (job.confirmed || []).includes(user.email);

    if (!alreadyConfirmed) {
      const RCol$ = this.afs.collection(`requests`);
      const confirmedCol$ = this.afs.doc(
        `invites/${job.id}/confirmed/${user.email}`
      );
      const userDoc$ = this.afs.doc(`users/${user.email}`);

      return confirmedCol$
        .set(user)
        .then((res) =>
          RCol$.doc(job.id)
            .update({
              confirmed: firestore.FieldValue.arrayUnion(user.email),
              invitees: firestore.FieldValue.arrayRemove(user.email),
            })
            .then((res) => {
              userDoc$
                .update({
                  applications: firestore.FieldValue.increment(1),
                  // free: ,
                  appointDate: job.expiryDate,
                  durNum: job.durNum,
                  durType: job.durType,
                })
                .catch((err) => this.notif.logError(err));

              confirmedCol$
                .update({
                  applications: firestore.FieldValue.increment(1),
                  // free: ,
                  appointDate: job.expiryDate,
                  durNum: job.durNum,
                  durType: job.durType,
                })
                .catch((err) => this.notif.logError(err))
                .finally(() => {
                  return Promise.resolve(true);
                });
            })
            .catch((err) => this.notif.logError(err))
            .finally(() => {
              return Promise.resolve(true);
            })
        )
        .catch((err) => this.notif.logError(err))
        .finally(() => {
          return Promise.resolve(true);
        });
    }
  }

  removeApplicant(job: Job, inviteeEmail: string) {
    let alreadConfirmed = (job.confirmed || []).includes(inviteeEmail);
    // DONE: Might need an email too. Who knows?!

    if (alreadConfirmed) {
      const RCol$ = this.afs.collection(`requests`);
      const confirmedCol$ = this.afs.doc(
        `invites/${job.id}/confirmed/${inviteeEmail}`
      );

      return confirmedCol$.delete().then((res) =>
        RCol$.doc(job.id)
          .update({ confirmed: firestore.FieldValue.arrayRemove(inviteeEmail) })
          .then(() => {
            this.afs.collection(`emails`).add({
              to: inviteeEmail,
              message: {
                subject: "Withdrawal of Job Invite! WorkForce",
                text: `Sorry, your application to work as ${job.title} somewhere in ${job.location} has just been closed.`,
                // html:
                //   "This is the <code>HTML</code> section of the email body.",
              },
            });
            return Promise.resolve(true);
          })
          .catch((err) => this.notif.logError(err))
          .finally(() => Promise.resolve(true))
      );
    }
  }

  deliverApplicants(reqId: string, email: string, no: number) {
    const job$ = this.afs.doc(`requests/${reqId}`);
    return job$
      .update({ delivered: true })
      .then((res) =>
        this.afs
          .doc(`users/${email}`)
          .update({ delivered: firestore.FieldValue.increment(no) })
          .catch((e) => this.notif.logError(e))
          .finally(() => {
            this.afs.collection(`emails`).add({
              to: email,
              message: {
                subject: "Your Workers are Ready! WorkForce",
                text: `The workers you requested from WorkForce are ready.\nLog into your account at https://wrk4s.com to view them.`,
                // html:
                //   "This is the <code>HTML</code> section of the email body.",
              },
            });
            return Promise.resolve(true);
          })
      )
      .catch((e) => this.notif.logError(e))
      .finally(() => Promise.resolve(true));
  }

  getRequest(id: string): Observable<Job> {
    const req$ = this.afs.doc<Job>(`requests/${id}`);
    return req$.valueChanges();
  }

  getRequests(): Observable<Job[]> {
    const ICol$ = this.afs.collection<Job>("requests", (ref) =>
      ref.orderBy("createdAt", "desc")
    );
    return ICol$.valueChanges();
  }

  clearRequests() {
    this.afs
      .doc(`users/admin@wrk4s.com`)
      .update({ newRequests: 0 })
      .catch((e) => console.warn("Could not clear requests."));
  }

  getMyRequests(email: string): Observable<Job[]> {
    const ICol$ = this.afs.collection<Job>("requests", (ref) =>
      ref.where("owner", "==", email).orderBy("createdAt", "desc")
    );
    return ICol$.valueChanges();
  }

  getDeliveredRequests(): Observable<Job[]> {
    const ICol$ = this.afs.collection<Job>("requests", (ref) =>
      ref.where("delivered", "==", true).orderBy("createdAt", "desc")
    );
    return ICol$.valueChanges();
  }

  getMyInvites(email: string): Observable<Job[]> {
    const ICol$ = this.afs.collection<Job>("requests", (ref) => {
      return ref.where("invitees", "array-contains", email);
    });
    const invites$ = ICol$.valueChanges();
    return invites$;
  }

  getMyApplications(email: string): Observable<Job[]> {
    const ICol$ = this.afs.collection<Job>("requests", (ref) => {
      return ref.where("confirmed", "array-contains", email);
    });
    const invites$ = ICol$.valueChanges();
    return invites$;
  }
}
