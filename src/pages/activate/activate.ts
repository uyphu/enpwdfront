import { OnInit, Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { DefaultApi } from '../../providers/api/DefaultApi';

import * as models  from '../../providers/model/models';

/**
 * Generated class for the ActivatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-activate',
  templateUrl: 'activate.html',
})
export class ActivatePage implements OnInit{

  loading: Loading;
  myForm: FormGroup;
  userInfo: {activateCode: string} = 
            {activateCode: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
  	public formBuilder: FormBuilder, private api: DefaultApi, private loadingCtrl: LoadingController) {

  }

  ngOnInit(): any {
    this.myForm = this.formBuilder.group({
   
      'activateCode': ['', [Validators.required, this.activateCodeValidator.bind(this)]]
    });
  }

  onSubmit() {
    this.showLoading();   
    var request: models.ActivateUserRequest = {} as models.ActivateUserRequest;
    request.activateCode = this.userInfo.activateCode;

    this.api.activatePost(request).subscribe(response => {
        console.log(response);
        debugger;
        if (response.item !== null) {
          if (response.item.secretKey === undefined || response.item.secretKey === null) {
            this.navCtrl.push('SecretKeyPage');
          } else {
            this.navCtrl.push('HomePage');    
          }
        } else {
          this.navCtrl.push('HomePage');  
        }        
      },
        error => {
          this.showError(error);
        
      });
  }

  isValid(field: string) {
    //let formField = this.myForm.find(field);
    //return formField.valid || formField.pristine;
    return true;
  }

  activateCodeValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value !== '') {      
    	return {invalidActivateCode: true};
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

    debugger;
    this.loading.dismiss();
    
    var object = JSON.parse(text._body);
    console.log(object);
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: object.errorMessage,
      buttons: ['OK']
    });
    alert.present();
  }
  
}
