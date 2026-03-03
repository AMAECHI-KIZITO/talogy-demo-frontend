import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  secretKey = environment.secretKey

  constructor() { }

  encrypt(value: string): string{
    let tempValue = value
    return CryptoJS.AES.encrypt(tempValue, this.secretKey).toString();
  }
}
