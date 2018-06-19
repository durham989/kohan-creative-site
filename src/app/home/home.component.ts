import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireLiteAuth, AngularFireLiteDatabase, AngularFireLiteFirestore } from 'angularfire-lite';
import { ScrollService } from '../services/scroll.service';
import { SharingService } from '../services/sharing.service';

@Component({
  selector: 'kohan-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  public message: string;
  public fireStoreData: any;
  public contactData: any;
  public endpoint = 'https://us-central1-kohan-creative.cloudfunctions.net/httpEmail';
  public pageSection: any;
  public screenHeight: any;
  public animationBoolean: Boolean;
  public setAutoplay: Boolean = false;

  @ViewChild('homeVideo') videoplayer: any;

  constructor(private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private httpClient: HttpClient,
    private scrollService: ScrollService,
    private sharingService: SharingService) {}

  ngOnInit() {
    this.message = 'Hello';
    this.pageSection = 'header-unit';
    this.videoplayer.nativeElement.autoplay = true;
    this.videoplayer.nativeElement.muted = true;
  }

  navigateToPage(route) {
    this.router.navigate([route]);
  }

  openWorkWithUsModal() {
    window.scrollTo(0, 0);
    this.ngxSmartModalService.getModal('myModal').open();
  }

  scrollToPageSection(target) {
    this.pageSection = target;
    this.scrollService.triggerScrollTo(target);
  }

  fireAnimation(animationBool) {
    this.animationBoolean = animationBool;
  }
}
