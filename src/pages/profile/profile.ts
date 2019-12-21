import { OnInit, Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as models  from '../../providers/model/models';

/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {

	user:models.User = {} as models.User;

  placeholderPicture = 'assets/avatar/unknown.png';

  languages = ['English'];

  constructor(private storage: Storage
    
  ) { }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      if (val !== null) {
        let loginUser: models.LoginUserResponse = val;
        this.user = loginUser.item;
        this.user.imageUrl = this.placeholderPicture;
      }
    });
  }

}
