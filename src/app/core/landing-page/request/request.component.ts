import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  form: FormGroup
  showSuccess: boolean = false;
  loading: boolean = false

  constructor( private fb: FormBuilder, private dialog: MatDialogRef<RequestComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) { 

    this.form = this.fb.group({
      'fullname': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'description': ['']
    })

  }

  ngOnInit(): void {

  }

  request(){
    this.showSuccess = true
  } 

  close(){
    this.dialog.close()
  }

}
