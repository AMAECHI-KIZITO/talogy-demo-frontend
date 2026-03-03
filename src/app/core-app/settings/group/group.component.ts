import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { AddNewComponent } from '../users/add-new/add-new.component';
import { InviteuserComponent } from './inviteuser/inviteuser.component';
import { DeleteGroupComponent } from './delete-group/delete-group.component';
import { alertModal } from 'src/app/services/ui.service';
import { ViewGroupUserComponent } from './view-group-user/view-group-user.component';
import { CheckRequestsComponent } from './check-requests/check-requests.component';
import { AddUserComponent } from './add-user/add-user.component';
import { GroupReportComponent } from './group-report/group-report.component';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  selection = new SelectionModel<Element>(true, []);

  groupList: any = [];
  loading: boolean = false
  searchKey: string = ''
  groupError: boolean = false

  displayedColumns: string[] = ['name', 'admin', 'role', 'time', 'member', 'action'];
  groupData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  successmsg: any;

  constructor(private app: AppService, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.getGroup()
  }

  getGroup(){
    this.loading = true
    this.app.productService.superadminRetrieveAllGroups()
    .subscribe({
      next: res => {
        this.loading = false
        this.groupList = res.groups
        this.groupData = new MatTableDataSource(this.groupList);
        this.groupData.paginator = this.paginator;
      },error: err => {
        this.loading = false
        this.groupList = []
        this.errorDialog('Error getting organisation group list')
      }
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.groupData.length;
    return numSelected === numRows;
  }

  applyFilters() {
    this.groupData.filter = this.searchKey.trim().toLowerCase();
  }

  successDialog(item: any, msg: string){
    let alert: alertModal = {
      details: item,
      message: msg || 'Process Completed',
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

  createGroup() {
    // window.analytics.track('button_clicked', {
    //   button_name: 'invite_user',
    //   username: this.app.helperService.getClientname(),
    //   datae_user_id: this.app.helperService.getActiveid(),
    //   company_plan: this.app.helperService.getTrial(),
    //   user_title: this.app.helperService.getRole(),
    //   company_name: this.app.helperService.getOrg(),
    // });

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.minWidth = '35vw';
    this.dialog
      .open(InviteuserComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res === 'Added') {
          this.getGroup();
        }
      });
  }

  checkRequests(row:any) {
    // window.analytics.track('button_clicked', {
    //   button_name: 'invite_user',
    //   username: this.app.helperService.getClientname(),
    //   datae_user_id: this.app.helperService.getActiveid(),
    //   company_plan: this.app.helperService.getTrial(),
    //   user_title: this.app.helperService.getRole(),
    //   company_name: this.app.helperService.getOrg(),
    // });

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.minWidth = '35vw';
    dialogConfig.data = row;
    this.dialog
      .open(CheckRequestsComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res === 'Added') {
          this.getGroup();
        }
      });
  }

  veiwUser(row:any) {
    // window.analytics.track('button_clicked', {
    //   button_name: 'invite_user',
    //   username: this.app.helperService.getClientname(),
    //   datae_user_id: this.app.helperService.getActiveid(),
    //   company_plan: this.app.helperService.getTrial(),
    //   user_title: this.app.helperService.getRole(),
    //   company_name: this.app.helperService.getOrg(),
    // });

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.minWidth = '35vw';
    dialogConfig.data = row;
    this.dialog
      .open(ViewGroupUserComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        
      });
  }

  addMembers(row:any) {
    // window.analytics.track('button_clicked', {
    //   button_name: 'invite_user',
    //   username: this.app.helperService.getClientname(),
    //   datae_user_id: this.app.helperService.getActiveid(),
    //   company_plan: this.app.helperService.getTrial(),
    //   user_title: this.app.helperService.getRole(),
    //   company_name: this.app.helperService.getOrg(),
    // });

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.minWidth = '35vw';
    dialogConfig.data = row;
    this.dialog
      .open(AddUserComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        
      });
  }

  requestAccess(row: any){
    this.app.productService.requestAccesstoGroup(row.groupId)
    .subscribe({
      next: res => {
        this.successDialog(res.message, 'Success')
        this.getGroup()
      }, error: err => {
        this.errorDialog(err.error.message)
      }
    })
  }

  manageReports(row: any){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.minWidth = '35vw';
    dialogConfig.data = row;
    this.dialog
      .open(GroupReportComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        
      });
  }


  // delete(row: any) {
  //   // window.analytics.track('delete_report_start', {
  //   //   report_name: row.reportname,
  //   //   username: this.app.helperService.getEmail().split('@')[0],
  //   //   datae_user_id: this.app.helperService.getActiveid(),
  //   //   plan_type: this.app.helperService.getTrial(),
  //   //   user_role: this.app.helperService.getRole(),
  //   //   organisation_name: this.app.helperService.getOrg(),
  //   // });
  //   let dialogConfig = new MatDialogConfig();

  //   dialogConfig.panelClass = 'dialog-container';
  //   dialogConfig.height = 'auto';
  //   dialogConfig.data = row;

  //   this.dialog
  //     .open(DeleteGroupComponent, dialogConfig)
  //     .afterClosed()
  //     .subscribe((res) => {
  //       if (res === 'deleted') {
  //         this.successmsg = res['message']
  //         this.successDialog(this.successmsg)
  //         this.getGroup()
  //       }
  //     });
  // }

}
