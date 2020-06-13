import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { DropzoneDirective } from './directives/dropzone.directive';



@NgModule({
  declarations: [DropzoneDirective],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    AuthService
  ],
})
export class CoreModule { }
