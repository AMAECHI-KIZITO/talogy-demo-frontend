import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { alertModal } from 'src/app/services/ui.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-share-report',
  templateUrl: './share-report.component.html',
  styleUrls: ['./share-report.component.scss']
})
export class ShareReportComponent implements OnInit {
  form!: FormGroup;
  link: string = environment.domain == "staging" ? 'https://stg.dataplatform.ae/preview' : 'https://app.datae.ae/preview'; // STAGING Link
  // link: string = 'https://app.dataplatform.ae/preview'; // LIVE link

  formLoading: boolean = false;
  showFailure: boolean = false;
  showSuccess: boolean = false;

  // link: string = 'https://stg.dataplatform.ae/app/report/report-view'
  constructor(private fb: FormBuilder, private dialogref: MatDialogRef<ShareReportComponent>,
    @Inject(MAT_DIALOG_DATA) public param: any, private app: AppService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])]
    })

    if(this.param.reportData.type == 'Looker'){
      this.link = this.param.reportData.reporturl
      console.log(this.link);
    }
  }

  close() {
    this.dialogref.close()
  }

  share() {
    let payload = {
      receiverEmail: this.form.get('email')?.value,
      // url: this.link,
      // workspaceId: this.param.workspace,
      reportId: this.param.report
    }

    this.formLoading = true
    this.showFailure = false
    this.showSuccess = false

    this.app.productService.shareReport(payload)
      .subscribe({
        next: res => {
          this.formLoading = false
          if (!res.status) {
            // this.showFailure = true
            // let msg = `Error Sharing report with ${this.form.get('email')?.value}. Please retry...`
            // this.errorDialog(msg)
            let msg = `You have successfully shared this report with ${this.form.get('email')?.value}.`
            // this.showSuccess = true
            this.successDialog(msg)
            this.close()
          } else {
            let msg = `You have successfully shared this report with ${this.form.get('email')?.value}.`
            // this.showSuccess = true
            this.successDialog(msg)
            this.close()
          }
        }, error: err => {
          this.formLoading = false
          if (err.status == 0) {
            // this.showSuccess = true
            let msg = `You have successfully shared this report with ${this.form.get('email')?.value}.`
            this.successDialog(msg)
            this.close()
          } else {
            let msg = `Error Sharing report with ${this.form.get('email')?.value}. Please retry...`
            this.errorDialog(msg)
          }
        }
      })
  }

  successDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Process Completed',
      type: 'SUCCESS',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
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
