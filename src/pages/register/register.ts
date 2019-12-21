import { OnInit, Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
//import { IonicPage } from 'ionic-angular';
//import {OnInit, Component} from "@angular/core";
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { DefaultApi } from '../../providers/api/DefaultApi';

import * as models  from '../../providers/model/models';


/**
 * Generated class for the Register page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {

  loading: Loading;
  myForm: FormGroup;
  userInfo: {name: string, email: string, password: string, confirmPassword: string} = 
            {name: '', email: '', password: '', confirmPassword: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
  	public formBuilder: FormBuilder, private api: DefaultApi, private loadingCtrl: LoadingController) {

  }

  ngOnInit(): any {
    this.myForm = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.minLength(3)]],      
      'email': ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      'password': ['', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})')]],
      'confirmPassword': ['', [Validators.required, this.confirmPasswordValidator.bind(this)]],
    });
  }

  onSubmit() {
    this.showLoading();
    if (this.myForm.valid == true) {
      var request: models.RegisterUserRequest = {} as models.RegisterUserRequest;
      request.password = this.userInfo.password;
      request.displayName = this.userInfo.name;
      request.email = this.userInfo.email;      

      this.api.registerPost(request).subscribe(response => {
          this.navCtrl.push('ActivatePage');
        },
          error => {
            this.showError(error);          
        });

    } else {
      this.showError('Please fix the error field.');
    } 
  }

  isValid(field: string) {
    let formField = this.myForm.controls[field];
    return formField.valid || formField.pristine;
  }

  nameValidator(control: FormControl): {[s: string]: boolean} {
    if (!control.value.match("^[a-zA-Z ,.'-]+$")) {
      return {invalidName: true};
    }
  }

  passwordValidator(control: FormControl): {[s: string]: boolean} {
    //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    if (!control.value.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$')) {
      return {invalidPassword: true};
    }
  }

  confirmPasswordValidator(control: FormControl): {[s: string]: boolean} {
    if (!(control.value === this.userInfo.password)) {
          console.log(control.value);
          console.log(this.userInfo.password);
      return {invalidConfirmPassword: true};
    }
  }

  emailValidator(control: FormControl): {[s: string]: boolean} {
    // /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //if (!(control.value.toLowerCase().match('^[a-zA-Z]\\w*@gmail\\.com$') || control.value.toLowerCase().match('^[a-zA-Z]\\w*@yahoo\\.com$'))) {
    if (!(control.value.toLowerCase().match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'))) {
      return {invalidEmail: true};
    }
  }

  confirmEmailValidator(email: FormControl, confirmEmail: FormControl): {[s: string]: boolean} {
    if (!(email.value.toLowerCase() == confirmEmail.value.toLowerCase())) {
      return {invalidConfirmEmail: true};
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