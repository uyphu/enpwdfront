import { Configuration } from './configuration';
import * as models  from './model/models';

export interface UserToken {
	
	configuration: Configuration;
	user: models.User;

}