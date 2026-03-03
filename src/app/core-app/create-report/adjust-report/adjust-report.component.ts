import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { MessageUtil } from 'src/app/helpers/messages';
import { generateReport, transformPayload } from 'src/app/model/clientInfo';
import { FormDataToJsonService } from 'src/app/services/form-data-to-json.service';
import { Router } from '@angular/router';
import { alertModal } from 'src/app/services/ui.service';
import { environment } from 'src/environments/environment';
import { getDatasetId } from 'src/app/helpers/functions';

@Component({
  selector: 'app-adjust-report',
  templateUrl: './adjust-report.component.html',
  styleUrls: ['./adjust-report.component.scss']
})
export class AdjustReportComponent implements OnInit {
  name: any;
  customLoading: boolean = false
  customList: any = []
  customError: boolean = false
  loading: boolean = false
  list: any = []
  listFilter: any = []
  transformloading: boolean = false

  otherList: any = []
  otherListFilter: any = []

  reportLoading: boolean = false
  reportError: boolean = false

  editLoading: any
  transformLoading: boolean = false;
  transformError: boolean = false
  show: boolean = false

  transformLoading1: any;
  transformError1: boolean = false

  customTransformLoading: boolean = false
  editLoading1: any
  customTransformError: boolean = false;

  connectError: boolean = false
  connectorList: any
  tempArray: any = []
  filterItem: any = []
  item: any = [];
  errorList: boolean = false

  totalList: any = []
  structure: any = []

  username = this.app.helperService.getClientname()
  status = this.app.helperService.getClientStatus()
  email = this.app.helperService.getEmail()
  destination = this.app.helperService.getDestinationTitle()

  datasetid: any;
  groupid: any;
  newValue: any;
  updateLoading: any;
  updateError: boolean = false

  refreshLoading: any;
  refreshError: boolean = false

  customTempList: any = []

  datasetid1: any;
  groupid1: any;
  newValue1: any;
  updateLoading1: any;
  updateError1: boolean = false

  refreshLoading1: any;
  refreshError1: boolean = false
  type: any;

  store: any;
  dataSetName: any = []

  transformPayload: any = []
  clonePayload: any = []

  form: FormGroup



