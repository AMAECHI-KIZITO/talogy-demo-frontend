import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-manage-user-access',
  templateUrl: './manage-user-access.component.html',
  styleUrls: ['./manage-user-access.component.scss']
})
export class ManageUserAccessComponent implements OnInit {
  accessList: any[] = [];
  revokingUserId: string = '';

  allUsers: any[] = [];
  searchEmail: string = '';
  filteredUsers: any[] = [];
  selectedUser: any = null;
  durationInDays: number = 7;

  loadingUsers: boolean = false;
  grantLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ManageUserAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public report: any,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.accessList = [...(this.report.personalAccess || [])];
    this.loadUsers();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.app.productService.listSuperadminUsers()
      .subscribe({
        next: (res) => {
          this.loadingUsers = false;
          if (res['status'] === true) {
            this.allUsers = res['users'] || [];
          }
        },
        error: () => { this.loadingUsers = false; }
      });
  }

  onSearchChange() {
    const query = this.searchEmail.trim().toLowerCase();
    if (query.length < 2) {
      this.filteredUsers = [];
      return;
    }
    this.filteredUsers = this.allUsers.filter(u =>
      (u.useremail || u.email || '').toLowerCase().includes(query)
    );
    this.selectedUser = null;
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.searchEmail = user.useremail || user.email;
    this.filteredUsers = [];
  }

  grantAccess() {
    if (!this.selectedUser) return;
    this.grantLoading = true;
    const payload = {
      userId: this.selectedUser._id || this.selectedUser.id,
      durationInDays: this.durationInDays || 7
    };
    this.app.productService.superadminGrantUserReportAccess(this.report._id, payload)
      .subscribe({
        next: (res) => {
          this.grantLoading = false;
          if (res['status'] === true) {
            this.showAlert('User access granted successfully', 'SUCCESS');
            this.selectedUser = null;
            this.searchEmail = '';
            this.durationInDays = 7;
            if (res['data']?.personalAccess) {
              this.accessList = res['data'].personalAccess;
            }
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

  revokeAccess(access: any) {
    const userId = access.userId?._id || access.userId;
    this.revokingUserId = userId;
    this.app.productService.superadminRevokeUserReportAccess(this.report._id, { userId })
      .subscribe({
        next: (res) => {
          this.revokingUserId = '';
          if (res['status'] === true) {
            this.accessList = this.accessList.filter(a =>
              (a.userId?._id || a.userId) !== userId
            );
            this.showAlert('User access revoked', 'SUCCESS');
          } else {
            this.showAlert(res['message'] || 'Failed to revoke access', 'ERROR');
          }
        },
        error: (err) => {
          this.revokingUserId = '';
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
