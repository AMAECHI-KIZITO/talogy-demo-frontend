import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  searchUserKey: string = '';
  reportList: any = []
  list : any = []
  errorList : boolean = false

  loading: boolean = false

  constructor(private dialog: MatDialogRef<ViewUserComponent>, 
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog)  { }

  ngOnInit(): void {

    this.getList(this.selectedRow.userId)
  }

  getList(item:any) {
    this.loading = true
    
    this.app.productService.getUserReports(item)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false
            
            this.list = res['reports']
            this.reportList = this.list
            this.errorList = false
          } else {
            this.loading = false
            this.errorList = true
            this.list = []
          }
        },
        error: (err) => {
          this.loading = false
          this.errorList = true
          this.list = [] 
        }
      })
  }

  filters() {
    let val = this.searchUserKey.toLowerCase().trim(); // Convert search key to lowercase and remove leading/trailing spaces
    if (val === '') {
      // If search key is empty, return the original list
      this.list = this.reportList.slice(); // Assuming you have a copy of the original list stored in 'originalReportList'
      return;
    }
    this.list= this.list.filter((el: any) => {
      if (el.reportname.toLowerCase().includes(val)) {
        return el; // If name includes the search key, keep it in the list
      }
    });
  }

  close(){
    this.dialog.close()
  }

}
