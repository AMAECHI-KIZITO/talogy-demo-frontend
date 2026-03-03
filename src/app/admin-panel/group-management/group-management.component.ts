import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { ViewGroupMembersComponent } from './view-group-members/view-group-members.component';
import { ManageGroupAccessComponent } from './manage-group-access/manage-group-access.component';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss']
})
export class GroupManagementComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'action'];
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  groupList: any[] = [];
  loading: boolean = false;
  error: boolean = false;
  searchKey: string = '';

  constructor(private app: AppService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getGroups();
  }

  getGroups() {
    this.loading = true;
    this.app.productService.superadminRetrieveAllGroups()
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false;
            this.error = false;
            this.groupList = res['groups'] || res['data'] || [];
            this.listData = new MatTableDataSource(this.groupList);
            this.listData.paginator = this.paginator;
          } else {
            this.loading = false;
            this.error = true;
            this.groupList = [];
          }
        },
        error: () => {
          this.loading = false;
          this.error = true;
          this.groupList = [];
        }
      });
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  viewMembers(group: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '45vw';
    dialogConfig.data = group;
    this.dialog.open(ViewGroupMembersComponent, dialogConfig);
  }

  manageAccess(group: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '40vw';
    dialogConfig.data = group;
    this.dialog.open(ManageGroupAccessComponent, dialogConfig);
  }
}
