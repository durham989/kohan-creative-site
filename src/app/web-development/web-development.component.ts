import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireLiteAuth, AngularFireLiteDatabase, AngularFireLiteFirestore } from 'angularfire-lite';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScrollService } from '../services/scroll.service';

@Component({
  selector: 'kohan-web-development',
  templateUrl: './web-development.component.html',
  styleUrls: ['./web-development.component.css']
})

export class WebDevelopmentComponent implements OnInit {
  public message: string;
  public contactData: any;
  public endpoint = 'https://us-central1-kohan-creative.cloudfunctions.net/httpEmail';
  public pageSection: any;

  @ViewChild('designVideo') videoplayer: any;

  constructor(private router: Router, 
    public ngxSmartModalService: NgxSmartModalService,
    private httpClient: HttpClient,
    private scrollService: ScrollService) {}

  ngOnInit() {
    this.message = 'Hello';
    this.pageSection = 'header-unit';
    this.videoplayer.nativeElement.autoplay = true;
    this.videoplayer.nativeElement.muted = true;
  }

  navigateToPage(route) {
    this.router.navigate([route]);
  }

  openContactUsModal() {
    window.scrollTo(0, 0);
    this.ngxSmartModalService.getModal('contactUsModal').open();
  }

  openWorkWithUsModal() {
    window.scrollTo(0, 0);
    this.ngxSmartModalService.getModal('myModal').open();
  }

  scrollToPageSection(target) {
    this.pageSection = target;
    this.scrollService.triggerScrollTo(target);
  }
}
