import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { groupReportAccessPayload, reportAccessPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-group-report',
  templateUrl: './group-report.component.html',
  styleUrls: ['./group-report.component.scss']
})
export class GroupReportComponent implements OnInit {
  loading: boolean = false
  loading2: boolean = false

  userList: any = []
  userList2: any = []

  displayedColumns: string[] = ['name', 'action'];
  displayedColumns2: string[] = ['name', 'org'];

  userData: MatTableDataSource<any> | any;
  userData2: MatTableDataSource<any> | any;

  @ViewChild(MatPaginator) paginator: any;
  reportView: boolean = true;

  constructor(private app: AppService, private dialog: MatDialogRef<GroupReportComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow: any) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(noloading?: boolean) {
    if (!noloading) this.loading = true
    this.app.productService.retrieveGroupReports(this.selectedRow.groupId)
      .subscribe({
        next: res => {
          this.loading = false
          this.userList = res.reports
          this.userData = new MatTableDataSource(this.userList);
          this.userData.paginator = this.paginator;
          this.getReportList()
        }, error: err => {
          this.errorDialog(err.error?.message || 'Error fetching list')
          this.loading = false
        }
      })
  }

  getReportList() {
    this.loading2 = true
    let email = this.app.helperService.getActiveid()
    let type = 'null'
    let status = 'null';

    this.app.productService.getBasicReport(type, status)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading2 = false

            this.userList2 = this.sortReport(res.reports)
            this.userData2 = new MatTableDataSource(this.userList2);
            this.userData2.paginator = this.paginator;
          }
          else {
            this.loading2 = false
          }
        },
        error: (err) => {
          this.loading2 = false
        }
      })
  }

  sortReport(reports: any){
    let ans: any = []
    reports.filter((e: any) => e.reportPlatform == 'PowerBI').map((r: any) => {
      let k = r.groupAccessList.map((a: any) => a._id)
      if(!k.includes(this.selectedRow.groupId)){
        ans.push(r)
      }
    })
    console.log(ans);
    return ans
  }

  action(action: string, row: any) {
    row.loading = true
    let payload = new groupReportAccessPayload();
    console.log(row);
    
    payload.accessList = [this.selectedRow.groupId];
    payload.permission = action;
    payload.reportId = row.reportid || row._id;
    console.log(payload, 'payload');

    this.app.productService.groupReportAccess(payload).subscribe({
      next: (res) => {
        if (res['status'] == true) {
          this.successDialog(res.message)
          row.loading = false
          this.getUsers(true)
        } else {
          row.loading = false
          this.errorDialog(res['message']);
        }
      },
      error: (err) => {
        this.errorDialog(err.error?.message || 'Error completing request')
        row.loading = false
      },
    });
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

  addReport() {
    this.reportView = false
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

  close() {
    this.dialog.close()
  }

}
