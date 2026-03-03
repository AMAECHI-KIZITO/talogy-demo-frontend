import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-manage-group-report-access',
  templateUrl: './manage-group-report-access.component.html',
  styleUrls: ['./manage-group-report-access.component.scss']
})
export class ManageGroupReportAccessComponent implements OnInit {
  groupAccessList: any[] = [];
  loadingAccess: boolean = false;
  revokingGroupId: string = '';

  allGroups: any[] = [];
  searchGroup: string = '';
  filteredGroups: any[] = [];
  selectedGroup: any = null;

  loadingGroups: boolean = false;
  grantLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ManageGroupReportAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public report: any,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.loadGroupAccess();
    this.loadAllGroups();
  }

  loadGroupAccess() {
    this.loadingAccess = true;
    this.app.productService.superadminGetReportGroupAccess(this.report._id)
      .subscribe({
        next: (res) => {
          this.loadingAccess = false;
          if (res['status'] === true) {
            this.groupAccessList = res['groups'] || res['data'] || [];
          } else {
            this.groupAccessList = [];
          }
        },
        error: () => {
          this.loadingAccess = false;
          this.groupAccessList = [];
        }
      });
  }

  loadAllGroups() {
    this.loadingGroups = true;
    this.app.productService.superadminRetrieveAllGroups()
      .subscribe({
        next: (res) => {
          this.loadingGroups = false;
          if (res['status'] === true) {
            this.allGroups = res['groups'] || res['data'] || [];
          }
        },
        error: () => { this.loadingGroups = false; }
      });
  }

  onSearchChange() {
    const query = this.searchGroup.trim().toLowerCase();
    if (query.length < 2) {
      this.filteredGroups = [];
      return;
    }
    this.filteredGroups = this.allGroups.filter(g =>
      (g.groupName || g.name || '').toLowerCase().includes(query)
    );
    this.selectedGroup = null;
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.searchGroup = group.groupName || group.name;
    this.filteredGroups = [];
  }

  grantGroupAccess() {
    if (!this.selectedGroup) return;
    this.grantLoading = true;
    const payload = { groupId: this.selectedGroup._id || this.selectedGroup.id };
    this.app.productService.superadminGrantGroupReportAccess(this.report._id, payload)
      .subscribe({
        next: (res) => {
          this.grantLoading = false;
          if (res['status'] === true) {
            this.showAlert('Group access granted successfully', 'SUCCESS');
            this.selectedGroup = null;
            this.searchGroup = '';
            this.loadGroupAccess();
          } else {
            this.showAlert(res['message'] || 'Failed to grant access', 'ERROR');
          }
        },
        error: (err) => {
          this.grantLoading = false;
          this.showAlert(err?.message || 'An error occurred', 'ERROR');
        }
      });
  }

  revokeGroupAccess(group: any) {
    const groupId = group._id || group.id;
    this.revokingGroupId = groupId;
    this.app.productService.superadminRevokeGroupReportAccess(this.report._id, { groupId })
      .subscribe({
        next: (res) => {
          this.revokingGroupId = '';
          if (res['status'] === true) {
            this.groupAccessList = this.groupAccessList.filter(g =>
              (g._id || g.id) !== groupId
            );
            this.showAlert('Group access revoked', 'SUCCESS');
          } else {
            this.showAlert(res['message'] || 'Failed to revoke access', 'ERROR');
          }
        },
        error: (err) => {
          this.revokingGroupId = '';
          this.showAlert(err?.message || 'An error occurred', 'ERROR');
        }
      });
  }

  showAlert(message: string, type: 'SUCCESS' | 'ERROR') {
    let alert: alertModal = {
      details: message,
      message: type === 'SUCCESS' ? 'Success' : 'Error',
      type,
      duration: 5000
    };
    this.app.ui.setAlertStatus(alert);
  }

  close() {
    this.dialogRef.close();
  }
}
