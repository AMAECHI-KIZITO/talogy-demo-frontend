import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { AddNewComponent } from './add-new/add-new.component';
import { ViewUserComponent } from './view-user/view-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  selection = new SelectionModel<Element>(true, []);
  searchKey: string = '';
  myInnerHeight = window.innerHeight - 301;
  displayedColumns: string[] = ['select', 'user', 'email', 'role', 'action'];
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  accountList: any;
  userList: any;
  userError: boolean = false;
  loading: boolean = false;

  constructor(private app: AppService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.loading = true;
    this.app.productService.getUserList().subscribe({
      next: (res) => {
        if (res['status'] === true) {
          this.loading = false;
          this.userError = false;
          this.userList = res['data'].totalOrganizationUsers;

          this.listData = new MatTableDataSource(this.userList);
          this.listData.paginator = this.paginator;
        } else {
          this.loading = false;
          this.userError = true;
          this.userList = [];
        }
      },
      error: (err) => {
        this.loading = false;
        this.userError = true;
        this.userList = [];
      },
    });
  }
  applyFilters() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.listData.data.forEach((element: any) =>
          this.selection.select(element)
        );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;
  }

  getInitials(string: any) {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  addUser(row: any, check: any) {
    window.analytics.track('button_clicked', {
      button_name: 'invite_user',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.minWidth = '35vw';
    dialogConfig.data = { row, check };
    this.dialog
      .open(AddNewComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res === 'Added') {
          this.getUser();
        }
      });
  }

  editUser(row: any, check: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.minWidth = '35vw';
    dialogConfig.data = { row, check };
    this.dialog
      .open(AddNewComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res === 'Updated') {
          this.getUser();
        }
      });
  }

  viewUser(row: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = '65vh';
    dialogConfig.minWidth = '35vw';
    dialogConfig.data = row;
    this.dialog
      .open(ViewUserComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        // if(res === 'Updated'){
        //   this.getUser()
        // }
      });
  }
}
