import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { cloneOrgPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';


@Component({
  selector: 'app-clone-org',
  templateUrl: './clone-org.component.html',
  styleUrls: ['./clone-org.component.scss']
})
export class CloneOrgComponent implements OnInit {
  form: FormGroup
  loading: boolean = false
  error: boolean = false
  

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<CloneOrgComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) {
    this.form = this.fb.group({
      'org': ['', Validators.required],
      'domain': ['', Validators.required],
    })
   }

  ngOnInit(): void {
  }


  submit(){
    this.loading = true 
    let payload = new cloneOrgPayload
    payload.clonedOrganizationId = this.selectedRow.organizationId
    payload.newOrgAliasDomain = this.form.value.domain
    payload.newOrgName = this.form.value.org

   

    this.app.productService.cloneOrganization(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] == true){
          this.loading = false
          this.dialog.close('clone')
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

  close(){
    this.dialog.close()
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
