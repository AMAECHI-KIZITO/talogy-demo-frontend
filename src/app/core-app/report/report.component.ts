import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import {
  getDate,
  getEndDayMonth,
  getFirstDayYear,
  todayFullDate,
} from 'src/app/helpers/dateformat';
import { MessageUtil } from 'src/app/helpers/messages';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';
import { pausePayload } from 'src/app/model/clientInfo';
import {
  reportAccessPayload,
  updateReportPayload,
} from 'src/app/model/productModel';
import { DeleteReportComponent } from './delete-report/delete-report.component';
import { ManageAccessComponent } from './manage-access/manage-access.component';
import { ViewAccessComponent } from './view-access/view-access.component';
import { DisableAccessComponent } from './disable-access/disable-access.component';
import { MatDrawer } from '@angular/material/sidenav';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  dynamicIndex: number = 0;
  searchKey: string = '';
  searchUserKey: string = '';
  reportList: any;
  filter: FormGroup;
  startDate = getFirstDayYear(new Date());
  endDate = getEndDayMonth();
  maxDate = todayFullDate();
  list: any;
  loading: boolean = false;
  accessListLoader: boolean = false;
  accessError: boolean = false;
  errorList: boolean = false;
  tempArray: any = [];
  id: any;
  nextDateTimestamp: any;
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;
  myInnerHeight = window.innerHeight - 301;
  displayedColumns: string[] = [
    'report_name',
    'type',
    'connector_name',
    'source',
    'action',
  ];

  pauseLoading: boolean = false;
  pauseError: boolean = false;
  reportTypeFilter: any = [];

  reporttypeLoading: boolean = false;
  reporttypeError: boolean = false;
  reporttype: any = [];
  trial: any;

  userAccessList: any;

  myAccessList: any;

  mode: boolean = false;

  selectedItem: any;

  disableloading: boolean = false;

  form: FormGroup;
  username: any;

  userList: any;
  userListFilter: any;
  userError: boolean = false;
  userloading: boolean = false;

  showadd: boolean = false;

  addloading: boolean = false;
  setSuccess: boolean = false;
  error: boolean = false;

  userId: any;

  @ViewChild('drawer') drawer!: MatDrawer;

  myreportId: any;

  reportStatus = [
    {name: "Enabled", value: "enabled"},
    {name: "Disabled", value: "disabled"},
  ]
  successmsg: any;
  perm: boolean = false;

  constructor(
    private breadcrumb: BreadcrumbService,
    private fb: FormBuilder,
    public route: Router,
    private app: AppService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      perm: [true],
      startdate: [],
      enddate: [],
    });

    this.username = this.app.helperService.getEmail();
    this.userId = this.app.helperService.getActiveid();

    this.filter = this.fb.group({
      type: [''],
      status: [''],
    });
    let history;
    this.breadcrumb.breadcrumbObs$.subscribe((item) => {
      history = item;
    });

    this.breadcrumb.updateBreadcrumb({
      parent: 'My Reports',
      parentLink: 'report',
      children: [],
    });
  }

  ngOnInit(): void {
    this.getList('');
    this.getReportType();

    this.trial = this.app.helperService.getTrial();
  }

  preventDefaultOnClick(event: MouseEvent) {
    event.preventDefault();
  }

  handleClick() {
    this.mode = false;
    window.analytics.track('filter_my_reports_start', {
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });
  }

  getReportType() {
    this.reporttypeLoading = true;
    this.app.productService.getReportType().subscribe({
      next: (res) => {
        if (res['status'] === true) {
          this.reporttypeLoading = false;
          this.reporttypeError = false;
          this.reporttype = res['reportTypes'];
          this.reportTypeFilter = this.reporttype;
        } else {
          this.reporttypeLoading = false;
          this.reporttypeError = true;
          this.reporttype = [];
        }
      },
      error: (err) => {
        this.reporttypeLoading = false;
        this.reporttypeError = true;
        this.reporttype = [];
      },
    });
  }

  submit() {
    this.addloading = true;
    let payload = new reportAccessPayload();

    console.log(this.form.value);
    

    payload.accessList = this.form.value.name;
    payload.permission = 'grant';
    payload.reportId = this.myreportId;
    // payload.duration = !this.perm ? new Date(this.form.value.date).toISOString() : '2040-12-31T10:00'
    payload.startDuration = this.form.value.startdate ?? new Date(this.form.value.startdate).toISOString()
    payload.endDuration = this.form.value.enddate ? new Date(this.form.value.enddate).toISOString() : '2040-12-31T10:00'
    console.log(payload, 'payload');
    
    this.app.productService.reportAccess(payload).subscribe({
      next: (res) => {
        if (res['status'] == true) {
          this.addloading = false;
          this.showadd = false;
          this.setSuccess = true;
          this.form.reset();
          this.showadd = false
          this.successDialog(res['message'])
          // this.drawer.close();
          this.getAccessList();
        } else {
          this.addloading = false;
          this.error = true;
          this.errorDialog(res['message']);
        }
      },
      error: (err) => {
        this.addloading = false;
        this.error = true;
        this.errorDialog(err);
      },
    });
  }

  disable(item: any) {
    item.addloading = true;
    let payload = new reportAccessPayload();

    payload.accessList = [item._id];
    payload.permission = 'revoke';
    payload.reportId = this.myreportId;

    this.app.productService.reportAccess(payload).subscribe({
      next: (res) => {
        if (res['status'] == true) {
          item.addloading = false;
          this.showadd = false;
          this.setSuccess = true;
          this.successDialog(res['message'])
          this.getAccessList()
     
        } else {
          item.addloading = false;
          this.error = true;
          this.errorDialog(res['message']);
        }
      },
      error: (err) => {
        item.addloading = false;
        this.error = true;
        this.errorDialog(err);
      },
    });
  }

