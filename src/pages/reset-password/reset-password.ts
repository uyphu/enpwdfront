import { OnInit, Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Storage } from '@ionic/storage';
import { DefaultApi } from '../../providers/api/DefaultApi';

// import { Utils } from '../../utils/utils';
import * as models  from '../../providers/model/models';

/**
 * Generated class for the AddSecret page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage implements OnInit {

  email: any;
  loading: Loading;
  resetPwdFrom: FormGroup;
  SECERET_KEY: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
  	public formBuilder: FormBuilder, private api: DefaultApi, private loadingCtrl: LoadingController, private storage: Storage
    ) {
  }

  ngOnInit(): any {

    this.storage.get('user').then((val) => {
      if (!(val === undefined || val === null)) {
        let loginUser: models.LoginUserResponse = val;
        this.email = loginUser.item.email;      
      }
    });

    this.resetPwdFrom = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],      
    });
  }

  onSubmit() {
    this.showLoading();
    if (this.resetPwdFrom.valid == true) {
      var request: models.FogotPasswordRequest = {} as models.FogotPasswordRequest;
      request.email = this.email;     
      this.api.usersForgetpasswordPost(request).subscribe(response => {        
          this.storage.set('email', this.email); 
          this.navCtrl.push('ChangePasswordPage');          
        },
          error => {
            this.showError(error);          
        });
    } else {
      this.showError('Please fix the error field');          
    }
  }

  isValid(field: string) {
    let formField = this.resetPwdFrom.controls[field];
    if (formField !== undefined) {
       return (formField.valid || formField.pristine);
    }
    return true;
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