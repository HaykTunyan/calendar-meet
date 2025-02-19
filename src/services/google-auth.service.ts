import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})

export class GoogleAuthService {
  private CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
  private API_KEY = 'YOUR_API_KEY';
  private SCOPES = 'https://www.googleapis.com/auth/calendar.events';
  
  private isSignedInSubject = new BehaviorSubject<boolean>(false);
  isSignedIn$ = this.isSignedInSubject.asObservable();

  constructor() {
    this.loadGoogleApi();
  }

  loadGoogleApi() {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        scope: this.SCOPES,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
      }).then(() => {
        this.isSignedInSubject.next(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }

  signIn() {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      this.isSignedInSubject.next(true);
    });
  }

  signOut() {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      this.isSignedInSubject.next(false);
    });
  }

  getEvents() {
    return gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime'
    });
  }

  addEvent(event: any) {
    return gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
  }
}
