import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';
import { AddSourceReportComponent } from './add-source-report/add-source-report.component';
import { AdjustReportComponent } from './adjust-report/adjust-report.component';
import { CreateReportDialogComponent } from './create-report-dialog/create-report-dialog.component';
import { IntradayReportComponent } from './intraday-report/intraday-report.component';
import { MagentoGaReportComponent } from './magento-ga-report/magento-ga-report.component';
import { Router } from '@angular/router';
import { RequestReportComponent } from './request-report/request-report.component';
import { PipedriveReportComponent } from './pipedrive-report/pipedrive-report.component';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit {
  searchKey: string = '';

  // list = [
  //   { name: "Adjust", func: 'viewAdjust', instyle: "adjust-set" },
  //   { name: "Asana", func: 'viewAsana', instyle: "asana-set" },
  //   { name: "Ecommerce Marketing", func: 'viewEcommerce', instyle: "eccomerce-set" },
  //   { name: "Intraday", func: 'viewIntraday', instyle: "eccomerce-intra-set" },
  //   { name: "Ad Source", func: 'addSource', instyle: "adsource-set" },
  //   { name: "Pipedrive", func: 'pipedrive', instyle: "pipedrive-set" }
  // ];

    autolist = [
    { name: "Adjust Report", dname: "Adjust", info: 'Track and analyze mobile attribution and campaign performance.', image: 'https://fivetran.com/integrations/adjust/resources/adjust-logo.svg', func: 'viewAdjust' },
    { name: "Asana Report", dname: "Asana", info: 'Get insights into project progress, tasks, and team productivity from Asana.', image: 'https://datae-production-backend-0f31308833e3.herokuapp.com/asana.svg', func: 'viewAsana' },
    { name: "Ecommerce Marketing", dname: "Ecommerce Marketing", info: 'Monitor key marketing metrics and performance for your online store.', image: '../../../assets/svg/mangentoads.svg', func: 'viewEcommerce' },
    { name: "Intraday Report", dname: "Intraday", info: 'Monitor key marketing metrics and performance for your online store.', image: '../../../assets/newbrandimg/intraday.png', func: 'viewIntraday' },
    { name: "Adsource Report", dname: "Ad Source", info: 'Monitor key marketing metrics and performance for your online store.', image: '../../../assets/newbrandimg/ad_source.png', func: 'addSource' },
    { name: "Pipedrive Report", dname: "Pipedrive", info: 'Monitor key marketing metrics and performance for your online store.', image: '../../../assets/svg/pipedrive.svg', func: 'pipedrive' },
  ];

  reportList: any = []

  templates: any = []

  finalTemplate: any = []

  constructor(private breadcrumb: BreadcrumbService, private router: Router, private dialog: MatDialog, private app: AppService) { 
    let history;
    this.breadcrumb.breadcrumbObs$.subscribe(
      (item)=>{
        history = item
      }
    )

    this.breadcrumb.updateBreadcrumb({
      parent: 'Create Report',
      parentLink: 'create-report',
      children: []
    })
  }


  ngOnInit(): void {
   
   this.checkTemplate()
  }

  checkTemplate(){
    this.reportList = this.autolist
    this.templates = this.app.helperService.getReportTemplate()
    // this.templates.push('Pipedrive')
    this.finalTemplate = this.filterMatchingNames(this.templates, this.reportList)

  
  }

  filterMatchingNames(names:any, list:any) {
    return list.filter((item:any) => names.includes(item.dname));
  }
  

  onItemClick(item: any): void {
    const funcName: keyof this = item.func as keyof this;
    const method = this[funcName];
    if (typeof method === 'function') {
      (method as Function).call(this);
    } else {
      console.error(`Function ${item.func} is not defined or is not a function`);
    }
  }
  


  applyFilters(){
    // this.listData.filter = this.searchKey.trim().toLowerCase()
  }
  clearSearch(){
    this.searchKey = '';
    this.applyFilters();
  }

  viewAdjust(): void{
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
    .subscribe( res => {

    })
  }

  viewAsana() : void{
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
    .subscribe( res => {

    })
  }

  viewEcommerce() : void{
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
    .subscribe( res => {

    })
  }

  viewIntraday() : void{
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
    .subscribe( res => {

    })
  }

  addSource() : void{
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
    .subscribe( res => {

    })
  }

  pipedrive() : void{
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
    .subscribe( res => {

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
