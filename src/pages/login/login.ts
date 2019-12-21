import { OnInit, Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { DefaultApi } from '../../providers/api/DefaultApi';
import { AppConstants } from '../../constants/app.constants';

import { Storage } from '@ionic/storage';
import * as models  from '../../providers/model/models';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  loading: Loading;
  registerCredentials = { email: '', password: '' };    
 
  constructor(private nav: NavController,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    private api: DefaultApi, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      if (val !== undefined && val !== null) {
        let loginUser: models.LoginUserResponse = val;
        if (AppConstants.KEY_STATUS === loginUser.item.status) {
          this.nav.setRoot('HomePage');
        }    
      }
    });
  }
 
  public createAccount(event) {
    this.nav.push('RegisterPage');
  }

  public forgetPassword(event) {
    event.preventDefault();
    this.nav.push('ResetPasswordPage');
  }

  public login() {
    this.showLoading();
    this.storage.set('user', null); 
    if (this.registerCredentials.email === null || this.registerCredentials.password === null) {
      return this.showError("Please insert credentials");
    } else {
      let request: models.LoginUserRequest = {} as models.LoginUserRequest;
      request.email = this.registerCredentials.email;
      request.password = this.registerCredentials.password;
      this.api.loginPost(request).subscribe(response => {
        if (response.token !== null) {                       
          this.storage.set('user', response); 
          console.log(response);         
          this.storage.set('passcode', this.registerCredentials.password);          
          this.nav.push('SecretKeyPage');
        } else {
          this.showError("Access Denied");
        }
        this.loading.dismiss();
      },
        error => {
          this.showError(error);                  
      });
    }          
  }  
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
    let errorMsg = this.getErrorMessage(text)
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: errorMsg,
      buttons: ['OK']
    });
    alert.present();
  }  

  getErrorMessage(text): string {
    try {
      var object = JSON.parse(text._body);
      return object.errorMessage;
    } catch (e){
      return text;
    }
  }
}