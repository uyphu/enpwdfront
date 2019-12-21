import { OnInit, Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { Storage } from '@ionic/storage';
import { DefaultApi } from '../../providers/api/DefaultApi';
import { Utils } from '../../utils/utils';

import * as models  from '../../providers/model/models';
import * as CryptoJS from 'crypto-js/crypto-js';

/**
 * Generated class for the AddSecret page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-secret',
  templateUrl: 'add-secret.html',
})
export class AddSecret implements OnInit {

  loading: Loading;
  private addForm: FormGroup;
  SECERET_KEY: string = '';
  submitAttempt: boolean = false;

  secret: {userId: string, domain: string, username: string, password: string, confirmPassword: string, encryptedPassword: string, note: string, secretKey: string} = 
          {userId: '', domain: '', username: '', password: '', confirmPassword: '', encryptedPassword: '', note: '', secretKey: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
  	public formBuilder: FormBuilder, private api: DefaultApi, private loadingCtrl: LoadingController, private storage: Storage
    ) {
    
  }

  ngOnInit(): any {

    this.storage.get('user').then((val) => {
      let loginUser: models.LoginUserResponse = val;
      this.SECERET_KEY = loginUser.item.secretKey;
      this.secret.userId = loginUser.item.id;      
      this.api.configuration = Utils.getConfiguration(loginUser);     
    });

    this.addForm = this.formBuilder.group({
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
    if (this.addForm.dirty && this.addForm.valid == true) {
      var request: models.InsertSecretRequest = {} as models.InsertSecretRequest;
      request.userId = this.secret.userId;
      request.domain = this.secret.domain;
      request.username = this.secret.username;
      request.password = this.secret.encryptedPassword;    
      request.note = this.secret.note;  
      
      this.api.secretsPost(request).subscribe(response => {        
          this.navCtrl.push('HomePage');
        },
          error => {
            this.showError(error);     
        });

    } else {
      this.showError('Please fix the error field.');
    }   
  }

  inputTestData() {
    var request: models.InsertSecretRequest = {} as models.InsertSecretRequest;
    for (var i = 0; i < 40; i++) {
      request.userId = this.secret.userId;
      request.domain = 'domain' + i;
      request.username = 'username' + i;
      var ciphertext = CryptoJS.AES.encrypt('password' + i, this.SECERET_KEY);
      request.password = ciphertext.toString();   
      request.note = 'note' + i;

      this.api.secretsPost(request).subscribe(response => {        
          //this.navCtrl.push('HomePage');
          //console.log(response);
        },
          error => {
            this.showError(error);
          
        });
    }
  }

  isValid(field: string) {
    let formField = this.addForm.controls[field];
    if (formField !== undefined) {
      return formField.valid || formField.pristine;
    }
    return true;
  }

  domainValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value !== '') {
      console.log('domainValidator:' + control.valid);
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
  	this.setPasswordEncrypted(password);
    //console.log(this.getPasswordEcrypted(this.secret.encryptedPassword));
  }

  getPasswordEcrypted(pwd: string): string {
    // Decrypt 
    var bytes = CryptoJS.AES.decrypt(pwd.toString(), this.SECERET_KEY);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }

  setPasswordEncrypted(pwd: string): void {
    // Encrypt 
    var ciphertext = CryptoJS.AES.encrypt(pwd, this.SECERET_KEY);
    this.secret.encryptedPassword = ciphertext.toString();
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