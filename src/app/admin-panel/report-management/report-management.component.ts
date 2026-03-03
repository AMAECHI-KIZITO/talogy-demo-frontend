import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { adminReportPayload } from 'src/app/model/productModel';
import { DeleteReportComponent } from './delete-report/delete-report.component';
import { EmbedReportComponent } from './embed-report/embed-report.component';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.scss']
})
export class ReportManagementComponent implements OnInit {

  reportList: any;
  reportError: boolean = false
  loading: boolean = false

  reportCount = 1
  isNext : any;

  orgList: any = []
  orgListFilter: any = []
  orgError: boolean = false
  orgloading: boolean = false

  filter: FormGroup

  pauseLoading: boolean = false
  pauseError: boolean = false

  filterLoading: boolean = false
  filterError: boolean = false



  searchKey: string = '';
  myInnerHeight = window.innerHeight - 301;
  displayedColumns: string[] = ['select','name','status', 'action'];
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator : any;

  selection = new SelectionModel<Element>(true, []);

  constructor(private app: AppService, private fb: FormBuilder, private dialog: MatDialog) { 
    this.filter = this.fb.group({
      org: [""]
    });
  }

  ngOnInit(): void {
    this.getReport()
    this.getOrg()
  }

  filterReport(){
    this.loading = true
    let user = null
    let client = this.filter.value.org.toLowerCase()

    this.app.productService.filterReport(this.reportCount,user,client)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.loading = false
          this.reportError = false
          this.reportList = res['data'].connectors
          this.isNext = res['data'].isLastPage

          this.filter.reset()

          this.listData = new MatTableDataSource(this.reportList)
          this.listData.paginator = this.paginator
        }else {
          this.loading = false
          this.reportError = true
          this.reportList = []
        }
      },
      error: (err) => {
        this.loading = true
        this.reportError = true 
        this.reportList = []
      }
    })
  }
  

  getReport(){
    this.loading = true
    this.app.productService.getReports(this.reportCount)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.loading = false
          this.reportError = false
          this.reportList = res.reports.filter((e: any) => e.status != 'in progress')
          // this.isNext = res['data'].isLastPage

          this.listData = new MatTableDataSource(this.reportList)
          this.listData.paginator = this.paginator
        }else{
          this.loading = false
          this.reportError = true
          this.reportList = []
        }
      },
      error: (err) => {
        this.loading = false
        this.reportError = true 
        this.reportList = []
      }
    })
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
  reset() {
    this.onKeyOrg('')
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

  nextReport(){
    this.reportCount = this.reportCount + 1
    this.getReport()
  }
  previousReport(){
    this.reportCount = this.reportCount - 1
    this.getReport()
  }


  applyFilters(){
    this.listData.filter = this.searchKey.trim().toLowerCase()
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listData.data.forEach((element:any) => this.selection.select(element));
  }

  truncateSentence(sentence: string, length: number): string {
    if (sentence.length <= length) {
      return sentence;
    } else {
      return sentence.substring(0, length) + '...';
    }
  }

  getTimeFromTimestamp(timestamp: any) {
    const dateObject = new Date(timestamp);
    const hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const seconds = dateObject.getUTCSeconds();

    const period = hours < 12 ? 'AM' : 'PM';

    const twelveHourFormat = `${String(hours % 12 || 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;

    return twelveHourFormat;
  }

  getInitials(string:any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  convertTimestampToDate(timestamp:any) {
    const dateObject = new Date(timestamp);
    const year = dateObject.getUTCFullYear() % 100; // Get the last two digits of the year
    const month = dateObject.getUTCMonth() + 1; // Months are zero-indexed, so add 1
    const day = dateObject.getUTCDate();
  
    // Format the date as M/D/YY
    const formattedDate = `${month}/${day}/${year}`;
  
    return formattedDate;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;

  }
  checkSelected(row:any) {
    return this.selection.isSelected(row)
  }
  toggleRow(row:any) {
    this.selection.isSelected(row) ? this.selection.deselect(row) : this.selection.select(row)
  }

  cloneReport(){
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.width = "30%"

    this.dialog.open(EmbedReportComponent, dialogConfig)
    .afterClosed().subscribe(res => {
      if(res == 'cloned'){
        this.getReport()
      }
    })
  }

  pauseReport(item:any){
    this.pauseLoading = true
    let payload = new adminReportPayload
    payload.reportId = item._id
    payload.desiredStatus = 'disable'
  
    this.app.productService.updateStatusReportAdmin(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] == true){
          this.pauseLoading = false
          this.getReport()
        }
        else if(res['status'] == false) {
          this.pauseLoading = false
          this.pauseError = true
          this.errorDialog(res['message'])
        }
      },
      error: (err) => {
        this.pauseLoading = false
        this.errorDialog(err)
      }
    })
  }

  delete(row: any) {
    let dialogConfig = new MatDialogConfig()

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.data = row

    this.dialog.open(DeleteReportComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res === 'deleted') {
          this.getReport()
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

}
