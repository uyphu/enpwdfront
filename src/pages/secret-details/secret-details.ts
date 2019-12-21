import { OnInit, Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EditSecretPage } from '../edit-secret/edit-secret'

import * as CryptoJS from 'crypto-js/crypto-js';

@Component({
  selector: 'page-secret-details',
  templateUrl: 'secret-details.html'
})
export class SecretDetailsPage implements OnInit {
  
  selectedItem: any;
  SECERET_KEY: string = '';
  decryptedPassword: string = '';
  encryptedPassword: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
        private alertCtrl: AlertController,) {
    // If we navigated to this page, we will have an item available as a nav param    
    this.selectedItem = this.navParams.get('secret');
  }

  ngOnInit(): any {
    this.storage.get('user').then((value) => {
        this.SECERET_KEY = value.item.secretKey;
        this.encryptedPassword = this.selectedItem.password.toString();
        this.decryptedPassword = this.selectedItem.password.toString();
      });
  }
  
  openEdit() {
  	this.navCtrl.push(EditSecretPage, { 'secret': this.selectedItem });
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Secret Key',
      message: 'Enter your key to decrypt password.',
      inputs: [
        {
          name: 'key',
          placeholder: 'key',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Decrypt',
          handler: data => {             
            if (data.key === this.SECERET_KEY) {
              let bytes = CryptoJS.AES.decrypt(this.encryptedPassword, this.SECERET_KEY);
              let plaintext = bytes.toString(CryptoJS.enc.Utf8);
              this.decryptedPassword = plaintext;
            } else {
              this.showError('Incorrect key!');
            }
            
          }
        }
      ]
    });
    alert.present();
  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }  
  
}
