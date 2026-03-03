import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit {

  form: FormGroup;
  fileToUpload: any;
  baseImage: any;
  brandList: any;


  reportType = [
    {name: "Powerbi", value: "Powerbi"},
    {name: "Tableau", value: "Tableau"},
    {name: "Looker", value: "Looker"},
    {name: "Google data studio", value: "Google"}
  ]

  constructor( private fb: FormBuilder, private dialog: MatDialogRef<AddReportComponent>,
    private app: AppService) { 
    this.form = this.fb.group({
      'name': ['', Validators.required],
      'reportid': ['', Validators.required],
      'reporttype': ['', Validators.required],
      'reportsourceid': ['', Validators.required],
      'workspaceid': ['', Validators.required],
      'reportsource': ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }

  


  addReport() {
    // let payload = new report
    // payload.parent = this.brandName
    // payload.link = this.form.value.link
    // payload.name = this.form.value.name

    // this.app.dataService.postReport(payload)
    // .subscribe(res => {
    //   if(res){
    //     this.dialog.close()
    //   }
    // })
    
  }

  close(){
    this.dialog.close()
  }

}
