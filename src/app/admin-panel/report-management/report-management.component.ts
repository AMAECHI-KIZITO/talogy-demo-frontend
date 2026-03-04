import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { adminReportPayload } from 'src/app/model/productModel';
import { DeleteReportComponent } from './delete-report/delete-report.component';
import { EmbedReportComponent } from './embed-report/embed-report.component';
import { ManageUserAccessComponent } from './manage-user-access/manage-user-access.component';
import { InviteExternalUserComponent } from './invite-external-user/invite-external-user.component';
import { ManageGroupReportAccessComponent } from './manage-group-report-access/manage-group-report-access.component';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.scss']
})
export class ReportManagementComponent implements OnInit {

  reportList: any[] = [];
  reportError: boolean = false;
  loading: boolean = false;

  orgList: any[] = [];
  orgListFilter: any[] = [];
  orgloading: boolean = false;

  filter: FormGroup;
  statusLoadingId: string = '';

  searchKey: string = '';
  displayedColumns: string[] = ['name', 'type', 'status', 'platform', 'action'];
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private app: AppService, private fb: FormBuilder, private dialog: MatDialog) {
    this.filter = this.fb.group({ org: [''] });
  }

  ngOnInit(): void {
    this.getReport();
    this.getOrg();
  }

  getReport() {
    this.loading = true;
    this.app.productService.getReports(1)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false;
            this.reportError = false;
            this.reportList = res.reports || [];
            this.listData = new MatTableDataSource(this.reportList);
            this.listData.paginator = this.paginator;
          } else {
            this.loading = false;
            this.reportError = true;
            this.reportList = [];
          }
        },
        error: () => {
          this.loading = false;
          this.reportError = true;
          this.reportList = [];
        }
      });
  }

  getOrg() {
    this.orgloading = true;
    this.app.productService.getOrganisation()
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.orgloading = false;
            this.orgList = res['organizations'];
            this.orgListFilter = this.orgList;
          } else {
            this.orgloading = false;
            this.orgList = [];
          }
        },
        error: () => {
          this.orgloading = false;
          this.orgList = [];
        }
      });
  }

  applyFilters() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  onKeyOrg(value: string) {
    this.orgList = this.searchOrg(value);
  }

  reset() {
    this.onKeyOrg('');
  }

  searchOrg(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value === '') return this.orgListFilter;
    return this.orgListFilter.filter((option: any) =>
      option.organizationName?.toString().toLowerCase().startsWith(keyWord)
    );
  }

  embedReport() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '30%';
    this.dialog.open(EmbedReportComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res === 'cloned') this.getReport();
      });
  }

  manageUserAccess(row: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '45vw';
    dialogConfig.data = row;
    this.dialog.open(ManageUserAccessComponent, dialogConfig);
  }

  inviteExternalUser(row: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '38vw';
    dialogConfig.data = row;
    this.dialog.open(InviteExternalUserComponent, dialogConfig);
  }

  manageGroupAccess(row: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '45vw';
    dialogConfig.data = row;
    this.dialog.open(ManageGroupReportAccessComponent, dialogConfig);
  }

  updateStatus(row: any) {
    const desiredStatus = row.status === 'enabled' ? 'disable' : 'enable';
    this.statusLoadingId = row._id;
    let payload = new adminReportPayload();
    payload.reportId = row._id;
    payload.desiredStatus = desiredStatus;

    this.app.productService.updateStatusReportAdmin(payload)
      .subscribe({
        next: (res) => {
          this.statusLoadingId = '';
          if (res['status'] === true) {
            this.getReport();
          } else {
            this.errorDialog(res['message']);
          }
        },
        error: (err) => {
          this.statusLoadingId = '';
          this.errorDialog(err);
        }
      });
  }

  delete(row: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.data = row;
    this.dialog.open(DeleteReportComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res === 'deleted') this.getReport();
      });
  }

  getInitials(string: any) {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  errorDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000
    };
    this.app.ui.setAlertStatus(alert);
  }
}
