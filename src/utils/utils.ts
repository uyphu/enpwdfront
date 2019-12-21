import { Injectable } from "@angular/core";
import * as models  from '../providers/model/models';
import { Configuration } from '../providers/configuration';

import * as CryptoJS from 'crypto-js/crypto-js';

@Injectable()
export class Utils {

    static getConfiguration(loginUser: models.LoginUserResponse) : Configuration {
	    let configuration:Configuration = new Configuration();
	    configuration.apiKey = loginUser.token;
	    if (loginUser.auth !== undefined) {
	    	configuration.accessToken = loginUser.auth.token;
	    }	    
	    configuration.username = loginUser.item.email;
	    configuration.withCredentials = false;
	    return configuration;
	  }	

	static getDEcryptedCode(pwd: string, key: string): string {
	    // Decrypt 
	    var bytes = CryptoJS.AES.decrypt(pwd.toString(), key);
	    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
	    return plaintext;
	  }

  	static getEncryptCode(pwd: string, key: string): string {
	    // Encrypt 
	    var ciphertext = CryptoJS.AES.encrypt(pwd, key);
	    return ciphertext.toString();
	  }
	 
}