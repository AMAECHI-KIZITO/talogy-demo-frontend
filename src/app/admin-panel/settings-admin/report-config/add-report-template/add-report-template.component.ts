import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-add-report-template',
  templateUrl: './add-report-template.component.html',
  styleUrls: ['./add-report-template.component.scss']
})
export class AddReportTemplateComponent implements OnInit {

  form: FormGroup
  loading: boolean = false

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<AddReportTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) {
    this.form = this.fb.group({
      // 'org': ['', Validators.required],
      // 'domain': ['', Validators.required],
    })
   }

  ngOnInit(): void {
  }

  submit(){
    
  }

  close(){
    this.dialog.close()
  }

  errorDialog(item:any){
    // let dialogConfig = new MatDialogConfig()
    // dialogConfig.disableClose = true;
    // dialogConfig.width = "30%"
    // dialogConfig.data = item
    // this.dialog1.open(ErrorDialogComponent, dialogConfig).afterClosed()
    // .subscribe( res => {
     
    // })
  }

}
