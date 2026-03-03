import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Util } from 'src/app/helpers/utilities';
import { filter, map, shareReplay } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AppService } from 'src/app/app.service';
import { AzureService } from '../azure.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageUtil } from '../helpers/messages';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  menus = Util.sidebarMenu
  drawerOpen = true;
  open: boolean = false
  panelOpenState = false;
  firstPanelOpen: any;
  change: any;
  username: any;
  name: any;
  status: any;
  selected: any;
  loginType: any;

  menuList: any = []

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  loading: boolean = false;
  list: any = [];

  logoutLoading: any;
  logoutError: boolean = false

  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private msalService: MsalService, private app: AppService, private cookieService: CookieService) { }

  ngOnInit(): void {

    this.menuList = [
      { name: "Account Management", icon: "ph-bold ph-users", link: "account-management" },
      // { name: "Connector Management", icon: "ph-bold ph-plug", link: "connector-management" },
      { name: "Reports Management", icon: "ph-bold ph-presentation-chart", link: "report-management" },
      // {name: "New Report Workflow", icon: "ph-bold ph-tree-structure", link: "report-workflow"},
      // { name: "Requests", icon: "ph-bold ph-git-pull-request", link: "request" },
      // { name: "Analytics", icon: "ph-bold ph-squares-four", link: "analytics" },
      // {name: "Settings", icon: "ph-bold ph-gear", link: "settings"},
    ]

    this.firstPanelOpen = true
    this.name = this.app.helperService.getClientname()
    this.username = this.app.helperService.getEmail()
    this.status = this.app.helperService.getClientStatus()
    this.loginType = this.app.helperService.getLoginType()
  }

  isOpen() {
    this.open = !this.open
  }
  logout() {
    this.app.logoutUser()
    this.msalService.logout()
    localStorage.clear()
    sessionStorage.clear()
    this.cookieService.deleteAll()
  }

  getInitials(string: any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  goBack(): void {
    this.router.navigate(['/app']);
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

}
