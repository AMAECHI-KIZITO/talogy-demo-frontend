import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Constants } from 'src/app/helpers/messages';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  listError: boolean = false;
  list: any;
  storelist: any;
  loading: boolean = false;

  username: any;
  allowedEmails = ['convz.com', 'datae.ai'];
  isAnAdmin: boolean = false;

  constructor(
    private breadcrumb: BreadcrumbService,
    private dialog: MatDialog,
    private app: AppService,
    private router: Router
  ) {
    let history;
    let name = this.app.helperService.getClientname().split(' ');
    this.breadcrumb.breadcrumbObs$.subscribe((item) => {
      history = item;
    });

    this.breadcrumb.updateBreadcrumb({
      parent: `Welcome back, ${name[0]}! `,
      parentLink: 'home',
      children: [],
    });
  }

  ngOnInit(): void {
    this.username = this.app.helperService.getEmail()
    this.setPermission()
  }

  setPermission() {
    let domain = this.username.split('@')[1]
    if (this.allowedEmails.includes(domain)) {
      this.isAnAdmin = true
    } else this.isAnAdmin = false
  }


  goToDemo() {
    this.router.navigate(['/demo-report']);
    window.analytics.track('button_clicked', {
      button_name: 'report_template_list',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
  }

  trackContact() {
    window.analytics.track('button_clicked', {
      button_name: 'contact_us',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
  }

  trackWebsite() {
    window.analytics.track('button_clicked', {
      button_name: 'goto_datae_website',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
  }

  gotoConnector() {
    if(!this.isAnAdmin){
      this.errorDialog()
      return
    }

    this.router.navigate(['app/create-connector']);
    window.analytics.track('button_clicked', {
      button_name: 'create_connector',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
  }

  gotoReport() {
    if(!this.isAnAdmin){
      this.errorDialog()
      return
    }

    this.router.navigate(['app/create-report']);
    window.analytics.track('button_clicked', {
      button_name: 'create_report',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
  }

  viewReport() {
    this.router.navigate(['app/report']);
    window.analytics.track('button_clicked', {
      button_name: 'report_list',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
  }

  errorDialog(){
    let alert: alertModal = {
      details: '',
      message: 'Not Allowed',
      type: 'ERROR',
      duration: 1000
    }
    this.app.ui.setAlertStatus(alert)
  }
}
