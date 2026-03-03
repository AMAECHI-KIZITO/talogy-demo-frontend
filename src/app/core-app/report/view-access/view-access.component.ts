import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-view-access',
  templateUrl: './view-access.component.html',
  styleUrls: ['./view-access.component.scss']
})
export class ViewAccessComponent implements OnInit {

  userAccess: any = []

  constructor(private dialog: MatDialogRef<ViewAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) {
  
   }

  ngOnInit(): void {

    this.userAccess = this.selectedRow.accessList
  }

  close(){
    this.dialog.close()
  }

}
