import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { templateAccessPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-report-template-access',
  templateUrl: './report-template-access.component.html',
  styleUrls: ['./report-template-access.component.scss']
})
export class ReportTemplateAccessComponent implements OnInit {

  form: FormGroup
  loading: boolean = false
  error: boolean = false

  templateList: any = []
  templateListFilter: any = []

  showSuccess: boolean = false;

  successmsg: any;

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<ReportTemplateAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) {
    this.form = this.fb.group({
      'templatename': [this.selectedRow.reportTemplates, Validators.required],
    })
   }

  ngOnInit(): void {
    this.getTemplate()
  }

  submit(){
      this.loading = true
      let payload = new templateAccessPayload

      payload.assignedTemplates = this.form.value.templatename

      let id = this.selectedRow.organizationId

      this.app.productService.templateAccess(payload, id)
      .subscribe({
        next: (res) => {
          if(res['status'] == true){
            this.loading = false
            // this.showSuccess = true
            this.successmsg = res['message']
            this.successDialog(this.successmsg)
            this.closeSuccess()
          }
          else {
            this.loading = false
            this.error = true
            this.errorDialog(res['message'])
          }
        },
        error: (err) => {
          this.loading = false
          this.error = true
          this.errorDialog(err)
        }
      })
  }

  getTemplate(){
    this.templateList = [
      {name: "Adjust", value: "Adjust"},
      {name: "Asana", value: "Asana"},
      {name: "Ecommerce Marketing", value: "Ecommerce Marketing"},
      {name: "Intraday", value: "Intraday"},
      {name: "Ad Source", value: "Ad Source"},
      {name: "Pipedrive", value: "Pipedrive"},
    ]

    this.templateListFilter = this.templateList
    
  }


  close(){
    this.dialog.close()
  }

  closeSuccess(){
    this.dialog.close('success')
  }

  successDialog(item: any){
    let alert: alertModal = {
      details: item,
      message: 'Process Completed',
      type: 'SUCCESS',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

  errorDialog(item:any){
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

  reset() {
    this.onKey('')
  }

  onKey(value: string) {
    this.templateList = this.search(value);

  }
  search(value:any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.templateListFilter
    }
    return this.templateListFilter.filter((option:any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

}