successDialog(item: any){
  let alert: alertModal = {
    details: item,
    message: 'Process Completed',
    type: 'SUCCESS',
    duration: 10000
  }
  this.app.ui.setAlertStatus(alert)
}

errorDialog(item:any){
  let alert: alertModal = {
    details: item,
    message: 'Process Failed',
    type: 'ERROR',
    duration: 10000
  }
  this.app.ui.setAlertStatus(alert)
}


getUser(){
  this.userloading = true
  this.app.productService.getUserList()
  .subscribe({
    next: (res) => {
      if(res['status'] === true){
        this.userloading = false
        this.userError = false
        this.userList = res['data'].totalOrganizationUsers

          // Filter out the logged-in user
          this.userList = this.userList.filter(
            (user: any) => user.userEmail !== this.username
          );

          this.userList = this.getAvailableUsers(
            this.userList,
            this.myAccessList
          );

          this.userListFilter = this.userList;
        } else {
          this.userloading = false;
          this.userError = true;
          this.userList = [];
        }
      },
      error: (err) => {
        this.userloading = false;
        this.userError = true;
        this.userList = [];
      },
    });
  }

  getAvailableUsers(totalOrganizationUsers: any, usersWithAccess: any) {
    // Extract the user IDs of users who already have access
    const accessUserIds = usersWithAccess.map((user: any) => user._id);

    // Filter the total users to exclude those with access
    const availableUsers = totalOrganizationUsers.filter(
      (user: any) => !accessUserIds.includes(user.userId)
    );

    return availableUsers;
  }

  getNextDateTimestamp(refreshDateStr: string) {
    const refreshDate = new Date(refreshDateStr); // Parse the given refresh date
    refreshDate.setHours(refreshDate.getHours() + 24); // Add 24 hours
  
    return refreshDate.toISOString(); // Return updated timestamp
  }

  getTimeFromTimestamp(timestamp: any) {
    const dateObject = new Date(timestamp);
    const hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const seconds = dateObject.getUTCSeconds();

    const period = hours < 12 ? 'AM' : 'PM';

    const twelveHourFormat = `${String(hours % 12 || 12).padStart(
      2,
      '0'
    )}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )} ${period}`;

    return twelveHourFormat;
  }

  convertTimestampToDate(timestamp: any) {
    const dateObject = new Date(timestamp);
    const year = dateObject.getUTCFullYear() % 100; // Get the last two digits of the year
    const month = dateObject.getUTCMonth() + 1; // Months are zero-indexed, so add 1
    const day = dateObject.getUTCDate();

    // Format the date as M/D/YY
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  }

  getList(item: any) {
    this.loading = true;

    this.tempArray = [];
    let type = this.filter.value.type ? this.filter.value.type : 'null';
    let status = this.filter.value.status ? this.filter.value.status : 'null';
    this.app.productService.getBasicReport(type, status).subscribe({
      next: (res) => {
        if (res['status'] === true) {
          if (item == 'Refresh') {
            window.analytics.track('refresh_reports', {
              username: this.app.helperService.getEmail().split('@')[0],
              datae_user_id: this.app.helperService.getActiveid(),
              plan_type: this.app.helperService.getTrial(),
              user_role: this.app.helperService.getRole(),
              organisation_name: this.app.helperService.getOrg(),
            });
          }
          if (item == 'Filter') {
            window.analytics.track('filter_my_reports_apply', {
              type: this.filter.value.type ? this.filter.value.type : 'null',
              status: this.filter.value.status
                ? this.filter.value.status
                : 'null',
              username: this.app.helperService.getEmail().split('@')[0],
              datae_user_id: this.app.helperService.getActiveid(),
              plan_type: this.app.helperService.getTrial(),
              user_role: this.app.helperService.getRole(),
              organisation_name: this.app.helperService.getOrg(),
            });
          }
          this.loading = false;

          this.list = res['reports'];
          this.listData = new MatTableDataSource(this.list);
          this.reportList = this.list;
          this.errorList = false;
        } else {
          this.loading = false;

          this.errorList = true;
          this.reportList = [];
          // this.app.snackBar.open(res['message'], 'Dismiss', {
          //   duration: MessageUtil.TIMEOUT_DURATION,
          //   panelClass: ['custom-snackbar']
          // })
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorList = true;
        this.reportList = [];
      },
    });
  }

  getAccessList() {
    this.accessListLoader = true;
    this.tempArray = [];
    let type = this.filter.value.type ? this.filter.value.type : 'null';
    let status = this.filter.value.status ? this.filter.value.status : 'null';
    this.app.productService.getBasicReport(type, status).subscribe({
      next: (res) => {
        if (res['status'] === true) {
          this.accessListLoader = false;
          this.list = res['reports'];
          this.reportList = this.list;
          let temItemp = this.reportList.find(
            (e: any) => e._id == this.selectedItem._id
          );
          if (temItemp) this.setMode(temItemp);

          this.errorList = false;
          // this.app.snackBar.open(res['message'], 'Dismiss', {
          //   duration: MessageUtil.TIMEOUT_DURATION,
          //   panelClass: ['custom-snackbar']
          // })
        } else {
          this.accessListLoader = false;
          this.errorList = true;
          this.reportList = [];
          this.app.snackBar.open(res['message'], 'Dismiss', {
            duration: MessageUtil.TIMEOUT_DURATION,
            panelClass: ['custom-snackbar'],
          });
        }
      },
      error: (err) => {
        this.accessListLoader = false;
        this.errorList = true;
        this.reportList = [];
      },
    });
  }

  gotoRoute() {
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

  pauseReport(item: any) {
    this.pauseLoading = true;
    let payload = new updateReportPayload();
    payload.reportId = item._id;
    payload.userId = this.app.helperService.getActiveid();
    this.app.productService.updateStatusReport(payload).subscribe({
      next: (res) => {
        if(res['status'] == true){
          this.pauseLoading = false
          this.successmsg = res['message']
          this.successDialog(this.successmsg)
          this.getList('')
          if(item.status === 'enabled'){
            window.analytics.track("disable_report", {
              report_name: item.reportname,
              report_source: item.reportource,
              report_type: item.reporttype,
              username: this.app.helperService.getEmail().split('@')[0],
              datae_user_id: this.app.helperService.getActiveid(),
              plan_type: this.app.helperService.getTrial(),
              user_role: this.app.helperService.getRole(),
              organisation_name: this.app.helperService.getOrg(),
            });
          } else {
            window.analytics.track('enable_report', {
              report_name: item.reportname,
              report_source: item.reportource,
              report_type: item.reporttype,
              username: this.app.helperService.getEmail().split('@')[0],
              datae_user_id: this.app.helperService.getActiveid(),
              plan_type: this.app.helperService.getTrial(),
              user_role: this.app.helperService.getRole(),
              organisation_name: this.app.helperService.getOrg(),
            });
          }
        } else if (res['status'] == false) {
          this.pauseLoading = false;
          this.pauseError = true;
          this.errorDialog(res['message']);
        }
      },
      error: (err) => {
        this.pauseLoading = false;
        this.errorDialog(err);
      },
    });
  }

  submitFilter() {}

  add24(date: Date){
    let dt = new Date(date)
    return new Date(dt.setHours(dt.getHours() + 24))
  }

  setMode(item: any) {
    this.selectedItem = item;
    this.mode = true;
    this.myAccessList = item.accessList;
    this.myreportId = item._id;
    this.userAccessList = this.myAccessList;
  }

  showAdd() {
    this.showadd = true;
    this.getUser();
  }
  hideAdd() {
    this.showadd = false;
  }

  formatStartDate(event: any) {
    this.startDate = getDate(event.value);
  }

  formatEndDate(event: any) {
    this.endDate = getDate(event.value);
  }

  viewReport(item: any) {
    if (this.trial === 'Preview') {
      this.errorDialog(
        'Your preview status currently limits access to this feature. A full subscription is required to continue.'
      );
    } else {
  
      
      window.analytics.track('view_report', {
        report_name: item.reportname,
        report_type: item.reporttype,
        report_source: item.reportource.join(','),
        report_status: item.status,
        username: this.app.helperService.getEmail().split('@')[0],
        datae_user_id: this.app.helperService.getActiveid(),
        plan_type: this.app.helperService.getTrial(),
        user_role: this.app.helperService.getRole(),
        organisation_name: this.app.helperService.getOrg(),
      });
      let tempItem = {
        reporturl: item.platformReportLink,
        type: item.reportPlatform,
      };
      this.route.navigate(['/app/report/report-view'], {
        queryParams: {
          workspaceid: item.workspaceid,
          reportid: item.reportid,
          id: item._id,
          datasetid: item.reportdatasetid,
          data: JSON.stringify(tempItem),
        },
      });
    }
  }

  delete(row: any) {
    window.analytics.track('delete_report_start', {
      report_name: row.reportname,
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });
    let dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.data = row;

    this.dialog
      .open(DeleteReportComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res === 'deleted') {
          this.successmsg = res['message']
          this.successDialog(this.successmsg)
          this.getList('')
        }
      });
  }

  reset() {
    this.onKey('');
  }

  onKey(value: string) {
    this.reporttype = this.search(value);
  }

  search(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.reportTypeFilter;
    }
    return this.reportTypeFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord);
      }
    });
  }

  resetUser() {
    this.onKeyUser('');
  }

  onKeyUser(value: string) {
    this.userList = this.searchUser(value);
  }
  searchUser(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.userListFilter;
    }
    return this.userListFilter.filter((option: any) => {
      if (option.userName) {
        return option.userName.toString().toLowerCase().startsWith(keyWord);
      }
    });
  }

  applyFilters() {
    this.reportList.filter = this.searchKey.trim().toLowerCase();
  }
  filters() {
    let val = this.searchUserKey.toLowerCase().trim(); // Convert search key to lowercase and remove leading/trailing spaces
    if (val === '') {
      // If search key is empty, return the original list
      this.myAccessList = this.userAccessList.slice(); // Assuming you have a copy of the original list stored in 'originalReportList'
      return;
    }
    this.myAccessList = this.myAccessList.filter((el: any) => {
      if (el.useremail.toLowerCase().includes(val)) {
        return el; // If name includes the search key, keep it in the list
      }
    });
  }

  manageAccess(row: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '35vw';
    dialogConfig.data = row;
    this.dialog
      .open(ManageAccessComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res === 'success') {
          this.getList('');
        }
      });
  }

  disableAccess(row: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '35vw';
    dialogConfig.data = row;
    this.dialog
      .open(DisableAccessComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        // if(res === 'success'){
        //   this.getList('')
        // }
      });
  }

  clearSearch() {
    this.searchKey = '';
    this.filters();
  }
}
