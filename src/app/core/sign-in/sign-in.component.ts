import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Constants, MessageUtil } from 'src/app/helpers/messages';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from 'src/app/app.service';
import { AuthenticationResult } from '@azure/msal-browser';
import { activateUserPayload, slackAlert } from 'src/app/model/productModel';
// import { ErrorDialogComponent } from 'src/app/core-app/data-connector/error-dialog/error-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { alertModal, UiService } from 'src/app/services/ui.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  setup = 0;
  year = new Date().getFullYear();
  loggedIn: boolean = false;
  username: any;
  userLists: any = [];
  checkUser: any;
  name: any;
  temp: any;
  store: any;
  activeResponse: any;
  userResponse: any;
  loading: boolean = false;
  errorOccured: boolean = false;
  

  activateLoading: boolean = false;
  activateError: boolean = false;

  authstatus: any;
  userEmail: any;
  userType: any;
  userName: any;


  listError: boolean = false;
  list: any;

  googleLoad: boolean = false;
  googleError: boolean = false;

  slackLoading: boolean = false
  slackError: boolean = false

  storelist: any;
  plan: any;

  tenanId: any;

  roles:any;

  authMessage: any;


  constructor(
    private router: Router,
    private msalService: MsalService,
    private dialog: MatDialog,
    private cookieService: CookieService,
    private ui: UiService,
    private app: AppService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.authstatus = params['status'];
      this.userEmail = params['userEmail'];
      this.userType = params['type'];
      this.userName = params['username'];
      this.plan = params['plan'];
      this.authMessage = params['message']
    });
  }

  ngOnInit(): void {
    sessionStorage.clear();
    window.sessionStorage.clear();
    // setInterval(() => {
    //   this.setIndex()
    // }, 5000)

    this.googleSign();
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }
  // login with popwindow of microsoft account
  login() {
    // window.location.hostname !== 'localhost'
    //   ? window.analytics.track('login start', {
    //       device_id: 'device_id variable',
    //     })
    //   : '';
      // dataLayer.push({'event': 'event_name'});
      window.analytics.track('login_start', {
        login_type: "Microsoft"
      })
    this.msalService
      .loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account);
        this.userResponse = response;
        this.username = this.msalService.instance.getActiveAccount()?.username;
        this.name = this.msalService.instance.getActiveAccount()?.name;
        this.tenanId = response.tenantId

        this.activateUser();

        // let tempUser = this.username.split('@');
        // let temp = tempUser[1].split('.');

        // if (temp[0] === 'convz') {
        //   this.activateUser();
        // } else {
        //   this.app.logoutUser();
        //   this.cookieService.deleteAll();
        // }
      });
  }

  googleSign() {
    
    if (this.authstatus === 'success') {
      this.googleLoad = true;
      let payload = new activateUserPayload();
      payload.userEmail = this.userEmail;
      payload.userMethod = this.userType;
      payload.tenantID = null

    

      this.app.productService.activateUser(payload).subscribe({
        next: (res) => {
          if (res['status'] === true) {
            // if (window.location.hostname !== 'localhost') {
            //   window.analytics.track('login_success', {
            //     user_id: this.app.helperService.getEmail(),
            //     device_id: 'device_id variable',
            //     hostname: window.location.hostname,
            //   });
            //   window.analytics.identify(this.app.helperService.getActiveid(), {
            //     name: this.app.helperService.getClientname(),
            //   });
            // } else {
            //   ('');
            // }

          

            this.store = {
              username: this.userEmail,
              name: this.userName,
              type: this.userType,
              id: res['userId'],
              userToken: res['tokens'],
              trialMode: this.plan,
              roleUser: res['userCapacity'],
              logo: res['brandLogo'],
              brandColor: res['brandColors'],
              reportTemplate: res['reportTemplates'],
              organization: res['organizationName'],
              destination: res['destinationChoices']
            };
            this.app.helperService.saveToStore(
              Constants.LOGIN_USER,
              this.store
            );

            this.roles = res['userCapacity']

            // this.sendAlertGoogleMessage()

            this.getListConnector();

            window.analytics.identify(this.app.helperService.getActiveid(), {
              name: this.app.helperService.getClientname(),
              login_type: "Google",
              email: this.app.helperService.getEmail(),
              id: this.app.helperService.getActiveid(),
              title: this.app.helperService.getRole(),
              company: {
                name: this.app.helperService.getOrg(),
                id: "id variable",
                plan: this.app.helperService.getTrial()
              }
            });

            window.analytics.track('login_success', {
              username: this.app.helperService.getClientname(),
              datae_user_id: this.app.helperService.getActiveid(),
              company_plan: this.app.helperService.getTrial(),
              user_title: this.app.helperService.getRole(),
              company_name: this.app.helperService.getOrg(),
              hostname: window.location.hostname,   
  
            });
          } else {
            window.analytics.track('login_failed', {
              device_id: "device_id variable"
            })

            this.googleLoad = false;
            this.googleError = true;
            this.errorDialog(res['message']);

            
          }
        },
        error: (err) => {
          window.analytics.track('login_failed', {
            device_id: "device_id variable"
          })
          this.googleLoad = false;
          this.googleError = true;
          this.errorDialog(err);
        },
      });
    }else if(this.authstatus === 'failed'){
      this.errorDialog(this.authMessage);
    }
  }

  sendAlertGoogleMessage(){  
    this.slackLoading = true
    let payload = new slackAlert
    payload.text = `Successful login to Datae ${environment.domain == 'staging' ? 'Staging app' : 'Prod app'} | User details -> name: ${this.userName} email: ${this.userEmail}`

  

    this.app.productService.slackAlert(payload)
    .subscribe({
      next: (res) => {
        if(res){
          this.slackLoading = false
        }else{
          this.slackLoading = false
          this.slackError = true
        }
      },
      error: (err) => {
        this.slackLoading = false
        this.slackError = true
      }
    })
    
  }

  sendAlertMessage(){  
    this.slackLoading = true
    let payload = new slackAlert
    payload.text = `Successful login to Datae ${environment.domain == 'staging' ? 'Staging app' : 'Prod app'}  | User details -> name: ${this.name} email: ${this.username}`

  

    this.app.productService.slackAlert(payload)
    .subscribe({
      next: (res) => {
        if(res){
          this.slackLoading = false
        }else{
          this.slackLoading = false
          this.slackError = true
        }
      },
      error: (err) => {
        this.slackLoading = false
        this.slackError = true
      }
    })
    
  }

  getListConnector() {
    this.app.productService.getConnectorList().subscribe({
      next: (res) => {
        if (res['status'] === true) {
          this.googleLoad = false;
          this.listError = false;
          this.list = res['connectors'];

          this.storelist = { regularconnector: this.list };
          this.app.helperService.saveToStore(
            Constants.REGULAR_CONNECTOR,
            this.storelist
          );

          this.app.setLoginStatus(true);

          // this.router.navigate(['/app']);

          this.roles == 'admin' ? this.router.navigate(['/app']) : this.router.navigate(['/app']);

          // let urltemp = localStorage.getItem('redirect');
          // if (urltemp) {
          //   this.router.navigate([urltemp]);
          //   localStorage.removeItem('redirect');
          // } else {
          //   this.roles == 'admin' ? this.router.navigate(['/app']) : this.router.navigate(['/user-panel']);
          // }
          // this.router.navigate(['/app']);
        } else {
          this.googleLoad = false;
          this.listError = true;
          this.list = [];
        }
      },
      error: (err) => {
        this.googleLoad = false;
        this.listError = true;
        this.list = [];
      },
    });
  }

  activateGoolgeUser() {
    window.analytics.track('login_start', {
      login_type: "Google"
    });
    window.open(
     this.app.productService.getURL(),
      '_self'
    );
  }

  activateUser() {
    this.activateLoading = true;
    let payload = new activateUserPayload();
    payload.userEmail = this.username;
    payload.userMethod = 'microsoft';
    payload.tenantID = this.tenanId

   

    this.app.productService.activateUser(payload).subscribe({
      next: (res) => {
        if (res['status'] === true) {
          // if (window.location.hostname !== 'localhost') {
          //   window.analytics.track('login_success', {
          //     user_id: this.app.helperService.getEmail(),
          //     device_id: 'device_id variable',
          //     hostname: window.location.hostname,
          //   });
          //   window.analytics.identify(this.app.helperService.getActiveid(), {
          //     name: this.app.helperService.getClientname(),
          //   });
          // } else {
          //   ('');
          // }

          

          // this.sendAlertMessage()

          this.store = {
            username: this.username,
            name: this.name,
            userid: this.userResponse,
            id: res['userId'],
            userToken: res['tokens'],
            trialMode: res['plan'],
            roleUser: res['userCapacity'],
            logo: res['brandLogo'],
            brandColor: res['brandColors'],
            reportTemplate: res['reportTemplates'],
            organization: res['organizationName'],
            destination: res['destinationChoices']
          };
          this.app.helperService.saveToStore(Constants.LOGIN_USER, this.store);
          this.app.setLoginStatus(true);

          // this.router.navigate(['/app']);

          this.roles = res['userCapacity']

          this.storelist = { regularconnector: res['connectors'] };
          this.app.helperService.saveToStore(
            Constants.REGULAR_CONNECTOR,
            this.storelist
          );

         

          this.roles == 'admin' ? this.router.navigate(['/admin-panel']) : this.router.navigate(['/app']);

          let alert: alertModal = {
            details: res['message'],
            message: 'Login Successful',
            type: 'SUCCESS',
            duration: 5000
          }
          this.ui.setAlertStatus(alert);

          // window.analytics.identify(this.app.helperService.getActiveid(), {
          //   name: this.app.helperService.getClientname(),
          //   login_type: "Google",
          //   email: this.app.helperService.getEmail(),
          //   id: this.app.helperService.getActiveid(),
          //   title: this.app.helperService.getRole(),
          //   company: {
          //     name: this.app.helperService.getOrg(),
          //     id: "id variable",
          //     plan: this.app.helperService.getTrial()
          //   }
          // });

    
          // window.analytics.track('login_success', {
          //   username: this.app.helperService.getClientname(),
          //   datae_user_id: this.app.helperService.getActiveid(),
          //   company_plan: this.app.helperService.getTrial(),
          //   user_title: this.app.helperService.getRole(),
          //   company_name: this.app.helperService.getOrg(),
          //   hostname: window.location.hostname,
          
          // });

         

          // this.router.navigate(['/app']);
          // let urltemp = localStorage.getItem('redirect');
          // if (urltemp) {
          //   this.router.navigate([urltemp]);
          //   localStorage.removeItem('redirect');
          // } else {
          //   this.roles == 'admin' ? this.router.navigate(['/app']) : this.router.navigate(['/user-panel']);
          // }
        } else {
          window.analytics.track('login_failed', {
            device_id: "device_id variable"
          })
          this.activateLoading = false;
          this.activateError = true;

          let alert: alertModal = {
            details: res['message'],
            message: 'Login Failed',
            type: 'WARNING',
            duration: 10000
          }
          this.ui.setAlertStatus(alert)
          // this.errorDialog(res['message']);
        }
      },
      error: (err) => {
        window.analytics.track('login_failed', {
          device_id: "device_id variable"
        })
        this.activateLoading = false;
        this.activateError = true;
        let alert: alertModal = {
          details: err,
          message: 'Login Failed',
          type: 'ERROR'
        }
        this.ui.setAlertStatus(alert)
        // this.errorDialog(err);
      },
    });
  }

  logout() {
    this.msalService.logout();
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('redirect');
  }

  //login with redirect windown to microsoft account
  loginRedirect() {
    this.msalService.loginRedirect();
  }

  setIndex() {
    this.setup++;
    if (this.setup > 2) {
      this.setup = 0;
    }
  }

  errorDialog(item: any) {

    let alert: alertModal = {
      details: item,
      message: 'Login Failed',
      type: 'ERROR',
      duration: 10000
    }
    this.ui.setAlertStatus(alert)

    // let dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.width = '30%';
    // dialogConfig.data = item;
    // this.dialog
    //   .open(ErrorDialogComponent, dialogConfig)
    //   .afterClosed()
    //   .subscribe((res) => {});
  }

  show(){
    let alert: alertModal = {
      action: 'Try Again',
      details: 'Please visit the Settings section to fill in your organisation details',
      message: 'Organisation Details Incomplete',
      type: 'WARNING'
    }

    this.ui.setAlertStatus(alert)
  }
}