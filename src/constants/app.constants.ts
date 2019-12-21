import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class AppConstants {

  public appVersion: string;

  
  public static KEY_STATUS: string = 'K';

  constructor(platform: Platform) {
    // platform.ready().then(() => {
    // AppVersion.getVersionNumber().then((s) => {
    //     this.appVersion = s;
    //     console.log('App version: ' + this.appVersion );
    //   });
    // });
  }

  

}