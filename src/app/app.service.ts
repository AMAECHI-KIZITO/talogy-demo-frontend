import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject } from 'rxjs';
import { DataProductV2Service } from './api/data-product-v2.service';
import { DataServiceService } from './api/data-service.service';
import { PowerbiServiceService } from './api/powerbi-service.service';


import { Constants } from './helpers/messages';
import { UtilService } from './services/util.service';
import { alertModal, UiService } from './services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private profilePic: BehaviorSubject<any> = new BehaviorSubject<any>('');

  timertoken = new BehaviorSubject<number>(0);
  timertoken$ = this.timertoken.asObservable();

  reportConfig = new BehaviorSubject<any>('');
  reportConfig$ = this.reportConfig.asObservable();

  profileImage: string | ArrayBuffer = '';

  constructor(
    public snackBar:MatSnackBar,
    public helperService: UtilService,
    public uiService: UiService,
    private router: Router,
    private msalService: MsalService,
    public dataService: DataServiceService,
    public ui: UiService,
    public productService : DataProductV2Service,
    public powerbiService : PowerbiServiceService,
    private dialog: MatDialog
    
  ) { 
    this.checkLoginStatus()
  }
  
  setLoginStatus(val: boolean): void {
    this.loginStatus.next(val)
  }



  logoutUser(){
    localStorage.clear()
    this.loginStatus.next(false)
    this.router.navigateByUrl('/');

    window.analytics.reset();
  }

  loginObserverable(){
    return this.loginStatus.asObservable()
  }

  idleLogout(){
    var t: any;
    var route = this.router
    var context = this
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;
    window.onkeypress = resetTimer;
    window.addEventListener('scroll', resetTimer, true);

    function logout(){

      context.dialog.closeAll();
      context.setLoginStatus(false);
      context.errorDialog('Your session has timed out due to inactivity. Please log in again to continue.');
      route.navigate(['/']);
      localStorage.clear();
    }

    function resetTimer(){
      clearTimeout(t);
      t = setTimeout(logout, 1000 * 60 * 120) // time is in milliseconds      
    }

  }


  errorDialog(item: any) {

    let alert: alertModal = {
      details: item,
      message: 'Session Inactivity',
      type: 'INFO',
    }
    this.ui.setAlertStatus(alert);
  }

  checkLoginStatus() {
    let login =  this.helperService.getFromStore(Constants.LOGIN_USER)
    
    if (login) {
      this.loginStatus.next(true);
      this.idleLogout()   
    }

    else {
      this.loginStatus.next(false);
    }
  }


}


