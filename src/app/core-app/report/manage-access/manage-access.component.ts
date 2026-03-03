import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { reportAccessPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.scss']
})
export class ManageAccessComponent implements OnInit {

  form: FormGroup
  loading: boolean = false
  error: boolean = false

  showSuccess: boolean = false;

  successmsg: any;

  userList: any;
  userListFilter: any;
  userError: boolean = false
  userloading: boolean = false

  statusList: any;

  username: any;
  

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<ManageAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) {
    this.form = this.fb.group({
      'name': ['', Validators.required]
    })

    this.username = this.app.helperService.getEmail()
   }

  ngOnInit(): void {
    this.statusList = [
      {name: "Enable", value: "grant"},
      {name: "Disable", value: "Revoke"}
    ]
    this.getUser()

  }

  submit(){
      this.loading = true
      let payload = new reportAccessPayload
      
      payload.accessList = this.form.value.name
      payload.permission = "grant"
      payload.reportId = this.selectedRow._id




      this.app.productService.reportAccess(payload)
      .subscribe({
        next: (res) => {
          if(res['status'] == true){
            this.loading = false
            this.showSuccess = true
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



  getUser(){
    this.userloading = true
    this.app.productService.getUserList()
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.userloading = false
          this.userError = false
          this.userList = res['data'].totalOrganizationUsers

          // Filter out the logged-in user
          this.userList = this.userList.filter((user:any) => user.userEmail !== this.username);
      

          this.userList = this.getAvailableUsers(this.userList, this.selectedRow.accessList);

          this.userListFilter = this.userList

        }else{
          this.userloading = false
          this.userError = true
          this.userList = []
        }
      },
      error: (err) => {
        this.userloading = false
        this.userError = true 
        this.userList = []
      }
    })
    

   
  }

  getAvailableUsers(totalOrganizationUsers:any, usersWithAccess:any) {
    // Extract the user IDs of users who already have access
    const accessUserIds = usersWithAccess.map((user:any) => user.userId);
  
    // Filter the total users to exclude those with access
    const availableUsers = totalOrganizationUsers.filter((user:any) => !accessUserIds.includes(user.userId));
  
    return availableUsers;
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
    this.userList = this.search(value);

  }
  search(value:any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.userListFilter
    }
    return this.userListFilter.filter((option:any) => {
      if (option.userName) {
        return option.userName.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

}
