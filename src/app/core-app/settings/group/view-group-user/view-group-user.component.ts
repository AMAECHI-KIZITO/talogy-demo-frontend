import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { acceptOrRejectRequest } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-view-group-user',
  templateUrl: './view-group-user.component.html',
  styleUrls: ['./view-group-user.component.scss']
})
export class ViewGroupUserComponent implements OnInit {

  loading: boolean = false
  userList: any

  displayedColumns: string[] = ['name', 'org',];
  userData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private app: AppService, private dialog: MatDialogRef<ViewGroupUserComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow: any) { }

  ngOnInit(): void {
    this.getUser()
  }

  getUser(noloading?: boolean) {
    if (!noloading) this.loading = true
    this.app.productService.retrieveMembersOfGroup(this.selectedRow.groupId)
      .subscribe({
        next: res => {
          this.userList = res.members
          this.userData = new MatTableDataSource(this.userList);
          this.userData.paginator = this.paginator;
          this.loading = false
        }, error: err => {
          this.errorDialog(err.error?.message || 'Error fetching list')
          this.loading = false
        }
      })
  }

  action(query: string, row: any) {
    let load = {
      decision: 'remove',
      groupId: this.selectedRow.groupId,
      userId: row._id
    }
    row.loading = true
    this.app.productService.addOrRemoveMember(load)
      .subscribe({
        next: res => {
          this.successDialog(res.message)
          row.loading = false
          this.getUser(true)
        }, error: err => {
          console.log(err.error);
          
          this.errorDialog(err.error?.message || 'Error completing request')
          row.loading = false
        }
      })
  }

  successDialog(item: any, msg?: string) {
    let alert: alertModal = {
      details: item,
      message: msg || 'Process Completed',
      type: 'SUCCESS',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

  close() {
    this.dialog.close()
  }

  errorDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }
}
