import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireLiteAuth, AngularFireLiteDatabase, AngularFireLiteFirestore } from 'angularfire-lite';
import { SharingService } from '../services/sharing.service';
import { ConsultationService } from '../services/consultation.service';

@Component({
  selector: 'kohan-work-with-us',
  templateUrl: './work-with-us.component.html',
  styleUrls: ['./work-with-us.component.css']
})

export class WorkWithUsComponent implements OnInit {
  public message: string;
  public fireStoreData: any;
  public contactData: any;
  public newContactForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    practiceName: new FormControl(null, Validators.required)
  });
  public endpoint = 'https://us-central1-kohan-creative.cloudfunctions.net/httpEmail';
  public previouslySubmittedEmail: any;
  public submitted: Boolean = false;

  constructor(private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    // public db: AngularFireLiteDatabase,
    // public auth: AngularFireLiteAuth,
    // public fireStore: AngularFireLiteFirestore,
    private httpClient: HttpClient,
    private sharingService: SharingService,
    private consultationService: ConsultationService) { }

  ngOnInit() {
    this.message = 'Hello';
    // this.auth.signinAnonymously();
    // this.fireStore.read('contacts').subscribe((data) => {
    //   this.fireStoreData = data;
    // });
    this.sharingService.currentEmailAddress.subscribe(
      emailAddress => {
        this.previouslySubmittedEmail = emailAddress;
        this.newContactForm.patchValue({
          email: this.previouslySubmittedEmail
        });
      }
    );
  }

  saveContactInformation() {
    var contactInfo = {
      email: this.newContactForm.get('email').value,
      practiceName: this.newContactForm.get('practiceName').value
    };

    // this.fireStore.push('contacts',contactInfo).subscribe(
    //   data => {
    //     this.contactData = data;
    //     console.log(this.contactData);
    //     this.sendEmailToKohan();
    //     this.sendEmailToSharedService(contactInfo.email);
    //     this.ngxSmartModalService.getModal('myModal').close();
    //   },
    //   error => {
    //     console.error(error);
    //     this.ngxSmartModalService.getModal('myModal').close();
    //   }
    // );
  }

  sendEmailToKohan() {
    const apiHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const signUpInfo = {
      email: this.newContactForm.get('email').value,
      practiceName: this.newContactForm.get('practiceName').value
    }

    const data = {
      // toEmail: 'sfarrugia@kohaninc.com',
      // toName: 'Sabina Farrugia',
      toEmail: 'info@kohancreative.com',
      toName: 'Kohan Creative',
      leadEmailAddress: signUpInfo.email,
      leadPracticeName: signUpInfo.practiceName
    }

    this.httpClient.post(this.endpoint, data, { headers: apiHeaders }).subscribe();
    this.submitted = true;
  }

  sendEmailToSharedService(emailAddress) {
    this.sharingService.changeEmailAddress(emailAddress);
    console.log('storing email address for other forms: ' + emailAddress);
  }

  submitWorkWithUsForm() {
    this.consultationService.sendConsultationNotification(this.newContactForm.value).subscribe(
      data => {
        console.log('Submission successful. Data is: ' + JSON.stringify(data));
        this.submitted = true;
        // this.displaySuccessNotification("Check your email for your copy of our whitepaper!");
        this.ngxSmartModalService.close('myModal');
      },
      error => {
        console.error(error);
        this.submitted = true;
        // this.displayErrorNotification("Looks like something went wrong. Try again or reach out to us at info@aqueduct.ai");
        this.ngxSmartModalService.close('myModal');
        return Observable.throw(error);
      }
    );
  }
}
