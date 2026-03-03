import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { adminReportPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {

  loading: boolean = false;
  buttonloading: boolean = false;
  marked: boolean = false;
  reportData: any;

  constructor(private dialogref: MatDialogRef<ViewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public row: any, private app: AppService) { }

  ngOnInit(): void {
    this.getReportData()
  }

  getReportData() {
    this.loading = true
    this.app.productService.getReportsinProgressDetail(this.row.workspaceid)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false
            this.reportData = res['data']
          } else {
            this.loading = false
          }
        },
        error: (err) => {
          this.loading = false
        }
      })
  }

  enable() {
    this.buttonloading = true
    let payload = new adminReportPayload
    payload.reportId = this.row._id
    payload.desiredStatus = 'disable'

    this.app.productService.updateStatusReportAdmin(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] == true) {
            this.buttonloading = false
            this.dialogref.close('success')
            this.successDialog(res['message'])
          }
          else if (res['status'] == false) {
            this.buttonloading = false
            this.errorDialog(res['message'])
          }
        },
        error: (err) => {
          this.buttonloading = false
          this.errorDialog(err)
        }
      })
  }

  close() {
    this.dialogref.close()
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

  successDialog(item: any, msg?: string) {
    let alert: alertModal = {
      details: item,
      message: msg || 'Process Completed',
      type: 'SUCCESS',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

  onCopy(success: boolean){
    if (success) {
      this.app.snackBar.open('Report Name copied!!!', 'Copied', {
        duration: 2000, horizontalPosition: 'end'
      })
      this.marked = true
      setTimeout(() => {
        this.marked = false
      }, 2000);
    } else {
      this.app.snackBar.open('Failed to copy!!!', 'Failed', {
        duration: 2000, horizontalPosition: 'end'
      })
    }
  }
}
