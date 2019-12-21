import { OnInit, Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { Storage } from '@ionic/storage';
import { DefaultApi } from '../../providers/api/DefaultApi';

import { Utils } from '../../utils/utils';
import * as models  from '../../providers/model/models';
/**
 * Generated class for the AddSecret page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-edit-secret',
  templateUrl: 'edit-secret.html',
})
export class EditSecretPage implements OnInit {

  secret: any;
  loading: Loading;
  editFrom: FormGroup;
  SECERET_KEY: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
  	public formBuilder: FormBuilder, private api: DefaultApi, private loadingCtrl: LoadingController, private storage: Storage
    ) {
    this.secret = this.navParams.get('secret');
  }

  ngOnInit(): any {
    this.storage.get('user').then((val) => {
      let loginUser: models.LoginUserResponse = val;
      this.SECERET_KEY = loginUser.item.secretKey;
      this.secret.userId = loginUser.item.id;
      this.secret.encryptedPassword = this.secret.password;
      this.secret.password = Utils.getDEcryptedCode(this.secret.password, this.SECERET_KEY);
      this.secret.confirmPassword = this.secret.password;
      console.log(this.secret.password);
      console.log(this.secret.confirmPassword);
      this.api.configuration = Utils.getConfiguration(loginUser);     
    });

    this.editFrom = this.formBuilder.group({
      domain: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator.bind(this)]],
      encryptedPassword: ['', [Validators.required]],
      note: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.showLoading();
    if (this.editFrom.valid == true) {
      var request: models.UpdateSecretRequest = {} as models.UpdateSecretRequest;
      request.id = this.secret.id;
      request.password = this.secret.encryptedPassword;    
      request.note = this.secret.note;
      this.api.secretsIdPut(request.id, request).subscribe(response => {        
          this.navCtrl.push('HomePage');
        },
          error => {
            this.showError(error);
        });
    }
  }

  isValid(field: string) {
    let formField = this.editFrom.controls[field];
    if (formField !== undefined) {
       return (formField.valid || formField.pristine);
    }
    return true;
  }

  domainValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value !== '') {
      return {invalidDomain: true};
    }
  }

  usernameValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value !== '') {
      return {invalidUsername: true};
    }
  }

  passwordValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value !== '') {      
        return {invalidPassword: true};      
    }
  }

  confirmPasswordValidator(control: FormControl): {[s: string]: boolean} {
    //debugger;
    if (control !== undefined) {
      if (control.value !== this.secret.password) {
        return {invalidConfirmPassord: true};
      }
    }
  }

  noteValidator(control: FormControl): {[s: string]: boolean} {
        return {invalidNote: true};
  }

  onInputTime(password: string){
  	this.secret.encryptedPassword = Utils.getEncryptCode(this.secret.password, this.SECERET_KEY);
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