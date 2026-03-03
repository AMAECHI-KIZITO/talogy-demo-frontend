import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { postOrgPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-add-organisation',
  templateUrl: './add-organisation.component.html',
  styleUrls: ['./add-organisation.component.scss']
})
export class AddOrganisationComponent implements OnInit {
  form: FormGroup
  loading: boolean = false
  error: boolean = false
  showTenantId: boolean = false;

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<AddOrganisationComponent>, 
    private app: AppService, private dialog1: MatDialog) {
    this.form = this.fb.group({
      'org': ['', Validators.required],
      'link': ['', Validators.required],
      'tenant': [''],
      'registerWithMicrosoft': [false]
    })
   }

  ngOnInit(): void {
  }

  onCheckboxChange(): void {
    this.showTenantId = this.form.get('registerWithMicrosoft')?.value;
    if (!this.showTenantId) {
      this.form?.get('tenant')?.reset();
    }
  }

  submit(){
    this.loading = true 
    let payload = new postOrgPayload
    payload.organizationName = this.form.value.org
    payload.organizationUrl = this.form.value.link
    payload.tenant = this.form.value.tenant ? this.form.value.tenant : null

   

    this.app.productService.postOrganization(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] == true){
          this.loading = false
          this.dialog.close('Added')
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
