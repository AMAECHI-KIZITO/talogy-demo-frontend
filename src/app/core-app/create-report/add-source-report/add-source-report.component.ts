import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { MessageUtil } from 'src/app/helpers/messages';
import { adSourcePayload } from 'src/app/model/clientInfo';
import { FormDataToJsonService } from 'src/app/services/form-data-to-json.service';
import { alertModal } from 'src/app/services/ui.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { getDatasetId } from 'src/app/helpers/functions';

@Component({
  selector: 'app-add-source-report',
  templateUrl: './add-source-report.component.html',
  styleUrls: ['./add-source-report.component.scss']
})
export class AddSourceReportComponent implements OnInit {
  sourceList: any = [];
  loading: boolean = false
  otherList: any = []
  listTemp: any = []
  list: any = []
  listFilter: any = []
  listError: boolean = false

  connectorList: any = []
  finalListArray: any = []

  form: FormGroup
  active = 'facebook_ads'
  showList: any = []

  reportLoading: boolean = false
  reportError: boolean = false
  check: any

  show: any
  count: number = 0;

  datasetid: any;
  groupid: any; 
  newValue: any;
  updateLoading: any;
  updateError: boolean = false

  refreshLoading: any;
  refreshError: boolean = false
  transformLoading: boolean = false;
  transformError: boolean = false

  username: any;
  status = this.app.helperService.getClientStatus()
  email = this.app.helperService.getEmail()
  destination = this.app.helperService.getDestinationTitle()

  dataset: any
  datasetNew: any

