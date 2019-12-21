import { Utils } from './../../utils/utils';
import { OnInit, Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { SecretDetailsPage } from '../secret-details/secret-details';
import { DefaultApi } from '../../providers/api/DefaultApi';
import * as models  from '../../providers/model/models';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Home page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {

  loading: Loading;
  icons: string[];
  items: Array<models.Secret>;
  noMoreItemsAvailable: boolean = false; 

  searchInput: string = '';
  QUERY_STR: string = '';
  LIMIT: string = '15'
  CURSOR: string = undefined;
  SEARCH_TEXT: string = undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: DefaultApi,
              private storage: Storage, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];
    this.items = [];    
  }

  ngOnInit(): any {

    this.storage.get('user').then((val) => {  
      if (val === undefined || val === null) {
        this.navCtrl.setRoot('LoginPage');
      } else {
        let loginUser: models.LoginUserResponse = val; 
        this.QUERY_STR = 'userId:' + loginUser.item.id;   
        this.api.configuration = Utils.getConfiguration(loginUser); 
        this.getSecrets(this.QUERY_STR);  
      }        
    });    
  }  

  getSecrets(query:string) {
    if (this.noMoreItemsAvailable == false) {
      this.showLoading(); 
    }
    this.api.secretsSearchGet(query, this.LIMIT, this.CURSOR).subscribe(response => {   
        if (response != null && response.items.length > 0) {          
          for (let i in response.items) {              
             this.items.push(response.items[i]);
             //console.log(i);
             let password  = Utils.getDEcryptedCode(response.items[i].password, 'c@li12345');
             console.log( response.items[i].domain + '#' 
             + response.items[i].username + '#' + password + '#' 
             + response.items[i].note ); 
          }
          this.CURSOR = response.nextPageToken;
          this.noMoreItemsAvailable = true;
        }
        this.closeLoading();
      },
        error => {
          this.showError(error);
      });
  }

  doInfinite(infiniteScroll) {
    if (this.noMoreItemsAvailable == true) {
      //console.log(this.CURSOR);
      setTimeout(() => {
        //this.noMoreItemsAvailable = false;
        if (this.SEARCH_TEXT !== undefined) {
          this.getSecrets(this.SEARCH_TEXT);
        } else {
          this.getSecrets(this.QUERY_STR);
        }
        
        infiniteScroll.complete();
      }, 500);
    }
  }


  itemTapped(event, secret) {
    //console.log("itemTapped");
    //console.log(secret)
    this.navCtrl.push(SecretDetailsPage, { 'secret': secret });
  }

  onInput(event) {
    if (this.searchInput.length >= 3) {
      this.items = [];
      this.CURSOR = undefined;
      this.SEARCH_TEXT = this.QUERY_STR + '&searchText:' + this.searchInput;
      this.noMoreItemsAvailable = false;
      this.getSecrets(this.SEARCH_TEXT);
    } else if (this.searchInput.length == 0) {
      this.SEARCH_TEXT = undefined;
      this.CURSOR = undefined;
      this.items = [];
      this.noMoreItemsAvailable = false;
      this.getSecrets(this.QUERY_STR);
    } 
    
  }

  onCancel(event) {

  }

  presentConfirm(event, secret) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this secret?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {            
            this.deleteItem(secret);
          }
        }
      ]
    });
    alert.present();
  }

  deleteItem(secret) {  

    this.api.secretsIdDelete(secret.id).subscribe(response => {        
        //if (response != null) {
          let index: number = this.items.indexOf(secret);
          if (index !== -1) {
              this.items.splice(index, 1);
          } 
        //}
      },
        error => {
          this.showError(error);
        
      });
  }

  openAdd() {
    this.navCtrl.push('AddSecret');
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  closeLoading() {
    this.loading.dismiss();
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

