import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { MessageUtil } from 'src/app/helpers/messages';
import { generateReport, transformPayload } from 'src/app/model/clientInfo';
import { FormDataToJsonService } from 'src/app/services/form-data-to-json.service';
import { alertModal } from 'src/app/services/ui.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { getDatasetId } from 'src/app/helpers/functions';

@Component({
  selector: 'app-magento-ga-report',
  templateUrl: './magento-ga-report.component.html',
  styleUrls: ['./magento-ga-report.component.scss']
})
export class MagentoGaReportComponent implements OnInit {

  name: any;
  customLoading: boolean = false
  gacustomList: any = []
  gacustomError: boolean = false
  galoading:boolean = false
  galist: any = []
  galistFilter: any = []

  ga4customList: any = []
  ga4customError: boolean = false
  ga4loading:boolean = false
  ga4list: any = []
  ga4listFilter: any = []

  macustomList: any = []
  macustomError: boolean = false
  maloading:boolean = false
  malist: any = []
  malistFilter: any = []

  transformloading: boolean = false

  otherList: any = []
  otherListFilter : any = []

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
  item : any = [];
  errorList: boolean = false

  totalList: any = []
  structure: any = []

  username = this.app.helperService.getClientname()
  status = this.app.helperService.getClientStatus()
  email = this.app.helperService.getEmail()

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
  multipleStore: any;
  dataSetNameGa: any = []
  dataSetNameMa: any = []

  transformPayload: any = []
  clonePayload: any = []

  transformPayloadMultiple : any = []
  cloneMultiplePayload: any = []

  typeset = 'goolge_analytics';

  setArray = [
    {name: "Google Analytics", value: "goolge_analytics", isChecked: true},
    {name: "Google Analytics 4", value: "goolge_analytics_4", isChecked: false},
  ]

  scheduleType = [
    {name: "Hourly", value: "Hourly"},
    {name: "Daily", value: "Daily"},
    {name: "Weekly", value: "Weekly"}
  ]

