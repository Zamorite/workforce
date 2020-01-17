import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UtilService } from './util.service';
import { NotifService } from 'src/app/core/services/notif.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private notif: NotifService,
    private util: UtilService
  ) { }


  async upload(file: File, folder: string, callback?) {
    // Create a root reference
    const storageRef = firebase.storage().ref();

    // Create a reference to 'mountains.jpg'
    const pixRef = storageRef.child(`${folder}/${file.name}_${this.util.randId()}`); //  .${file.type.split('/')[1]}

    // Create file metadata including the content type
    const meta = {
      contentType: file.type,
      size: file.size
    };

    // Upload file and metadata
    const uploadTask = pixRef.put(file, meta);

    // Listen for state changes, errors, and completion of the upload.
    await uploadTask.on('state_changed', snapshot => {

      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      console.log('Upload is ' + progress + '% done');

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, (error: any) => {
      switch (error.code) {
        case 'storage/unauthorized':
          this.notif.logError('User doesn\'t have permission to access the object');
          break;

        case 'storage/canceled':
          this.notif.logError('User canceled the upload');
          break;

        case 'storage/unknown':
          this.notif.logError('Unknown error occurred, inspect error.serverResponse');
          break;
      }

    }, () => {

      // Handle successful uploads on complete
      uploadTask.snapshot.ref.getDownloadURL()
      .then(
        downloadURL => {
          console.log(`File available at ${downloadURL}`);
          callback(downloadURL);
        }
      )
      .catch(e => this.notif.logError(e));
    });
  }
}
