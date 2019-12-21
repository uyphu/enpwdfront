import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecretDetailsPage } from './secret-details';

@NgModule({
  declarations: [
    SecretDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SecretDetailsPage),
  ],
  exports: [
    SecretDetailsPage
  ]
})
export class SecretDetailsModule {}