  form: FormGroup

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<MagentoGaReportComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any, private app: AppService, private dialog1: MatDialog, private formDataConverterService: FormDataToJsonService) { 

      this.form = this.fb.group({
        gaName: ['', Validators.required],
        maName: ['', Validators.required],
        refresh: [''],
        type: ['']
      })
    }

  ngOnInit(): void {
    this.getCustomMa()
    this.getCustomGa4()
  }

  getType(value:any){

  }

  getCustomGa4(){
    this.ga4loading = true
    let user = this.app.helperService.getActiveid()
    let status = 'Connected'
    let service = 'google_analytic_4'
    let date = 'null'
    let schema = 's1'
    this.app.productService.getCustomConnector(user, service, status, date, schema)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.ga4loading = false
          this.ga4customList = res['connectors'].reverse()
          this.ga4list = this.ga4customList
          this.ga4listFilter = this.ga4list
        }
        else{
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

  getCustomMa(){
    this.maloading = true
    let user = this.app.helperService.getActiveid()
    let status = 'Connected'
    let service = 'magento'
    let date = 'null'
    let schema = 's1'
    this.app.productService.getCustomConnector(user, service, status, date, schema)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.maloading = false
          this.macustomList = res['connectors'].reverse()
          this.malist = this.macustomList
          this.malistFilter = this.malist
        }
        else{
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
  masearch(value:any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.malistFilter
    }
    return this.malistFilter.filter((option:any) => {
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
  gasearch(value:any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.galistFilter
    }
    return this.galistFilter.filter((option:any) => {
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
  ga4search(value:any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.ga4listFilter
    }
    return this.ga4listFilter.filter((option:any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  close(){
    this.dialog.close()
  }

  transformMultiple(){
    // this.dataSetName = []
    this.transformPayloadMultiple = []
    this.reportLoading = true

    this.dataSetNameGa = this.form.value.gaName
    this.dataSetNameMa = this.form.value.maName

    let payload = new transformPayload
    payload.connector = this.dataSetNameGa.nameOfConnector+"_"+this.dataSetNameMa.nameOfConnector
    payload.ga_raw_schema = this.dataSetNameGa.nameOfConnector
    payload.magento_database = this.app.helperService.getDestinationCustom()
    payload.magento_intermediate_schema = this.dataSetNameGa.nameOfConnector+"_"+this.dataSetNameMa.nameOfConnector+"_intermediate"
    payload.magento_raw_schema = this.dataSetNameMa.nameOfConnector
    payload.magento_reporting_schema = this.dataSetNameGa.nameOfConnector+"_"+this.dataSetNameMa.nameOfConnector+"_reporting"
    payload.source = "custom-magento-ga4"
    payload.run_env = environment.domain == 'staging' ? "dev" : "prod"
    payload.dataset_location = this.app.helperService.getDestinationRegion()
    
    this.transformPayloadMultiple.push(payload)
 
    this.app.productService.generateReports(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.GAMagentoworkspace(this.dataSetNameGa, this.dataSetNameMa)
        }else{
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



  convertToCapitalized(str:any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  GAMagentoworkspace(row:any, item:any){
    this.cloneMultiplePayload = []
    let tempservice = row.serviceOfConnector+"_"+item.serviceOfConnector
    let result = this.convertToCapitalized(tempservice)
    
    this.transformLoading = true
    let workspacename = row.nameOfConnector+"_"+item.nameOfConnector
    // let workspacename = 'ecom'
    let formData : FormData = new FormData()

    // formData.append('source_workspace', 'Magento_GA4_Template_Workspace');
    // formData.append('source_workspace', environment.ecommerceTemplateName || 'Magento_GA4_Template_Workspace');
    formData.append('source_workspace', environment.ecommerceTemplateName);
    formData.append('target_workspace', `${this.email} - ecom - ${Date.now()}`);
    formData.append('user_email', 'bi@convz.com')

    let payload = this.formDataConverterService.formDataToJson(formData)
   
    this.app.productService.cloneWorkspace(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.datasetid = res['data'].response.cloned_datasets[0].dataset_id
          this.groupid = res['data'].response.target_ws.target_group_id
          this.newValue = workspacename + "_reporting"
          this.cloneMultiplePayload.push({"dataset_id" : this.datasetid})
          this.generateReportMultiple(res['data'].response, row, item, this.transformPayloadMultiple, this.cloneMultiplePayload)
          // this.app.snackBar.open(res['msg'], 'Dismiss', {
          //   duration: MessageUtil.TIMEOUT_DURATION,
          //   panelClass: ['custom-snackbar']
          // })
        }else{
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

  generateReportMultiple(row: any, item: any, i: any, transform: any, clonedata: any){
    let dialogConfig = new MatDialogConfig()
    let type = 'ecommerce marketing'

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.disableClose = true
    dialogConfig.height = 'auto'
    dialogConfig.minWidth = '30vw'
    dialogConfig.data = {
      row,
      type,
      item,
      i,
      transform,
      clonedata
    }

    // this.dialog1.open(GenerateMultipleComponent, dialogConfig)
    // .afterClosed().subscribe( res => {
    //   if(res === 'Success'){
    //     this.updateDataset()
    //   }
    // })
  }


  updateDataset(){
    let formDatas : FormData = new FormData()
    formDatas.append('dataset_id', this.datasetid);
    formDatas.append('group_id', this.groupid);
    let temp = JSON.stringify([{"name": "Dataset2", "newValue": this.newValue}])
    formDatas.append('update_details', temp);
    let payload = this.formDataConverterService.formDataToJson(formDatas)
   
    this.app.productService.updateWorkspace(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.refreshDataset()
        }
        else{
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


  
refreshDataset(){
    let refreshData : FormData = new FormData()
    refreshData.append('dataset_id', this.datasetid)
    refreshData.append('group_id', this.groupid)
    let payload = this.formDataConverterService.formDataToJson(refreshData)
   
    this.app.productService.refreshWorkspace(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
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
        else{
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

  setType(value:any){
    this.typeset = value
  
  }
}