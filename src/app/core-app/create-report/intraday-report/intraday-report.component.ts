import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { MessageUtil } from 'src/app/helpers/messages';
import { generateReport, transformIntradayPayload, transformPayload } from 'src/app/model/clientInfo';
import { FormDataToJsonService } from 'src/app/services/form-data-to-json.service';
import { alertModal } from 'src/app/services/ui.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { getDatasetId } from 'src/app/helpers/functions';

@Component({
  selector: 'app-intraday-report',
  templateUrl: './intraday-report.component.html',
  styleUrls: ['./intraday-report.component.scss']
})
export class IntradayReportComponent implements OnInit {
  name: any;
  customLoading: boolean = false
  gacustomList: any = []
  gacustomError: boolean = false
  galoading: boolean = false
  galist: any = []
  galistFilter: any = []

  ga4customList: any = []
  ga4customError: boolean = false
  ga4loading: boolean = false
  ga4list: any = []
  ga4listFilter: any = []

  macustomList: any = []
  macustomError: boolean = false
  maloading: boolean = false
  malist: any = []
  malistFilter: any = []

  adjustloading: boolean = false
  adjustlist: any = []
  adjustlistFilter: any = []
  adjustcustomList: any = []
  adjustcustomError: boolean = false

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

  refreshLoading1: any;
  refreshError1: boolean = false
  type: any;

  store: any;
  multipleStore: any;
  dataSetNameGa4: any = []
  dataSetNameAdjust: any = []
  dataSetNameMa: any = []

  transformPayload: any = []
  clonePayload: any = []

  transformPayloadMultiple: any = []
  cloneMultiplePayload: any = []

  typeset = 'goolge_analytics';

  setArray = [
    { name: "Google Analytics", value: "goolge_analytics", isChecked: true },
    { name: "Google Analytics 4", value: "goolge_analytics_4", isChecked: false },
  ]

  scheduleType = [
    { name: "Hourly", value: "Hourly" },
    { name: "Daily", value: "Daily" },
    { name: "Weekly", value: "Weekly" }
  ]

