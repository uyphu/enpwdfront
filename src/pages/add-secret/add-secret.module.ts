import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSecret } from './add-secret';

@NgModule({
  declarations: [
    AddSecret,
  ],
  imports: [
    IonicPageModule.forChild(AddSecret),
  ],
  exports: [
    AddSecret
  ]
})
export class AddSecretModule {}
