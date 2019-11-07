import { Component } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pushes: any = [];
  mineValue = "Never Received";
  keywords: any = [];

  constructor(private fcm: FCM, public plt: Platform,  private http: HttpClient) {
    this.plt.ready()
      .then(() => {
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            this.mineValue = "Received in background";
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
            this.mineValue = "Received in foreground";
          };
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          // Register your new token in your back-end if you want 
          // backend.registerToken(token);
        });
      });

      this.getKeywords().subscribe((records: any) => {
        this.keywords = records;
      });
  }
  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');
  }
  getToken() {
    this.fcm.getToken().then(token => {
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
    });
  }
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }

  public getKeywords(): Observable<any> {
    const req = {
      StartDate: "2019-11-05T19:03:45.105Z",
      EndDate: "2019-11-06T19:03:45.105Z",
      NumberOfRecords: 10
    }

    let headers = new HttpHeaders().set('APIKey', 'CMqa6fj2Nka/a9Xk9ndthA=='); // create header object

    const urlString = 'https://qa.test.api.realtimemed.com/api/feature/get-all' ; //'https://qa.test.api.realtimemed.com/api/sandbox/keywords';
    return this.http.get<any>(urlString,{ headers: headers});
    //return this.http.post<any>(urlString,{ headers: headers, params: req });
  }

}