  scheduleType = [
    { name: "Hourly", value: "Hourly" },
    { name: "Daily", value: "Daily" },
    { name: "Weekly", value: "Weekly" }
  ]

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<AdjustReportComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public selectedRow: any, private app: AppService, private dialog1: MatDialog,
    private formDataConverterService: FormDataToJsonService) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      refresh: ['']
    })

  }

  ngOnInit(): void {
    this.getCustomConnector()
  }

  getCustomConnector() {
    this.loading = true
    let user = this.app.helperService.getActiveid()
    let status = 'Connected'
    let service = 'adjust'
    let date = 'null'
    let schema = 's1'
    this.app.productService.getCustomConnector(user, service, status, date, schema)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false
            this.customList = res['connectors'].reverse()
            this.list = this.customList
            this.listFilter = this.list
          }
          else {
            this.loading = false
            this.list = []
            this.customError = true
            // this.error(res['message'])
          }
        },
        error: (err) => {
          this.loading = false
          this.list = []
          this.customError = true
          // this.error(err)
        }
      })
  }

  reset() {
    this.onKey('')
  }

  onKey(value: string) {
    this.list = this.search(value);

  }
  search(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.listFilter
    }
    return this.listFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  close() {
    this.dialog.close()
  }

  transform() {
    this.transformPayload = []
    this.store = this.form.value.name
    this.reportLoading = true
    let payload = new generateReport
    payload.connector = this.store.nameOfConnector
    payload.project = this.app.helperService.getDestinationCustom()
    let temp = this.store.serviceOfConnector.toLowerCase()
    payload.source = temp + "_api"
    payload.run_env = environment.domain == 'staging' ? "dev" : "prod"
    payload.dataset_location = this.app.helperService.getDestinationRegion()
    this.transformPayload.push(payload)

    this.app.productService.generateReports(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {

            this.workspaceReport(this.store)
          } else {
            this.reportLoading = false
            this.reportError = true

            this.error(res['message'])
          }
        },
        error: (err) => {
          this.reportError = true
          this.reportLoading = false
          this.error(err)
        }
      })
  }

  convertToCapitalized(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }




  workspaceReport(row: any) {
    this.clonePayload = []
    let tempservice = row.serviceOfConnector
    let result = this.convertToCapitalized(tempservice)

    this.transformLoading = true
    let formData: FormData = new FormData()

    // formData.append('source_workspace', result+'_Template_Workspace');
    // formData.append('source_workspace', environment.adjustConnectorUrl || result+'_Template_Workspace');
    formData.append('source_workspace', environment.adjustTemplateName);
    // formData.append('target_workspace', `${this.email} - ${row.nameOfConnector} ${Date.now()}`);
    formData.append('target_workspace', `${this.email} - adjust - ${Date.now()}`);
    formData.append('user_email', 'bi@convz.com')

    let payload = this.formDataConverterService.formDataToJson(formData)


    this.app.productService.cloneWorkspace(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.datasetid = res['data'].response.cloned_datasets[0].dataset_id
            this.groupid = res['data'].response.target_ws.target_group_id
            this.newValue = row.schema ? row.schema + "_intermediate" : row.nameOfConnector + "_intermediate"
            this.clonePayload.push({ "dataset_id": this.datasetid })
            this.generateReport(res['data'].response, row, this.transformPayload, this.clonePayload)

          } else {
            this.transformLoading = false
            this.transformError = true
            this.reportLoading = false

            this.error(res['message'])
          }
        },
        error: (err) => {
          this.transformError = true
          this.transformLoading = false
          this.reportLoading = false
          this.error(err)
        }
      })
  }


  generateReport(row: any, i: any, transform: any, clonedata: any) {
    let dialogConfig = new MatDialogConfig()
    let type = 'adjust'

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.disableClose = true
    dialogConfig.height = 'auto'
    dialogConfig.minWidth = '30vw'
    dialogConfig.data = {
      row, type,
      i,
      transform,
      clonedata
    }

    // this.dialog1.open(GenerateComponent, dialogConfig)
    //   .afterClosed().subscribe(res => {
    //     if (res === 'Success') {
    //       this.updateDataset()
    //     }
    //   })
  }

  updateDataset() {
    let formDatas: FormData = new FormData()
    formDatas.append('dataset_id', this.datasetid);
    formDatas.append('group_id', this.groupid);
    let temp = JSON.stringify([{ "name": "Dataset", "newValue": getDatasetId('adjust', this.newValue) }])
    let testing = JSON.stringify([
      {
        "name": "dataset_name",
        "newValue": `${this.newValue}`
      },
      {
        "name": "gbq_project_name",
        "newValue": `${this.destination}`
      }
    ])
    formDatas.append('update_details', testing);
    let payload = this.formDataConverterService.formDataToJson(formDatas)

    this.app.productService.updateWorkspace(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.refreshDataset()
          }
          else {
            this.transformLoading = false
            this.reportLoading = false
            this.updateError = true
            this.error(res['message'])
          }
        },
        error: (err) => {
          this.transformLoading = false
          this.updateError = true
          this.reportLoading = false

          this.error(err)
        }
      })
  }



  refreshDataset() {
    let refreshData: FormData = new FormData()
    refreshData.append('dataset_id', this.datasetid)
    refreshData.append('group_id', this.groupid)
    let payload = this.formDataConverterService.formDataToJson(refreshData)

    this.app.productService.refreshWorkspace(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            // setTimeout(()=>{
            //   this.transformLoading = false
            //   this.reportLoading = false
            //   this.dialog.close()
            //   this.success()
            // }, 20000); 

            this.transformLoading = false
            this.reportLoading = false
            this.dialog.close()
            this.success()
          }
          else {
            this.transformLoading = false
            this.reportLoading = false
            this.refreshError = true
            this.error(res['message'])
          }
        },
        error: (err) => {
          this.transformLoading = false
          this.refreshError = true
          this.reportLoading = false

          this.error(err)
        }
      })
  }



  error(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

  success() {
    let alert: alertModal = {
      details: 'Your report has been generated successfully.',
      message: 'Please go to My Reports section to view your report.',
      type: 'SUCCESS',
      duration: 10000,
      action: 'Go to My Reports',
    }
    this.app.ui.setAlertStatus(alert)
    this.app.ui.alertButton.asObservable()
      .subscribe((click) => {
        if (click == 'Go to My Reports') {
          this.router.navigate(['/app/report'])
          this.app.ui.clickAlertButton('')
        }
      })
  }

}