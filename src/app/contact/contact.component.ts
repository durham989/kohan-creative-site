import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireLiteAuth, AngularFireLiteDatabase, AngularFireLiteFirestore } from 'angularfire-lite';
import { SharingService } from '../services/sharing.service';
import { ConsultationService } from '../services/consultation.service';

@Component({
  selector: 'kohan-contact-us',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactUsComponent implements OnInit {
  public message: string;
  public fireStoreData: any;
  public contactData: any;
  public contactUsForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    practiceName: new FormControl(null, Validators.required),
    contactUsMessage: new FormControl(null)
  });
  public endpoint = 'https://us-central1-kohan-creative.cloudfunctions.net/contactUsEmail';
  public previouslySubmittedEmail: any;
  public submitted: Boolean = false;

  constructor(private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private consultationService: ConsultationService,
    private httpClient: HttpClient,
    private sharingService: SharingService) { }

  ngOnInit() {
    this.message = 'Hello';
    this.sharingService.currentEmailAddress.subscribe(
      emailAddress => {
        this.previouslySubmittedEmail = emailAddress;
        this.contactUsForm.patchValue({
          email: this.previouslySubmittedEmail
        });
      }
    );
  }

  navigateToPage(route) {
    this.router.navigate([route]);
  }

  saveContactInformation() {
    var contactInfo = {
      firstName: this.contactUsForm.get('firstName').value,
      lastName: this.contactUsForm.get('lastName').value,
      email: this.contactUsForm.get('email').value,
      practiceName: this.contactUsForm.get('practiceName').value,
      contactUsMessage: this.contactUsForm.get('contactUsMessage').value
    };
    
    // this.fireStore.push('contact-us',contactInfo).subscribe(
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
      'Content-Type':  'application/json'
    });

    const contactUsInfo = {
      firstName: this.contactUsForm.get('firstName').value,
      lastName: this.contactUsForm.get('lastName').value,
      email: this.contactUsForm.get('email').value,
      practiceName: this.contactUsForm.get('practiceName').value,
      contactUsMessage: this.contactUsForm.get('contactUsMessage').value
    }
    
    const data = {
      // toEmail: 'sfarrugia@kohaninc.com',
      // toName: 'Sabina Farrugia',
      toEmail: 'info@kohancreative.com',
      toName: 'Kohan Creative',
      leadFirstName: contactUsInfo.firstName,
      leadLastName: contactUsInfo.lastName,
      leadEmailAddress: contactUsInfo.email,
      leadPracticeName: contactUsInfo.practiceName,
      contactUsMessage: contactUsInfo.contactUsMessage
    }

    this.httpClient.post(this.endpoint, data, {headers: apiHeaders}).subscribe();
    this.submitted = true;
  }

  sendEmailToSharedService(emailAddress) {
    this.sharingService.changeEmailAddress(emailAddress);
    console.log('storing email address for other forms: ' + emailAddress);
  }

  submitContactUsForm() {
    this.consultationService.sendContactUsNotification(this.contactUsForm.value).subscribe(
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
