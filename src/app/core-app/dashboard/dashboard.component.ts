import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Util } from 'src/app/helpers/utilities';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';
import { AddReportComponent } from './add-report/add-report.component';

// import { AddReportComponent } from './add-report/add-report.component';
// import { DemoBreadcrumbService } from './demo-breadcrumb/demo-breadcrumb.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  menus = Util.sidebarMenu
  drawerOpen = true;
  open: boolean = false
  panelOpenState = false; 
  firstPanelOpen : any;
  change: any;

  username: any;
  name: any;
  status: any;
  selected: any;
  link = "/dashboard/manage-report"
  id: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  loading: boolean = false;
  list:any = [];
  errorList : boolean = false
  tempArray : any = []

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, 
    private msalService: MsalService, private app : AppService, private breadcrumb: BreadcrumbService,
    private dialog: MatDialog, private titleService: Title, private cookieService: CookieService) {
   
    }

  ngOnInit(): void{ 
    this.firstPanelOpen = true
    this.name = this.app.helperService.getClientname()
    this.username = this.app.helperService.getEmail()
    this.status = this.app.helperService.getClientStatus()
    
    this.getList()
  }
  
  goToProfile(){
  }
  isOpen(){
    this.open = !this.open
  }
  logout(){
    this.app.logoutUser()
    this.msalService.logout()
    localStorage.clear()
    sessionStorage.clear()
    this.cookieService.deleteAll()
  }
  back(){
    this.router.navigate(['/app'])
  }

  getList(){
    this.loading = true
    this.tempArray = []
    let email = this.app.helperService.getEmail()
    let type = 'null'
    let status = 'null'
    this.app.productService.getBasicReport(type, status)
    .subscribe({
      next: (res) => {
        if(res['status']){
          this.loading = false
          this.tempArray = res['reports']
          this.router.navigate(['/dashboard/manage-report'], { queryParams: { workspaceid: this.tempArray[0].workspaceid, reportid: this.tempArray[0].reportid}})
          this.id = this.tempArray[0].workspaceid
          this.errorList = false
        }else{
          this.loading = false
          this.errorList = true
          this.tempArray = []
        }
      },
      error: (err) => {
        this.loading = false
        this.errorList = true
        this.tempArray = []
      }
    })
  }

  viewList(list:any){
    this.router.navigate(['/dashboard/manage-report'], { queryParams: { workspaceid: list.workspaceid, reportid: list.reportid}})
    this.id = list.workspaceid
  }

  addReport(){
    let dialogConfig = new MatDialogConfig()

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.maxWidth = '35vw'
    dialogConfig.data = {
      row: null
    }

    this.dialog.open(AddReportComponent, dialogConfig)
    .afterClosed().subscribe( res => {
      // if(res){
      //   this.getReports()
      // }

      // this.getReports()
    
    
      })
    
  }
  getInitials(string:any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

}
