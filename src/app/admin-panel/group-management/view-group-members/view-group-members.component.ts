import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-view-group-members',
  templateUrl: './view-group-members.component.html',
  styleUrls: ['./view-group-members.component.scss']
})
export class ViewGroupMembersComponent implements OnInit {
  displayedColumns: string[] = ['email', 'status'];
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  memberList: any[] = [];
  loading: boolean = false;
  error: boolean = false;
  searchKey: string = '';

  constructor(
    private dialogRef: MatDialogRef<ViewGroupMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public group: any,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.loading = true;
    const groupId = this.group._id || this.group.id;
    this.app.productService.superadminGetGroupMembers(groupId)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false;
            this.error = false;
            this.memberList = res['members'] || res['data'] || [];
            this.listData = new MatTableDataSource(this.memberList);
            this.listData.paginator = this.paginator;
          } else {
            this.loading = false;
            this.error = true;
            this.memberList = [];
          }
        },
        error: () => {
          this.loading = false;
          this.error = true;
          this.memberList = [];
        }
      });
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  close() {
    this.dialogRef.close();
  }
}
