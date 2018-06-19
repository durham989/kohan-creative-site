import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConsultationService {
  constructor(private http: HttpClient) {}

  sendConsultationNotification(consultationForm) {
    const apiHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post('/work-with-us', consultationForm, {headers: apiHeaders});
  }

  sendContactUsNotification(whitepaperForm) {
    const apiHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post('/contact-us', whitepaperForm, {headers: apiHeaders});
  }
  
}