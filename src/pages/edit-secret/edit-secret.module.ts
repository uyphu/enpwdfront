import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditSecretPage } from './edit-secret';

@NgModule({
  declarations: [
    EditSecretPage,
  ],
  imports: [
    IonicPageModule.forChild(EditSecretPage),
  ],
  exports: [
    EditSecretPage
  ]
})
export class EditSecretModule {}
