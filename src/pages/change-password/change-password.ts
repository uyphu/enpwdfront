import { OnInit, Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { Storage } from '@ionic/storage';
import { DefaultApi } from '../../providers/api/DefaultApi';

import * as models  from '../../providers/model/models';

/**
 * Generated class for the AddSecret page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage implements OnInit {

  user: {email: string, password: string, confirmPassword: string, changeKey: string}  = 
  {email: '', password: '', confirmPassword: '', changeKey: ''};
  loading: Loading;
  chnagePwdFrom: FormGroup;
  SECERET_KEY: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
  	public formBuilder: FormBuilder, private api: DefaultApi, private loadingCtrl: LoadingController, private storage: Storage
    ) {
  }

  ngOnInit(): any {    
    this.storage.get('email').then((val) => {    
      this.user.email = val;
    });

    this.chnagePwdFrom = this.formBuilder.group({      
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})')]],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator.bind(this)]],
      changeKey: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.showLoading();
    if (this.chnagePwdFrom.valid === true) {

      var request: models.ChangePasswordRequest = {} as models.FogotPasswordRequest;
      request.email = this.user.email;
      request.password = this.user.password;    
      request.changeKey = this.user.changeKey;
      this.api.usersChangepasswordPost(request).subscribe(response => {
          this.storage.set('user', response);         
          this.navCtrl.push('SecretKeyPage');
        },
          error => {
            this.showError(error);          
        });
    } else {
      this.showError("Please fix the error field.");
    }
  }

  isValid(field: string) {
    let formField = this.chnagePwdFrom.controls[field];
    if (formField !== undefined) {
       return (formField.valid || formField.pristine);
    }
    return true;
  }

  confirmPasswordValidator(control: FormControl): {[s: string]: boolean} {
    if (!(control.value === this.user.password)) {
          console.log(control.value);
          console.log(this.user.password);
      return {invalidConfirmPassword: true};
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