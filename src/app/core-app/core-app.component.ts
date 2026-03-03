import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Util } from 'src/app/helpers/utilities';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AppService } from 'src/app/app.service';
import { AzureService } from '../azure.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageUtil } from '../helpers/messages';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { RequestDestinationComponent } from './connector-destination/request-destination/request-destination.component';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-core-app',
  templateUrl: './core-app.component.html',
  styleUrls: ['./core-app.component.scss']
})
export class CoreAppComponent implements OnInit {
  menus = Util.sidebarMenu
  drawerOpen = true;
  open: boolean = false
  panelOpenState = false;
  firstPanelOpen: any;
  change: any;
  lightmode = 'light'
  username: any;
  name: any;
  status: any;
  selected: any;
  loginType: any;

  trial: any
  brandLogo: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  loading: boolean = false;
  list: any = [];

  logoutLoading: any;
  logoutError: boolean = false
  isTrial: boolean = false

  brandColor: any;
  isLocked: boolean = false;

  hideSidebar: boolean = false
  drawer: any;

  appMenu = [
    // {
    //   name: 'Home',
    //   link: '/app/home',
    //   track: 'home',
    //   icon: 'ph-fill ph-house',
    //   free: true,
    // },
    // {
    //   name: 'Create Connectors',
    //   link: '/app/create-connector',
    //   track: 'create_connectors',
    //   icon: 'ph-bold ph-plus',
    //   free: false,
    // },
    // {
    //   name: 'My Connectors',
    //   link: '/app/my-connectors',
    //   track: 'my_connectors',
    //   icon: 'ph-bold ph-plug',
    //   free: false,
    // },
    // {
    //   name: 'Create Report',
    //   link: '/app/create-report',
    //   track: 'create_report',
    //   icon: 'ph-bold ph-file-plus',
    //   free: false,
    // },
    {
      name: 'My Reports',
      link: '/app/report',
      track: 'my_reports',
      icon: 'ph-bold ph-presentation-chart',
      free: true,
    },
  ]
  allowedEmails = ['convz.com', 'datae.ai'];
  isAnAdmin: boolean = false;
  admin: string = ''

  constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private ui: UiService,
    private router: Router,
    private msalService: MsalService, private app: AppService, private cookieService: CookieService) {
    this.app.uiService.$drawerStatus.subscribe((e: boolean) => {
      e ? this.isLocked = false : this.isLocked = true
      this.drawerOpen = e
    })

    this.app.uiService.$closeSide.subscribe((e: boolean) => {
      e ? this.hideSidebar = true : this.hideSidebar = false
    })

    this.ui.setPrimaryColor('#2d3')
  }



  ngOnInit(): void {
    this.firstPanelOpen = true
    this.isTrial = this.app.helperService.getTrial() == 'Preview' ? true : false

    this.name = this.app.helperService.getClientname()
    this.username = this.app.helperService.getEmail()
    this.status = this.app.helperService.getClientStatus()
    this.loginType = this.app.helperService.getLoginType()
    this.trial = this.app.helperService.getTrial()
    this.brandLogo = this.app.helperService.getLogo()
    this.admin = this.app.helperService.getRole()

    // this.brandColor = this.app.helperService.getBrand()

    this.setPermission()

    if (this.brandColor) {

      // document.documentElement.style.setProperty(`--${'side-bar-color'}`, this.brandColor.primary); 
      document.documentElement.style.setProperty('--primary', this.brandColor.primary);
      document.documentElement.style.setProperty('--secondary', this.brandColor.secondary);
      document.documentElement.style.setProperty('--texts', this.brandColor.font);
    }

  }

  organization = this.app.helperService.getOrg()

  setPermission() {
    // if(this.organization == 'convz'){
    //   this.isAnAdmin = true
    // }else this.isAnAdmin = false

    if (this.admin == 'admin') {
      this.isAnAdmin = true
    } else this.isAnAdmin = false

    // let domain = this.username.split('@')[1]
    // if (this.allowedEmails.includes(domain)) {
    //   this.isAnAdmin = true
    // } else this.isAnAdmin = false
  }

  changeMode() {
    this.lightmode = 'light'
  }
  changeDarkMode() {
    this.lightmode = 'dark'
  }

  isOpen() {
    this.open = !this.open
  }
  logout() {
    this.app.logoutUser()
    this.msalService.logout()
    localStorage.clear()
    sessionStorage.clear()
    localStorage.removeItem('redirect')
    this.cookieService.deleteAll()
  }
  back() {
    // if(this.status === 'superadmin'){
    //   this.router.navigate(['/intro'])
    // }else if(this.status === 'admin'){
    //   this.router.navigate(['/intro'])
    // }else{
    //   this.router.navigate(['/'])
    // }
  }

  getInitials(string: any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  signout() {
    this.logoutLoading = "Logging Out..."
    this.app.snackBar.open(this.logoutLoading, 'Dismiss', {
      duration: MessageUtil.TIMEOUT_DURATION,
      panelClass: ['custom-snackbar']
    })
    this.app.productService.logoutUser()
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.logoutLoading = res['message']
            this.app.snackBar.open(this.logoutLoading, 'Dismiss', {
              duration: MessageUtil.TIMEOUT_DURATION,
              panelClass: ['custom-snackbar']
            })
            this.app.logoutUser()
            sessionStorage.clear()
            this.cookieService.deleteAll()
          }
          else {
            this.logoutLoading = res['message']
            this.logoutError = true
            this.app.snackBar.open(this.logoutLoading, 'Dismiss', {
              duration: MessageUtil.TIMEOUT_DURATION,
              panelClass: ['custom-snackbar']
            })
          }
        },
        error: (err) => {
          this.logoutError = true
          this.app.snackBar.open('Error trying to logout', 'Dismiss', {
            duration: MessageUtil.TIMEOUT_DURATION,
            panelClass: ['custom-snackbar']
          })
        }
      })
  }

  requestDestination(item: any) {

    window.analytics.track('menu_clicked', {
      menu_name: item,
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });

    // let dialogConfig = new MatDialogConfig()
    // dialogConfig.disableClose = true
    // dialogConfig.panelClass = 'dialog-container'
    // dialogConfig.height = 'auto'
    // dialogConfig.width = '35vw'
    // this.dialog.open(RequestDestinationComponent, dialogConfig)
    //   .afterClosed().subscribe(res => {
    //     // if(res === 'Success'){
    //     //   this.getCustomConnector()
    //     //   this.dynamicIndex = 2
    //     // }
    //   })

  }

  gotoCalendar() {
    window.open('https://calendar.app.google/AbJx9Qn2U7ADbLH27', '_blank');
  }

  goToAdmin(){
    this.router.navigate(['/admin-panel'])
  }

  trackMenu(item: any) {
    this.app.uiService.setDrawerStatus(true)

    window.analytics.track('menu_clicked', {
      menu_name: item,
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
  }


}