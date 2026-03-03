import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  form: FormGroup

  constructor(private dialog: MatDialogRef<ContactUsComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow: any, private fb: FormBuilder) {

      this.form = this.fb.group({
        fullname: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['', Validators.required],
        companyname: ['', Validators.required],
        companysize: ['', Validators.required],
        companysector: ['', Validators.required],
      });

     }

  ngOnInit(): void {

  }

  submit(){
    
  }

  close() {
    this.dialog.close();
  }

}
