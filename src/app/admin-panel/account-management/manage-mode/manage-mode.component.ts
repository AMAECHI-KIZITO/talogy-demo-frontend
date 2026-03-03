import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orgStatusPayload, userStatusPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-manage-mode',
  templateUrl: './manage-mode.component.html',
  styleUrls: ['./manage-mode.component.scss']
})
export class ManageModeComponent implements OnInit {

  form: FormGroup
  loading: boolean = false
  error: boolean = false



  statusList: any = []
  templateListFilter: any = []

  showSuccess: boolean = false;

  successmsg: any;

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<ManageModeComponent>,
    @Inject(MAT_DIALOG_DATA) public item : any,
    private app: AppService, private dialog1: MatDialog) {
    this.form = this.fb.group({
      'mode': [this.item.row.organizationStatus, Validators.required],
    })
   }

  ngOnInit(): void {
    this.statusList = [
      {name: "Active", value: "ENABLED"},
      {name: "Pending", value: "PENDING"},
      {name: "Inactive", value: "DISABLED"}
    ]
  }
  changeStatus(){
    if(this.item.type == 'parent' || this.item.type == 'subparent'){
      this.loading = true
      let payload = new orgStatusPayload
      payload.organizationId = this.item.row.organizationId
      let status = this.form.value.mode == 'ENABLED' ? 'activate' : this.form.value.mode == 'DISABLED' ? 'deactivate' : 'pending'
      this.app.productService.updateOrgStatus(status, payload)
      .subscribe({
        next: (res) => {
          if(res['status'] == true){
            this.loading = false
            this.dialog.close('success')
           
          }
          else if(res['status'] == false) {
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
    }else{
      this.loading = true
      let payload = new userStatusPayload
      payload.organizationId = this.item.root.organizationId
      payload.userId = this.item.row.userId
    
      let status = this.item.row.status == 'activated' ? 'deactivate' : 'activate'
      
      this.app.productService.updateUserStatus(status, payload)
      .subscribe({
        next: (res) => {
          if(res['status'] == true){
            this.loading = false
            this.successmsg = res['message']
            this.successDialog(this.successmsg)
            this.closeSuccess()
          }
          else if(res['status'] == false) {
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


}
