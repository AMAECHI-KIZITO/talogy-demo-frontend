import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-manage-group-access',
  templateUrl: './manage-group-access.component.html',
  styleUrls: ['./manage-group-access.component.scss']
})
export class ManageGroupAccessComponent implements OnInit {
  searchEmail: string = '';
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;

  loadingUsers: boolean = false;
  loadingAction: boolean = false;
  actionMessage: string = '';
  actionSuccess: boolean = false;
  actionError: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ManageGroupAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public group: any,
    private app: AppService
  ) {}

  ngOnInit(): void {
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
        error: () => {
          this.loadingUsers = false;
        }
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
    this.actionMessage = '';
    this.actionSuccess = false;
    this.actionError = false;
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.searchEmail = user.useremail || user.email;
    this.filteredUsers = [];
    this.actionMessage = '';
    this.actionSuccess = false;
    this.actionError = false;
  }

  manageAccess(decision: 'include' | 'remove') {
    if (!this.selectedUser) return;

    this.loadingAction = true;
    this.actionMessage = '';
    this.actionSuccess = false;
    this.actionError = false;

    const payload = {
      groupId: this.group._id || this.group.id,
      userId: this.selectedUser._id || this.selectedUser.id,
      decision
    };

    this.app.productService.superadminManageGroupMembership(payload)
      .subscribe({
        next: (res) => {
          this.loadingAction = false;
          if (res['status'] === true) {
            this.actionSuccess = true;
            this.actionMessage = res['message'] || `${this.selectedUser.useremail || this.selectedUser.email} group membership completed`;
            this.showAlert(this.actionMessage, 'SUCCESS');
          } else {
            this.actionError = true;
            this.actionMessage = res['message'] || 'Action failed. Please try again.';
            this.showAlert(this.actionMessage, 'ERROR');
          }
        },
        error: (err) => {
          this.loadingAction = false;
          this.actionError = true;
          this.actionMessage = err?.message || 'An error occurred. Please try again.';
          this.showAlert(this.actionMessage, 'ERROR');
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
