import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { brandOrgPayload } from 'src/app/model/productModel';
import { alertModal, UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.scss']
})
export class BrandManagementComponent implements OnInit {

  loading: boolean = false
  error: boolean = false
  primary: any;
  secondary: any;
  texts: any;

  showSuccess: boolean = false;

  successmsg: any;


  constructor(private fb: FormBuilder, private dialog: MatDialogRef<BrandManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any, 
    private app: AppService, private dialog1: MatDialog) {
  
   }

  ngOnInit(): void {
    this.primary = this.selectedRow.brandColors.primary
    this.secondary = this.selectedRow.brandColors.secondary
    this.texts = this.selectedRow.brandColors.font
  }

  isColorValid(): boolean {
    // Check if the color length is between 3 and 6 characters excluding the #
    const colorWithoutHash = this.primary.startsWith('#') ? this.primary.slice(1) : this.primary;
    return colorWithoutHash.length >= 3 && colorWithoutHash.length <= 6;
  }


  submit(){
    this.loading = true 
    let payload = new brandOrgPayload
    payload.fontColor = this.texts.startsWith('#') ? this.texts.slice(1) : this.texts;
    payload.primaryColor = this.primary.startsWith('#') ? this.primary.slice(1) : this.primary;
    payload.secondaryColor = this.secondary.startsWith('#') ? this.secondary.slice(1) : this.secondary;

    let id = this.selectedRow.organizationId

   

    this.app.productService.brandColorManage(payload, id)
    .subscribe({
      next: (res) => {
        if(res['status'] == true){
          this.loading = false
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

  closeSuccess(){
    this.dialog.close('brand')
  }

  close(){
    this.dialog.close()
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