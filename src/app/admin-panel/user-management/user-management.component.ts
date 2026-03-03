import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { InviteUserComponent } from './invite-user/invite-user.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['email', 'dateOnboarded', 'status', 'lastLogin'];
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  userList: any = [];
  loading: boolean = false;
  error: boolean = false;
  searchKey: string = '';

  constructor(private app: AppService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.app.productService.listSuperadminUsers()
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false;
            this.error = false;
            this.userList = res['users'];
            this.listData = new MatTableDataSource(this.userList);
            this.listData.paginator = this.paginator;
          } else {
            this.loading = false;
            this.error = true;
            this.userList = [];
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = true;
          this.userList = [];
        }
      });
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  inviteUser() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '35vw';
    this.dialog.open(InviteUserComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res === 'invited') {
          this.getUsers();
        }
      });
  }
}
