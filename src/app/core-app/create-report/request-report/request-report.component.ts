import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { requestReportPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-request-report',
  templateUrl: './request-report.component.html',
  styleUrls: ['./request-report.component.scss']
})
export class RequestReportComponent implements OnInit {
  form: FormGroup;
  reporttypeLoading: boolean = false
  reporttypeError: boolean = false
  reportcat : any;
  reportcatfilter:any;

  errorList: boolean = false;

  loading: boolean = false;
  basicList: any = [];
  customList: any = []

  listFilter: any = [];

  totalList: any = []

  showSuccess: boolean = false;

  reportsource: any
  reportsourcefilter: any;

  showOption: boolean = false

  postReportLoading: boolean = false
  postReortError: boolean = false
  successmsg: string = '';

  constructor( private fb: FormBuilder, private dialog: MatDialogRef<RequestReportComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) { 
    this.form = this.fb.group({
      'category': ['', Validators.required],
      'altcat': [''],
      'reportSource': ['', Validators.required],
      'link': [''],
    })
  }

  ngOnInit(): void {
    this.getReportCat()
    this.getBasicList();
  }

  requestReport(){
    this.postReportLoading = true
    let clientInput = this.form.value
    let payload = new requestReportPayload()

    payload.category = clientInput.category === 'Others' ? clientInput.altcat : clientInput.category
    payload.link = clientInput.link ? clientInput.link : "None"
    payload.source = clientInput.reportSource



    this.app.productService.requestReport(payload)
    .subscribe({
      next: (res) => {
        if(res['status']){
          this.postReportLoading = false
          this.postReortError = false
          // this.dialog.close()
          this.showSuccess = true
          this.successmsg = "You have successfully requested a report. We will be in touch soon.";
          this.successDialog(this.successmsg)
          this.close()
        }else{
          this.postReportLoading = false
          this.postReortError = true
          this.showSuccess = false

          this.errorDialog(res['message'])
        }
      },
      error: (err) => {
        this.postReportLoading = false
        this.postReortError = true
        this.showSuccess = false
        this.errorDialog(err)
      }
    })
  }

  getBasicList(){
    this.totalList = this.app.helperService.getRegularConnectorList()
    this.listFilter = this.totalList
  }

  getReportCat(){
    this.reportcat = [
      {name: "Marketing", value: "Marketing"},
      {name: "Customer", value: "Customer"},
      {name: "Digital", value: "Digital"},
      {name: "Sales", value: "Sales"},
      {name: "Retail", value: "Retail"},
      {name: "E-commerce", value: "E-commerce"},
      {name: "Healthcare", value: "Healthcare"},
      {name: "Real Estate", value: "Real Estate"},
      {name: "Human Resources", value: "Human Resources"},
      {name: "Supply Chain", value: "Supply Chain"},
      {name: "Fintech", value: "Fintech"},
      {name: "Others", value: "Others"},
    ]

    this.reportcatfilter = this.reportcat
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


  onSelectionChange(event: any) {
    if(event.value === 'Others'){
      this.showOption = true
    }else{
      this.showOption = false
    }
  }

  reset() {
    this.onKey('')
    this.onKeySource('')
  }

  onKey(value: string) {
    this.reportcat = this.search(value);

  }
  search(value:any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.reportcatfilter
    }
    return this.reportcatfilter.filter((option:any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  onKeySource(value: string) {
    this.totalList = this.searchSource(value);

  }
  searchSource(value:any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.listFilter
    }
    return this.listFilter.filter((option:any) => {
      if (option.connectorName) {
        return option.connectorName.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  close(){
    this.dialog.close()
  }

}
