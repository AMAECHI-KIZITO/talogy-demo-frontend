import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orgStatusPayload, userStatusPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-changestatus',
  templateUrl: './changestatus.component.html',
  styleUrls: ['./changestatus.component.scss']
})
export class ChangestatusComponent implements OnInit {

  loading: boolean = false
  error: boolean = false
  constructor(private fb: FormBuilder, private dialog: MatDialogRef<ChangestatusComponent >,
    @Inject(MAT_DIALOG_DATA) public item : any, private dialog1: MatDialog,
    private app: AppService) { }

  ngOnInit(): void {

  }

  changeStatus(){
    if(this.item.type == 'parent' || this.item.type == 'subparent'){
      this.loading = true
      let payload = new orgStatusPayload
      payload.organizationId = this.item.row.organizationId
      let status = this.item.row.organizationStatus == 'ENABLED' ? 'deactivate' : 'activate'
      
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
    }
   
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

  close(){
    this.dialog.close()
  }

}
