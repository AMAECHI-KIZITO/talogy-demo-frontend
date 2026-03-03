import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  userList: any

  displayedColumns: string[] = [];
  userData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private dialog: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public dashboard: any) { }

  ngOnInit(): void {
    this.setTableData()
  }

  setTableData() {
    if(this.dashboard.type == 'active_users'){
      this.displayedColumns = ['email', 'org', 'time']
    }

    if(this.dashboard.type == 'new_user'){
      this.displayedColumns = ['orgname', 'count']
    }

    this.userList = this.dashboard.data
    this.userData = new MatTableDataSource(this.userList);
    this.userData.paginator = this.paginator;
  }

  close(){
    this.dialog.close()
  }

}
