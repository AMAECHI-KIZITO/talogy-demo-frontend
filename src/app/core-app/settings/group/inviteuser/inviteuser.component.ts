import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { createGroup, inviteUserPayload, updateUserRolePayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-inviteuser',
  templateUrl: './inviteuser.component.html',
  styleUrls: ['./inviteuser.component.scss']
})
export class InviteuserComponent implements OnInit {
  form: FormGroup
  loading: boolean = false
  error: boolean = false

  roleloading: boolean = false
  roleError: boolean = false
  roleList: any = []
  roleListFilter : any = []

  showSuccess: boolean = false;
  successmsg: any;

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<InviteuserComponent>, 
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) {

      this.form = this.fb.group({
        'name': ['', Validators.required],
        'description': [''],
      })
   
   }

  ngOnInit(): void {

  }

  submit(){
    let load: createGroup = {
      groupDescription: this.form.get('description')?.value || '',
      groupName: this.form.get('name')?.value
    }
    this.loading = true
    this.app.productService.superadminCreateGroup(load)
      .subscribe({
        next: res => {
          this.loading = false
          this.closeSuccess()
          this.successDialog(res.message)
        }, error: err => {
          this.errorDialog(err.error.message || 'Error fetching list')
          this.loading = false
        }
      })
  }

  close(){
    this.dialog.close()
  }

  closeSuccess(){
    this.dialog.close('Added')
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
