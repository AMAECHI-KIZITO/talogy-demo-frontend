import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';
import { RequestComponent } from './request/request.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { FormGroup } from '@angular/forms';
import { AddSourceReportComponent } from 'src/app/core-app/create-report/add-source-report/add-source-report.component';
import { AdjustReportComponent } from 'src/app/core-app/create-report/adjust-report/adjust-report.component';
import { CreateReportDialogComponent } from 'src/app/core-app/create-report/create-report-dialog/create-report-dialog.component';
import { IntradayReportComponent } from 'src/app/core-app/create-report/intraday-report/intraday-report.component';
import { MagentoGaReportComponent } from 'src/app/core-app/create-report/magento-ga-report/magento-ga-report.component';
import { PipedriveReportComponent } from 'src/app/core-app/create-report/pipedrive-report/pipedrive-report.component';
import { RequestReportComponent } from 'src/app/core-app/create-report/request-report/request-report.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  organization = this.app.helperService.getOrg()
  loading: boolean = false
  error: boolean = false
  group: any[] = [];
  list: any;
  reportNum: any;

  tempArray: any = [];



  reportList = [

    {
      name: 'Marketing Overview',
      domain: 'marketingoverview',
      image: '../../../assets/newbrandimg/report12.png',
      report: 'https://app.powerbi.com/view?r=eyJrIjoiNjA3MTNhYWItMzU1Yy00MTEzLTg3NzgtZTgwYzY3NGMzM2E5IiwidCI6IjQ2OGI5MzExLTFmZjctNDQyZC1iNjZjLTY2YTA3NjU5MGQ5ZCIsImMiOjh9&pageName=ReportSection352f3fc23bb67eeea562',
      summary: 'Summary of marketing performance, including vital marketing KPIs like orders, GMV and, items sold.'
    },
    {
      name: 'Marketing Cost',
      domain: 'marketcost',
      image: '../../../assets/newbrandimg/report6.png',
      report: 'https://app.powerbi.com/view?r=eyJrIjoiNTU3YWVmMWItMWZjYy00OGQyLWEwNWUtYmIzM2JjODFmZGE5IiwidCI6IjQ2OGI5MzExLTFmZjctNDQyZC1iNjZjLTY2YTA3NjU5MGQ5ZCIsImMiOjh9&pageName=ReportSectione3a50cf231f068e77cbd',
      summary: 'Detailed summary of marketing cost data, encompassing marketing expenditures, clicks, and, impressions.'

    },
    {
      name: 'Marketing Trends',
      domain: 'markettrend',
      image: '../../../assets/newbrandimg/report9.png',
      report: 'https://app.powerbi.com/view?r=eyJrIjoiMzZiNmQ2MTYtYTgxNy00YTdiLThkNzUtOTdhZTdiYjk4MWIxIiwidCI6IjQ2OGI5MzExLTFmZjctNDQyZC1iNjZjLTY2YTA3NjU5MGQ5ZCIsImMiOjh9&pageName=ReportSection5239c26ab9be2e7044c7',
      summary: 'Detailed summary on digital marketing performance covering return on ad spend relative to digital marketing.'

    },
  ];

  autolist = [
    { name: "Adjust Report", info: 'Track and analyze mobile attribution and campaign performance.', image: 'https://fivetran.com/integrations/adjust/resources/adjust-logo.svg', func: 'viewAdjust' },
    { name: "Asana Report", info: 'Get insights into project progress, tasks, and team productivity from Asana.', image: 'https://datae-production-backend-0f31308833e3.herokuapp.com/asana.svg', func: 'viewAsana' },
    { name: "Ecommerce Marketing", info: 'Monitor key marketing metrics and performance for your online store.', image: '../../../assets/svg/mangentoads.svg', func: 'viewEcommerce' },
    { name: "Intraday Report", info: 'Monitor key marketing metrics and performance for your online store.', image: '../../../assets/newbrandimg/intraday.png', func: 'viewIntraday' },
    { name: "Adsource Report", info: 'Monitor key marketing metrics and performance for your online store.', image: '../../../assets/newbrandimg/ad_source.png', func: 'addSource' },
    { name: "Pipedrive Report", info: 'Monitor key marketing metrics and performance for your online store.', image: '../../../assets/svg/pipedrive.svg', func: 'pipedrive' },
  ];

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
    this.getGroup()
  }

  ngAfterViewInit(): void {

  }

  viewOrg() {
    this.router.navigateByUrl('app/settings/group')
  }

  viewDemo() {
    this.router.navigate(['/demo-report'])
  }

  getGroup() {
    this.loading = true;
    this.app.productService.getGroup().subscribe({
      next: (res) => {
        if (res['status'] === true) {
          this.loading = false;
          this.error = false;
          this.group = res['groups'];
          this.reportNum = res['accessibleReports']
        } else {
          this.loading = false;
          this.error = true;
          this.group = [];
        }

        setTimeout(() => {
          this.setScroll()
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.group = [];

        setTimeout(() => {
          this.setScroll()
        }, 1000);
      },
    });
  }


  request(res: any, item: any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    // dialogConfig.maxHeight = '70vh'
    dialogConfig.width = '35vw'
    dialogConfig.data = { res, item }
    this.dialog.open(RequestComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        // if(res === 'Success'){
        //   this.getCustomConnector()
        //   this.dynamicIndex = 2
        // }
      })

  }

  viewReport(item: any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    // dialogConfig.maxHeight = '70vh'
    dialogConfig.width = '70vw'
    dialogConfig.data = { item }
    this.dialog.open(ViewReportComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        // if(res === 'Success'){
        //   this.getCustomConnector()
        //   this.dynamicIndex = 2
        // }
      })

  }

  // @ViewChild('wrap') scrollElem!: ElementRef;
  // public scrollElem!: ElementRef;
  autscroll: number = 0;
  autWidth: number = 1000;
  setScroll() {
    const element = document.getElementById("auto-scroll");
    element?.addEventListener("scroll", (event) => {
      this.setnewScroll(event.target)
    });
  }

  setnewScroll(targ: any) {
    this.autscroll = targ.scrollLeft
    this.autWidth = targ.scrollWidth
  }

  scroll(pos: string) {
    const element = document.getElementById("auto-scroll");
    console.log(this.autscroll, this.autWidth);
    element?.scrollTo(pos == 'right' ? this.autWidth : 0, 0)
  }

  getTooltip() {
    return this.group.map((e: any) => e.groupName).join(', ').toUpperCase()
  }

  /////////////////////////////////////////////////////////////////////////

  onItemClick(item: any): void {
    const funcName: keyof this = item.func as keyof this;
    const method = this[funcName];
    if (typeof method === 'function') {
      (method as Function).call(this);
    } else {
      console.error(`Function ${item.func} is not defined or is not a function`);
    }
  }



  applyFilters() {
    // this.listData.filter = this.searchKey.trim().toLowerCase()
  }

  viewAdjust(): void {
    window.analytics.track("create_report_start", {
      report_name: 'Adjust Report',
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.width = "40%"
    dialogConfig.minHeight = "30vh"
    // dialogConfig.data = row
    this.dialog.open(AdjustReportComponent, dialogConfig).afterClosed()
      .subscribe(res => {

      })
  }

  viewAsana(): void {
    window.analytics.track("create_report_start", {
      report_name: 'Asana Report',
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.width = "40%"
    dialogConfig.minHeight = "30vh"
    // dialogConfig.data = row
    this.dialog.open(CreateReportDialogComponent, dialogConfig).afterClosed()
      .subscribe(res => {

      })
  }

  viewEcommerce(): void {
    window.analytics.track("create_report_start", {
      report_name: 'Ecommerce Report',
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });

    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.width = "40%"
    dialogConfig.minHeight = "30vh"
    // dialogConfig.data = row
    this.dialog.open(MagentoGaReportComponent, dialogConfig).afterClosed()
      .subscribe(res => {

      })
  }

  viewIntraday(): void {
    window.analytics.track("create_report_start", {
      report_name: 'Intraday Report',
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.width = "40%"
    dialogConfig.minHeight = "30vh"
    // dialogConfig.data = row
    this.dialog.open(IntradayReportComponent, dialogConfig).afterClosed()
      .subscribe(res => {

      })
  }

  addSource(): void {
    window.analytics.track("create_report_start", {
      report_name: 'Adsource Report',
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%"
    dialogConfig.minHeight = "30vh"
    // dialogConfig.data = row
    this.dialog.open(AddSourceReportComponent, dialogConfig).afterClosed()
      .subscribe(res => {

      })
  }

  pipedrive(): void {
    window.analytics.track("create_report_start", {
      report_name: 'Pipedrive Report',
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%"
    dialogConfig.minHeight = "30vh"
    // dialogConfig.data = row
    this.dialog.open(PipedriveReportComponent, dialogConfig).afterClosed()
      .subscribe(res => {

      })
  }


  requestDemo() {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.maxHeight = '70vh'
    dialogConfig.width = '35vw'
    this.dialog.open(RequestReportComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        // if(res === 'Success'){
        //   this.getCustomConnector()
        //   this.dynamicIndex = 2
        // }
      })

  }
}
