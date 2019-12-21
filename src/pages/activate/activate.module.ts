import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivatePage } from './activate';

@NgModule({
  declarations: [
    ActivatePage,
  ],
  imports: [
    IonicPageModule.forChild(ActivatePage),
  ],
  exports: [
    ActivatePage
  ]
})
export class ActivatePageModule {}
