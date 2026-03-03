import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddOrganisationComponent } from './add-organisation/add-organisation.component';
import { AddNewuserComponent } from './add-newuser/add-newuser.component';
import { ChangestatusComponent } from './changestatus/changestatus.component';
import { AppService } from 'src/app/app.service';
import { postlogoPaylod } from 'src/app/model/productModel';
import { CloneOrgComponent } from './clone-org/clone-org.component';
import { BrandManagementComponent } from './brand-management/brand-management.component';
import { ReportTemplateAccessComponent } from './report-template-access/report-template-access.component';
import { ManageModeComponent } from './manage-mode/manage-mode.component';
import { DestinationSetupComponent } from './destination-setup/destination-setup.component';
import { alertModal } from 'src/app/services/ui.service';
import { ViewLogsComponent } from './view-logs/view-logs.component';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {
  searchKey: string = '';
  searchKeyUser: string = '';
  myInnerHeight = window.innerHeight - 301;
  displayedColumns: string[] = ['select','name','onboarddate','status','url', 'tenant', 'nou','nau', 'niu','action'];
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator : any;

  selection = new SelectionModel<Element>(true, []);
  selectionUser = new SelectionModel<Element>(true, []);

  displayedUserColumns: string[] = ['select','user','email','role','date','lastlogin','status', 'action'];
  listUserData: MatTableDataSource<any> | any;
 

  accountList: any;
  userList: any;
  accountError: boolean = false
  loading: boolean = false

  setView: boolean = false

  orgName: any
  orgImage: any;
  userloading: boolean = false
  userError: boolean = false

  showItem : any;
  imageUrl: string | null = null;

  uploadLoading: boolean = false
  uploadError: boolean = false
  uploadMessage: any;
  showMessage : any;

  formData: any;

  constructor(private dialog: MatDialog, private app: AppService, private dialog1: MatDialog) { }

  ngOnInit(): void {

    this.getAccount()
  }

  getAccount(){
    this.loading = true
    this.app.productService.getOrganisation()
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.loading = false
          this.accountError = false
          this.accountList = res['organizations']

          this.listData = new MatTableDataSource(this.accountList)
          this.listData.paginator = this.paginator
        }else{
          this.loading = false
          this.accountError = true
          this.accountList = []
        }
      },
      error: (err) => {
        this.loading = false
        this.accountError = true 
        this.accountList = []
      }
    })
    

   
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 1024 * 1024) {
        this.errorDialog('File size should not exceed 1MB')
        // alert('File size should not exceed 1MB');
        return;
      }
      else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)){
        this.errorDialog('Invalid file type! Please provide a jpeg, jpg or png file')
        // alert('File size should not exceed 1MB');
        return;
      }else {
        
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
          
        };

        reader.readAsDataURL(file); 

        this.formData = new FormData();
        this.formData.append('logo', file);
       
        this.showMessage = 'showsave'
      }
      
    }
  }

  saveImage(){
    this.uploadLoading = true
    let orgid = this.userList.organizationId

       this.app.productService.uploadLogo(this.formData, orgid)
      .subscribe({
        next: (res) => {
          if(res['status'] == true){
            this.uploadLoading = false
            this.uploadMessage = res['message']
            this.showMessage = "show"

            setTimeout(() => {
              this.showMessage = "hide";
            }, 5000);
          }
          else{
            this.uploadLoading = false
            this.uploadError = true 
            this.errorDialog(res['message'])
          }

        },
        error: (err) => {
          this.loading = false
          this.uploadError = true 
          this.errorDialog(err)
        }
      })
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



  getUserList(item: any){
    this.showItem = item
    this.setView = true
    this.userloading = true
    // this.imageUrl = this.userList.organizationLogo ? this.userList.organizationLogo : ""
    let userId = this.showItem.organizationId ? this.showItem.organizationId : item
    this.app.productService.getOrgInfo(userId)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.userloading = false
          this.userError = false
          this.userList = res['data']
          this.imageUrl = this.userList.organizationLogo

          this.listUserData = new MatTableDataSource(this.userList.users)
          // this.listData.paginator = this.paginator
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

  applyFilters(){
    this.listData.filter = this.searchKey.trim().toLowerCase()
  }

  applyUserFilters(){
    this.listUserData.filter = this.searchKeyUser.trim().toLowerCase()
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listData.data.forEach((element:any) => this.selection.select(element));
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;

  }
  checkSelected(row:any) {
    return this.selection.isSelected(row)
  }
  toggleRow(row:any) {
    this.selection.isSelected(row) ? this.selection.deselect(row) : this.selection.select(row)
  }

  masterUserToggle() {
    this.isAllUserSelected() ?
      this.selectionUser.clear() :
      this.listUserData.data.forEach((element:any) => this.selectionUser.select(element));
  }


  isAllUserSelected() {
    const numSelected = this.selectionUser.selected.length;
    const numRows = this.listUserData.data.length;
    return numSelected === numRows;

  }
  checkUserSelected(row:any) {
    return this.selectionUser.isSelected(row)
  }
  toggleUserRow(row:any) {
    this.selectionUser.isSelected(row) ? this.selectionUser.deselect(row) : this.selectionUser.select(row)
  }

  addOrg() {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.maxHeight = '60vh'
    dialogConfig.minWidth = '35vw'
    this.dialog.open(AddOrganisationComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if(res === 'Added'){
          this.getAccount()
        }
      })

  }

  updateUser(row:any, check: any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.width = '35vw'
    dialogConfig.data = {row, check}
    this.dialog.open(AddNewuserComponent, dialogConfig)
    .afterClosed().subscribe(res => {
      if(res === 'Updated'){
        this.getUserList(row.userOrganizationId._id)
        this.setView = true
      }
    })

  }

  addUser(row:any, check: any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.width = '35vw'
    dialogConfig.data = {row, check}
    this.dialog.open(AddNewuserComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if(res === 'Added'){
          this.getAccount()
        }
      })

  }

  cloneOrg(row:any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.width = '35vw'
    dialogConfig.data = row
    this.dialog.open(CloneOrgComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if(res === 'clone'){
          this.getAccount()
        }
      })

  }

  templateAccess(row:any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.width = '35vw'
    dialogConfig.data = row
    this.dialog.open(ReportTemplateAccessComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if(res === 'success'){
          this.getAccount()
        }
      })

  }

  manangeMode(row: any, item: any, id: any) {
    let dialogConfig = new MatDialogConfig()

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.width = '35vw'
    dialogConfig.data = {row : row, type: item, root: id}

    this.dialog.open(ManageModeComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res === 'success') {

          item == 'parent' ? this.getAccount() : this.getUserList(this.showItem)

        }
      })
  }

  manageBrand(row:any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.minWidth = '35vw'
    dialogConfig.data = row
    this.dialog.open(BrandManagementComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if(res === 'brand'){
          this.getAccount()
        }
      })

  }

  manageDestination(row:any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.minWidth = '35vw'
    dialogConfig.data = row
    this.dialog.open(DestinationSetupComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if(res === 'success'){
          this.getAccount()
        }
      })

  }

  viewLogs(row:any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.minWidth = '50vw'
    dialogConfig.data = row
    this.dialog.open(ViewLogsComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        // if(res === 'success'){
        //   this.getAccount()
        // }
      })

  }


  back(){
    this.setView = false
    this.getAccount()
  }

  getInitials(string:any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  show(event:any){
  
  }

  changeStatus(row: any, item: any, id: any) {
    let dialogConfig = new MatDialogConfig()

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.data = {row : row, type: item, root: id}

    this.dialog.open(ChangestatusComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res === 'success') {

          item == 'parent' ? this.getAccount() : this.getUserList(this.showItem)

        }
      })
  }

}
