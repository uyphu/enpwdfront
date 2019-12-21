import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecretKeyPage } from './secret-key';

@NgModule({
  declarations: [
    SecretKeyPage,
  ],
  imports: [
    IonicPageModule.forChild(SecretKeyPage),
  ],
  exports: [
    SecretKeyPage
  ]
})
export class SecretKeyPageModule {}
