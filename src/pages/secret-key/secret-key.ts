import { OnInit, Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { DefaultApi } from '../../providers/api/DefaultApi';
import { Storage } from '@ionic/storage';
import { AppConstants } from '../../constants/app.constants';

import * as models  from '../../providers/model/models';
import * as SHA256 from 'crypto-js/sha256';
import { Utils } from '../../utils/utils';

/**
 * Generated class for the ActivatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-secret-key',
  templateUrl: 'secret-key.html',
})
export class SecretKeyPage implements OnInit{

  loading: Loading;
  myForm: FormGroup;
  SECERET_KEY: string = '';
  hasKey: boolean = false; 

  loginUser: models.LoginUserResponse = {} as models.LoginUserResponse;

  userInfo: {secretKey: string, userId: string, passcode: string} = 
            {secretKey: '', userId: '', passcode: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
  	public formBuilder: FormBuilder, private api: DefaultApi, private loadingCtrl: LoadingController,
    private storage: Storage) {
    this.SECERET_KEY = '';
  }

  ngOnInit(): any {
    this.storage.get('user').then((value) => {
      this.loginUser = value;
      this.userInfo.userId = this.loginUser.item.id;
      if (this.loginUser.item.secretKey !== undefined && this.loginUser.item.secretKey !== null) {
        this.hasKey = true;
        this.SECERET_KEY = this.loginUser.item.secretKey;
      }   
      this.api.configuration = Utils.getConfiguration(this.loginUser);    
    });

    this.storage.get('passcode').then((value) => {
      this.userInfo.passcode = value;
    });

    this.myForm = this.formBuilder.group({
      'secretKey': ['', [Validators.required]]
    });
  }

  onSubmit() {
       
    if (this.SECERET_KEY === undefined || this.SECERET_KEY === null || this.SECERET_KEY === '') {
      this.setupSecretkey();
    } else {
      this.validateSecretKey();
    }
  }

  setupSecretkey() { 
    this.showLoading();   
    var request: models.UpdateSecretKeyRequest = {} as models.UpdateSecretKeyRequest;    
    request.userId = this.userInfo.userId;    
    let shaString = SHA256(this.userInfo.secretKey.toString());
    request.secretKey = shaString.toString();
    //console.log(shaString.toString());

    this.api.usersUpdatesecretkeyPost(request).subscribe(response => {        
        this.updateStorage();
        this.navCtrl.setRoot('HomePage');
        this.loading.dismiss();
      },
        error => {
          this.showError(error);
      });
  }

  updateStorage(): void {
    this.loginUser.item.secretKey = this.userInfo.secretKey;    
    this.loginUser.item.status = AppConstants.KEY_STATUS;    
    this.storage.set('user', this.loginUser); 
  }

  validateSecretKey() {
    
    let shaString = SHA256(this.userInfo.secretKey.toString());
    let secretKey: string = shaString.toString();

    if (secretKey === this.SECERET_KEY) {
      this.updateStorage();
      this.navCtrl.setRoot('HomePage');
    } else {
      this.showError("Secret Key incorrect!")
    }
  }

  isValid(field: string) {
    let formField = this.myForm.controls[field];
    if (formField !== undefined) {
      return formField.valid || formField.pristine;
    }
  }

  secretKeyValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value !== '') {      
    	return {invalidSecretKey: true};
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
