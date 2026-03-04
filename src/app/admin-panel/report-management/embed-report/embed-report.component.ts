import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { embedReport } from 'src/app/model/productModel';

@Component({
  selector: 'app-embed-report',
  templateUrl: './embed-report.component.html',
  styleUrls: ['./embed-report.component.scss']
})
export class EmbedReportComponent implements OnInit {

  form!: FormGroup
  loading: boolean = false
  error: boolean = false
  reportTypes: any = [];
  organizationList: any = [];
  ownersList: any = [];
  ownerLoading: boolean = false;
  organizationLoading: boolean = false;
  reportLoading: boolean = false;

  constructor(private dialogref: MatDialogRef<EmbedReportComponent>, 
    @Inject(MAT_DIALOG_DATA) public row: any, private fb: FormBuilder, private app: AppService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      'workspace': ['', Validators.required],
      'report': ['', Validators.required],
      'dataset': ['', Validators.required],
    });

    this.getReports()
    // this.getOrganizations()
  }

  getReports() {
    this.reportLoading = true
    this.app.productService.getReportType().subscribe({
      next: res =>{
        this.reportLoading = false
        this.reportTypes = res.reportTypes
      }, error: err => {
        this.reportLoading = false
        this.reportTypes = []
        this.app.snackBar.open('Error getting Reports', 'Dismiss', {
          duration: 2000
        })
      }
    })
  }

  getOrganizations(){
    this.organizationLoading = true
    this.app.productService.getOrganisation().subscribe({
      next: res => {
        this.organizationLoading = false
        this.organizationList = res.organizations
      }, error: err => {
        this.organizationLoading = false
        this.organizationList = []
        this.app.snackBar.open('Error getting Organization', 'Dismiss', {
          duration: 2000
        })
      }
    })
  }

  getOwners(id: string){
    this.ownerLoading = true
    this.app.productService.getOrgInfo(id).subscribe({
      next: res => {
        this.ownerLoading = false
        this.ownersList = res.data?.users || []
      }, error: err => {
        this.ownerLoading = false
        this.ownersList = []
        this.app.snackBar.open('Error getting Users', 'Dismiss', {
          duration: 2000
        })
      }
    })
  }

  close() {
    this.dialogref.close()
  }

  submit() {
    let payload: embedReport = {
      newReportName: this.form.get('name')?.value,
      // newReportOwner: this.form.get('owner')?.value.userId,
      newReportType: this.form.get('type')?.value,
      reportId: this.form.get('report')?.value,
      workspaceId: this.form.get('workspace')?.value,
      reportDatasetId: this.form.get('dataset')?.value
    }
    this.loading = true

    this.app.productService.embedReport(payload).subscribe({
      next: res => {
        this.loading = false
        this.app.snackBar.open(res.message, 'Dismiss', {
          duration: 3000
        });
        this.dialogref.close('cloned')
      }, error: err => {
        this.loading = false
        this.app.snackBar.open(err.message, 'Dismiss', {
          duration: 3000
        });
      }
    })
  }
}