  transformPayload: any
  clonePayload: any;

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<AddSourceReportComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public selectedRow: any, private app: AppService, private dialog1: MatDialog,
    private formDataConverterService: FormDataToJsonService) {

    this.form = this.fb.group({
      'source_name': ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.sourceList = [
      { name: "Facebook Ads", value: "facebook_ads", image: "assets/svg/facebookads.svg", active: true },
      { name: "Google Ads", value: "google_ads", image: "assets/svg/Googleads.svg", active: true },
      { name: "LinkedIn Ads", value: "linkedin_ads", image: "assets/img/img10-removebg-preview.png", active: true },
      { name: "Pinterest Ads", value: "pinterest_ads", image: "assets/svg/pintrestads.svg", active: true },
      { name: "Snapchat Ads", value: "snapchat_ads", image: "assets/svg/snapchat.svg", active: true },
      { name: "TikTok Ads", value: "tiktok_ads", image: "assets/svg/tiktokads.png", active: true },
      { name: "Reddit Ads", value: "raddit_ads", image: "assets/svg/radit.svg", active: true },
      { name: "Twitter Ads", value: "twitter_ads", image: "assets/img/image23.png", active: true }

    ]
    this.getUserConnector()
    // this.getSource()
  }

  // getSource() {

  //   this.list = [
  //     { connectorname: "FacebookAds_001_test", value: "FacebookAds_001_test", name: "facebook_ads" },
  //     { connectorname: "FacebookAds_002_test", value: "FacebookAds_002_test", name: "facebook_ads" },
  //     { connectorname: "GoogleAds_001_test", value: "GoogleAds_001_test", name: "google_ads" },
  //     { connectorname: "GoogleAds_002_test", value: "GoogleAds_002_test", name: "google_ads" },
  //     { connectorname: "LinkedInAds_001_test", value: "LinkedInAds_001_test", name: "linkedin_ads" },
  //     { connectorname: "LinkedInAds_002_test", value: "LinkedInAds_002_test", name: "linkedin_ads" },
  //     { connectorname: "PinterestAds_001_test", value: "PinterestAds_001_test", name: "pinterest_ads" },
  //     { connectorname: "PinterestAds_002_test", value: "PinterestAds_002_test", name: "pinterest_ads" },
  //     { connectorname: "SnapchatAds_001_test", value: "SnapchatAds_001_test", name: "snapchat_ads" },
  //     { connectorname: "SnapchatAds_002_test", value: "SnapchatAds_002_test", name: "snapchat_ads" },
  //     { connectorname: "TikTokAds_001_test", value: "TikTokAds_001_test", name: "tiktok_ads" },
  //     { connectorname: "TikTokAds_002_test", value: "TikTokAds_002_test", name: "tiktok_ads" },
  //     { connectorname: "RedditAds_001_test", value: "RedditAds_001_test", name: "raddit_ads" },
  //     { connectorname: "RedditAds_002_test", value: "RedditAds_002_test", name: "raddit_ads" },
  //     { connectorname: "TwitterAds_001_test", value: "TwitterAds_001_test", name: "twitter_ads" },
  //     { connectorname: "TwitterAds_002_test", value: "TwitterAds_002_test", name: "twitter_ads" },
  //   ]
  //   this.listFilter = this.list.filter((res: any) => res.name === this.active)
  // }

  getUserConnector() {
    this.loading = true
    let user = this.app.helperService.getActiveid()
    this.app.productService.getBasicConnector()
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false
            this.list = res['connectors']

            this.listFilter = this.list.filter((item: any) => {
              return item.service == this.active;
            });


          } else {
            this.loading = false
            this.listError = true
            this.list = []
            this.listFilter = []

          }
        },
        error: (err) => {
          this.loading = false
          this.listError = true
          this.list = []
          this.listFilter = []
        }
      })
  }

  changeSource(item: any) {
    this.active = item
    
    this.form.get('source_name')?.enable()

    // this.listFilter = this.list.filter((res: any) => res.name === item)
    this.listFilter = this.list.filter((res: any) => res.service === item)
  }

  addSource() {
    let temp
    let valueForm = this.form.value.source_name.nameOfConnector


    if (this.active === 'facebook_ads') {
      temp = { "facebook_ads_schema": valueForm, "facebook_ads_database": this.app.helperService.getDestinationTitle(), "ad_reporting__facebook_ads_enabled": 'TRUE' }
    } else if (this.active === 'google_ads') {
      temp = { "google_ads_schema": valueForm, "google_ads_database": this.app.helperService.getDestinationTitle(), "ad_reporting__google_ads_enabled": 'TRUE' }
    } else if (this.active === 'linkedin_ads') {
      temp = { "linkedin_ads_schema": valueForm, "linkedin_ads_database": this.app.helperService.getDestinationTitle(), "ad_reporting__linkedin_ads_enabled": 'TRUE' }
    } else if (this.active === 'pinterest_ads') {
      temp = { "pinterest_ads_schema": valueForm, "pinterest_ads_database": this.app.helperService.getDestinationTitle(), "ad_reporting__pinterest_ads_enabled": 'TRUE' }
    } else if (this.active === 'snapchat_ads') {
      temp = { "snapchat_ads_schema": valueForm, "snapchat_ads_database": this.app.helperService.getDestinationTitle(), "ad_reporting__snapchat_ads_enabled": 'TRUE' }
    } else if (this.active === 'tiktok_ads') {
      temp = { "tiktok_ads_schema": valueForm, "tiktok_ads_database": this.app.helperService.getDestinationTitle(), "ad_reporting__tiktok_ads_enabled": 'TRUE' }
    } else if (this.active === 'raddit_ads') {
      temp = { "reddit_ads_schema": valueForm, "reddit_ads_database": this.app.helperService.getDestinationTitle(), "ad_reporting__reddit_ads_enabled": 'TRUE' }
    } else if (this.active === 'twitter_ads') {
      temp = { "twitter_ads_schema": valueForm, "twitter_ads_database": this.app.helperService.getDestinationTitle(), "ad_reporting__twitter_ads_enabled": 'TRUE' }
    }
    let t
    if (temp) {
      t = Object.keys(temp).filter((el: any) => {
        return el[0]
      })
    }

    this.showList.push({ name: this.form.value.source_name, value: this.active, temp: t })

    // console.log(this.showList);


    let currentIndex: number = 0;
    this.sourceList.forEach((element: any, index: number) => {
      if (element.value === this.active) {
        element.active = false
        currentIndex = index
        this.form.get('source_name')?.disable()
      }
    });
    this.count = 0
    // this.looper(currentIndex)
    this.connectorList.push(temp)
    this.form.reset()
  }

  looper(currentIndex: number) {
    this.count++
    if (this.count == 7) {

      return
    }

    if (this.sourceList[currentIndex + 1]?.active) {

      this.nextForm(currentIndex)
    } else {

      this.sourceList.map((el: any, index: number) => {
        if (index >= currentIndex) {
          if (el.active) {
            // this.active = this.sourceList[currentIndex].name
            this.getUserConnector()
            // this.nextForm(currentIndex)
          } else {
            currentIndex++
            if (currentIndex == 7) {
              this.looper(currentIndex)
            }
          }
        } else {
          if (currentIndex == 7) {
            currentIndex = -1


            this.looper(currentIndex)
          }
        }
      })
    }
  }

  nextForm(currentIndex: number) {
    this.active = this.sourceList[currentIndex + 1].name
    this.getUserConnector()
  }

  remove(item: any) {
    // Re-enable the source button
    this.sourceList.forEach((element: any) => {
      if (element.value === item.value) {
        element.active = true;
      }
    });

    // Remove from showList using a unique property
    const aIndex = this.showList.findIndex(
      (el: any) => el.name.designatedConnectorName === item.name.designatedConnectorName
    );
    if (aIndex !== -1) {
      this.showList.splice(aIndex, 1);
    }

    // Remove from connectorList based on temp keys
    const kIndex = this.connectorList.findIndex((e: any) =>
      item.temp?.some((l: any) => Object.keys(e).includes(l))
    );
    if (kIndex !== -1) {
      this.connectorList.splice(kIndex, 1);
    }
  }


  mergeObjectsFromArray(arr: { [key: string]: any }[]): { [key: string]: any } {
    const result: { [key: string]: any } = {};

    arr.forEach(item => {
      Object.keys(item).forEach(key => {
        result[key] = item[key];
      });
    });

    return result;
  }

  removeDotFromString(inputString: string): string {
    return inputString.replace(/\./g, '');
  }

  submitSource() {

    this.finalListArray = this.mergeObjectsFromArray(this.connectorList);
    this.reportLoading = true
    let a = this.email.split('@')
    this.username = this.removeDotFromString(a[0])
    // this.dataset = `ads_reporting_${this.username}`
    this.dataset = `ads_rep`
    // this.datasetNew = 'fbads_s1_convz_tochukwu_152716_202547'

    // this.datasetNew = ''
    let connlist = this.sourceList.map((e: any) => e.value)
    
    this.connectorList.map((e: any) => {
      let k: string = ''
      connlist.map((m: string) => {
        let b = e[m + '_schema']
        if(b) k = b
      })
      this.datasetNew = this.datasetNew ? this.datasetNew + '_' + k : k
    })


    let payload = new adSourcePayload
    payload.connector = this.datasetNew
    payload.run_var = this.finalListArray
    payload.source = "ad-reporting"
    payload.run_env = environment.domain == 'staging' ? "dev" : "prod"
    payload.dataset_location = this.app.helperService.getDestinationRegion()
    this.transformPayload = [payload]

    console.log(payload)


    this.app.productService.generateReports(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.workspaceReport()
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

  workspaceReport() {
    // let tempservice = row.service
    // let result = this.convertToCapitalized(tempservice)

    this.transformLoading = true
    let formData: FormData = new FormData()

    // formData.append('source_workspace', 'Ad_Reporting_Template_Workspace');
    // formData.append('source_workspace', 'Ad_Source_Staging ');
    // formData.append('source_workspace', environment.adSourceTemplateName || 'Ad_Source_Staging ');
    formData.append('source_workspace', environment.adSourceTemplateName);
    formData.append('target_workspace', `${this.email} - ${this.dataset} ${Date.now()}`);
    formData.append('user_email', 'bi@convz.com')

    let payload = this.formDataConverterService.formDataToJson(formData)

    this.app.productService.cloneWorkspace(payload)
      .subscribe({
        next: (res) => {
          // if(res.data.response !== null){
          if (res['status'] === true) {
            this.datasetid = res['data'].response.cloned_datasets[0].dataset_id
            this.groupid = res['data'].response.target_ws.target_group_id
            this.newValue = this.dataset
            this.generateReport(res['data'].response, this.transformPayload, this.clonePayload)
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

  convertToCapitalized(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  generateReport(row: any, transform: any, clonedata: any) {
    let dialogConfig = new MatDialogConfig()

    let type = 'ad source'

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.disableClose = true
    dialogConfig.height = 'auto'
    dialogConfig.minWidth = '30vw'
    dialogConfig.data = {
      row, type,
      transform, clonedata
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
    let temp = JSON.stringify([{ "name": "Dataset", "newValue": getDatasetId('ad source', this.newValue) }])
    let testing = JSON.stringify([
      {
        "name": "dataset_name",
        "newValue": `${getDatasetId('ad source', this.datasetNew)}`
      },
      {
        "name": "gbq_project_name",
        "newValue": `${this.destination}`
      }
    ])
    formDatas.append('update_details', testing);
    let payload = this.formDataConverterService.formDataToJson(formDatas)
    this.clonePayload = [payload]


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
            setTimeout(() => {
              this.transformLoading = false
              this.reportLoading = false
              this.dialog.close()
              this.success()
            }, 20000);
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

  close() {
    this.dialog.close()
  }
  reset() {
    this.onKey('')
  }

  onKey(value: string) {
    this.otherList = this.search(value);

  }
  search(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.listFilter
    }
    return this.listFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().startsWith(keyWord)
      }
    });
  }


}