  form: FormGroup

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<IntradayReportComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public selectedRow: any, private app: AppService, private dialog1: MatDialog,
    private formDataConverterService: FormDataToJsonService) {

    this.form = this.fb.group({
      ga4Name: ['', Validators.required],
      maName: ['', Validators.required],
      adjustName: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getCustomMa()
    this.getCustomGa4()
    this.getAdjustConnector()

    this.email = this.email.split('.').join('_')

  }

  getType(value: any) {

  }

  getAdjustConnector() {
    this.adjustloading = true
    let user = this.app.helperService.getActiveid()
    let status = 'Connected'
    let service = 'adjust'
    let date = 'null'
    let schema = 's2'
    this.app.productService.getCustomConnector(user, service, status, date, schema)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.adjustloading = false
            this.adjustcustomList = res['connectors'].reverse()
            this.adjustlist = this.adjustcustomList
            this.adjustlistFilter = this.adjustlist
          }
          else {
            this.adjustloading = false
            this.adjustlist = []
            this.adjustcustomError = true
            // this.error(res['message'])
          }
        },
        error: (err) => {
          this.adjustloading = false
          this.adjustlist = []
          this.adjustcustomError = true
          // this.error(err)
        }
      })
  }

  getCustomGa4() {
    this.ga4loading = true
    let user = this.app.helperService.getActiveid()
    let status = 'Connected'
    let service = 'google_analytic_4'
    let date = 'null'
    let schema = 's2'
    this.app.productService.getCustomConnector(user, service, status, date, schema)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.ga4loading = false
            this.ga4customList = res['connectors'].reverse()
            this.ga4list = this.ga4customList
            this.ga4listFilter = this.ga4list
          }
          else {
            this.ga4loading = false
            this.ga4list = []
            this.ga4customError = true
            // this.error(res['message'])
          }
        },
        error: (err) => {
          this.ga4loading = false
          this.ga4list = []
          this.ga4customError = true
          // this.error(err)
        }
      })
  }

  getCustomMa() {
    this.maloading = true
    let user = this.app.helperService.getActiveid()
    let status = 'Connected'
    let service = 'magento'
    let date = 'null'
    let schema = 's2'
    this.app.productService.getCustomConnector(user, service, status, date, schema)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.maloading = false
            this.macustomList = res['connectors'].reverse()
            this.malist = this.macustomList
            this.malistFilter = this.malist
          }
          else {
            this.maloading = false
            this.malist = []
            this.macustomError = true
            // this.error(res['message'])
          }
        },
        error: (err) => {
          this.maloading = false
          this.malist = []
          this.macustomError = true
          // this.error(err)
        }
      })
  }



  mareset() {
    this.maonKey('')
  }

  maonKey(value: string) {
    this.malist = this.masearch(value);

  }
  masearch(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.malistFilter
    }
    return this.malistFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  gareset() {
    this.gaonKey('')
  }

  gaonKey(value: string) {
    this.galist = this.gasearch(value);

  }
  gasearch(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.galistFilter
    }
    return this.galistFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  ga4reset() {
    this.ga4onKey('')
  }

  ga4onKey(value: string) {
    this.ga4list = this.ga4search(value);

  }
  ga4search(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.ga4listFilter
    }
    return this.ga4listFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  reset() {
    this.onKey('')
  }

  onKey(value: string) {
    this.adjustlist = this.search(value);

  }
  search(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.adjustlistFilter
    }
    return this.adjustlistFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  close() {
    this.dialog.close()
  }

  transformMultiple() {
    // this.dataSetName = []
    this.transformPayloadMultiple = []
    this.reportLoading = true

    this.dataSetNameGa4 = this.form.value.ga4Name
    this.dataSetNameMa = this.form.value.maName
    this.dataSetNameAdjust = this.form.value.adjustName

    let payload = new transformIntradayPayload
    payload.connector = this.dataSetNameGa4.nameOfConnector + "_" + this.dataSetNameMa.nameOfConnector + "_" + this.dataSetNameAdjust.nameOfConnector
    payload.gbq_convz_data_product = this.app.helperService.getDestinationCustom()
    payload.intraday = "magento_mahdi_1010"
    payload.magento_raw_schema = this.dataSetNameMa.nameOfConnector
    payload.ga4_raw_schema = this.dataSetNameGa4.nameOfConnector
    payload.adjust_raw_schema = this.dataSetNameAdjust.nameOfConnector
    payload.currency_conversion = "currency_conversion",
      payload.silver_schema = this.dataSetNameGa4.nameOfConnector + "_" + this.dataSetNameMa.nameOfConnector + "_" + this.dataSetNameAdjust.nameOfConnector + "_reporting"
    payload.source = "dbt_ecom_magento_intraday"
    payload.run_env = environment.domain == 'staging' ? "dev" : "prod"
    payload.dataset_location = this.app.helperService.getDestinationRegion()
    this.transformPayloadMultiple.push(payload)

    this.app.productService.generateReports(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.GAMagentoworkspace(this.dataSetNameGa4, this.dataSetNameMa, this.dataSetNameAdjust)
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

  GAMagentoworkspace(row: any, item: any, value: any) {
    this.cloneMultiplePayload = []
    let tempservice = row.serviceOfConnector + "_" + item.serviceOfConnector + "_" + value.serviceOfConnector
    let result = this.convertToCapitalized(tempservice)

    this.transformLoading = true
    let workspacename = row.nameOfConnector + "_" + item.nameOfConnector + "_" + value.nameOfConnector
    // let workspacename = 'intraday'
    let formData: FormData = new FormData()

    // formData.append('source_workspace', environment.intradayTemplateName || 'Intraday_Template_Workspace');
    formData.append('source_workspace', environment.intradayTemplateName);
    formData.append('target_workspace', `${this.email} - 'intraday' - ${Date.now()}`);

    formData.append('user_email', 'bi@convz.com')

    let payload = this.formDataConverterService.formDataToJson(formData)


    this.app.productService.cloneWorkspace(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.datasetid = res['data'].response.cloned_datasets[0].dataset_id
            this.groupid = res['data'].response.target_ws.target_group_id
            this.newValue = workspacename + "_reporting"
            this.cloneMultiplePayload.push({ "dataset_id": this.datasetid })
            this.generateReportMultiple(res['data'].response, row, item, value, this.transformPayloadMultiple, this.cloneMultiplePayload)
            // this.app.snackBar.open(res['msg'], 'Dismiss', {
            //   duration: MessageUtil.TIMEOUT_DURATION,
            //   panelClass: ['custom-snackbar']
            // })
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

  generateReportMultiple(row: any, item: any, value: any, i: any, transform: any, clonedata: any) {
    let dialogConfig = new MatDialogConfig()
    let type = 'intraday'

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.disableClose = true
    dialogConfig.height = 'auto'
    dialogConfig.minWidth = '30vw'
    dialogConfig.data = {
      row,
      type,
      item,
      i,
      value,
      transform,
      clonedata
    }

    // this.dialog1.open(GenerateIntradayReportComponent, dialogConfig)
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
    // let temp = JSON.stringify([{ "name": "dataset_name", "newValue": this.newValue }])
    let testing = JSON.stringify([
      {
        "name": "dataset_name",
        "newValue": this.newValue
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
            this.transformLoading = false
            this.reportLoading = false
            this.dialog.close()
            this.success()
            // setTimeout(()=>{
            //   this.transformLoading = false
            //   this.reportLoading = false
            //   this.dialog.close()
            //   this.success()
            // }, 20000); 
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

  setType(value: any) {
    this.typeset = value

  }

}