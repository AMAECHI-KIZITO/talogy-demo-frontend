import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { inviteUserPayload, postOrgPayload, postUserPayload, updateRolePayload, updateUserRolePayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-add-newuser',
  templateUrl: './add-newuser.component.html',
  styleUrls: ['./add-newuser.component.scss']
})
export class AddNewuserComponent implements OnInit {
  form: FormGroup
  loading: boolean = false
  error: boolean = false

  roleloading: boolean = false
  roleError: boolean = false
  roleList: any = []
  roleListFilter : any = []

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<AddNewuserComponent>, 
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) {

      if(this.selectedRow.check === 'new'){
        this.form = this.fb.group({
          'fullname': ['', Validators.required],
          'email': ['', Validators.required],
        })
      }else{
        this.form = this.fb.group({
          'updaterole': [this.selectedRow.row.userRole, [Validators.required]],
        })
      }
   
   }

  ngOnInit(): void {
    this.getRole()
  }

  submit(){
    if(this.selectedRow.check == 'new'){
      this.loading = true 
      let payload = new inviteUserPayload
      payload.inviteeEmail = this.form.value.email
      payload.inviteeName = this.form.value.fullname
  

  
      this.app.productService.inviteSuperUsers(payload)
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
    }else{
      this.loading = true 
      let payload = new updateUserRolePayload
      payload.newRole = this.form.value.updaterole
      payload.organizationId = this.selectedRow.row.userOrganizationId._id
      payload.userId = this.selectedRow.row.userId
  
  
      
  
      this.app.productService.updateRole(payload)
      .subscribe({
        next: (res) => {
          if(res['status'] == true){
            this.loading = false
            this.dialog.close('Updated')
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
    
  }

  close(){
    this.dialog.close()
  }

  getRole(){
    this.roleloading = true
    this.app.productService.getRoles()
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.roleloading = false
          this.roleError = false
          this.roleList = res['userRoles']
          this.roleListFilter = this.roleList
        }else{
          this.roleloading = false
          this.roleError = true
          this.roleList = []
        }
      },
      error: (err) => {
        this.roleloading = false
        this.roleError = true 
        this.roleList = []
      }
    })
    

   
  }
  reset() {
    this.onKey('')
  }

  onKey(value: string) {
    this.roleList = this.searchRole(value);

  }

  searchRole(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.roleListFilter
    }
    return this.roleListFilter.filter((option: any) => {
      if (option.roleName) {
        return option.roleName.toString().toLowerCase().startsWith(keyWord)
      }
    });
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
