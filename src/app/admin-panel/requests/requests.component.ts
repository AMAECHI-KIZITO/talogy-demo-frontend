import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { getDate } from 'src/app/helpers/dateformat';
import { updateRequestPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  searchKey: string = '';
  connectList: any = []
  connectListFilter: any = []

  list: any = []
  requestList: any = []
  loading: boolean = false
  error: boolean = false

  orgList: any = []
  orgListFilter: any = []
  startDate: any;
  endDate: any;

  org: any;
  type:any;
  dateRange:any
  setView: boolean = false
  requestName: any;
  requestDate: any
  requestType: any;
  region: any;
  sub:any;
  info:any
  url: any;
  source: any;
  status: any;
  filter: FormGroup
  filterLoading: boolean = false

  orgError: boolean = false
  orgloading: boolean = false

  todayDate: Date = new Date()

  showResolvedRequests = false;

  reportCount = 1
  isNext : any;

  isExist: any;
  showCancel: boolean = false

  reqeustId: any;

  markLoading: boolean = false
  markError: boolean = false 

  constructor(private fb: FormBuilder, private app: AppService, private dialog1: MatDialog) { 

    this.filter = this.fb.group({
      type: [""],
      org: [""],
      startdate: [''],
      enddate: [''],
    });
  }

  ngOnInit(): void {
    this.getRequestList()
    this.getOrg()
    this.getList()
  }

  reset() {
    this.onKey('')
    this.onKeyOrg('')
  }

  show(item: any){
   
  }

  convertToDate(dateString: any) {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-indexed
    const year = dateObj.getFullYear();

    return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
}

  getList(){
    this.loading = true
    let status = null
    let type = this.filter.value.type ? this.filter.value.type : null
    let organisation = this.filter.value.org ? this.filter.value.org : null
    let fromDate = this.filter.value.startdate ? this.convertToDate(this.filter.value.startdate) : null
    let toDate = this.filter.value.enddate ? this.convertToDate(this.filter.value.enddate) : null

    this.app.productService.getRequest(status, type, organisation, fromDate, toDate)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.loading = false
          this.error = false
          this.requestList = res['requests']
           this.isExist = this.requestList.some((request : any) => request.requestStatus === 'closed');
          this.list = this.requestList
          this.filter.reset()
        }else{
          this.loading = false
          this.error = true
          this.requestList = []
        }
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.requestList = []
      }
    })
   
   
  }


  filterRequests() {
    if (this.showResolvedRequests) {
      return this.requestList.filter((request:any) => request.requestStatus === 'closed');
    } else {
      return this.requestList;
    }
  }



  getRequestList(){
    this.connectList = [
      {name: "Report Request", value: "report"},
      {name: "Destination Request", value: "destination"},
      {name: "Connector", value: "connector"},

    ]

    this.connectListFilter = this.connectList
  }

  getOrg(){
    this.orgloading = true
    this.app.productService.getOrganisation()
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.orgloading = false
          this.orgError = false
          this.orgList = res['organizations']
          this.orgListFilter = this.orgList
        }else{
          this.orgloading = false
          this.orgError = true
          this.orgList = []
        }
      },
      error: (err) => {
        this.orgloading = false
        this.orgError = true 
        this.orgList = []
      }
    })
    

   
  }

  filters() {
    let val = this.searchKey.toLowerCase().trim(); // Convert search key to lowercase and remove leading/trailing spaces
    if (val === '') {
      // If search key is empty, return the original list
      this.requestList= this.list.slice(); // Assuming you have a copy of the original list stored in 'originalReportList'
      return;
    }
    this.requestList= this.requestList.filter((el: any) => {
      if (el.name.toLowerCase().includes(val)) {
        return el; // If name includes the search key, keep it in the list
      }
    });
  }

  onKey(value: string) {
    this.connectList = this.search(value);

  }

  search(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.connectListFilter
    }
    return this.connectListFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  onKeyOrg(value: string) {
    this.orgList = this.searchOrg(value);

  }

  searchOrg(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.orgListFilter
    }
    return this.orgListFilter.filter((option: any) => {
      if (option.organizationName) {
        return option.organizationName.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }

  formatStartDate(event: any) {
    this.startDate = getDate(event.value);
  }
  formatEndDate(event: any){
    this.endDate = getDate(event.value)
  }

  viewMore(item: any){
    this.requestType = item.requestType
    this.requestName = item.requestType === 'destination' ? item.requestDetails.name : item.requestType === 'report' ? item.requestDetails.category : "N/A"
    this.requestDate = item.requestDate
    this.source = item.requestDetails.source ? item.requestDetails.source : "N/A"
    this.url = item.requestDetails.link ? item.requestDetails.link : "N/A"
    this.info = item.requestDetails.description ? item.requestDetails.description : "N/A"
    this.status = item.requestStatus
    this.sub = item.requestDetails.subscription
    this.region = item.requestDetails.region
    this.setView = true
    this.reqeustId = item.reqId
  }
  
  mark(){
    this.markLoading = true
    let payload = new updateRequestPayload
    payload.id = this.reqeustId

    this.app.productService.updateRequest(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.markLoading = false
          this.markError = false
          this.setView = false
          this.getList()
        }else{
          this.markLoading = false
          this.markError = true
          this.errorDialog(res['message'])
        }
      },
      error: (err) => {
        this.markLoading = false
        this.markError = true 
        this.errorDialog(err)
      }
    })

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

  back(){
    this.setView = false
  }

  nextReport(){
    // this.reportCount = this.reportCount + 1
    // this.getReport()
  }
  previousReport(){
    // this.reportCount = this.reportCount - 1
    // this.getReport()
  }





}
