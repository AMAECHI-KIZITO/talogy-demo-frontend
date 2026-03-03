import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { ViewReportComponent } from './view-report/view-report.component';
import { adminReportPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-report-workflow',
  templateUrl: './report-workflow.component.html',
  styleUrls: ['./report-workflow.component.scss']
})
export class ReportWorkflowComponent implements OnInit {

  filter: FormGroup
  loading: boolean = false
  reportList: any = [];
  reportError: boolean = false

  reportCount = 1
  isNext: any;

  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  selection = new SelectionModel<Element>(true, []);
  searchKey: string = '';
  myInnerHeight = window.innerHeight - 301;
  displayedColumns: string[] = ['select', 'name', 'createdat', 'status', 'action'];

  constructor(private app: AppService, private fb: FormBuilder, private dialog: MatDialog) {
    this.filter = this.fb.group({
      org: [""]
    });
  }

  ngOnInit(): void {
    this.getReport()
  }

  getReport() {
    this.loading = true
    this.app.productService.getReportsinProgress(this.reportCount)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false
            this.reportError = false
            this.reportList = res['data'].reports
            this.isNext = res['data'].isLastPage

            this.listData = new MatTableDataSource(this.reportList)
            this.listData.paginator = this.paginator
          } else {
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;

  }
  checkSelected(row: any) {
    return this.selection.isSelected(row)
  }
  toggleRow(row: any) {
    this.selection.isSelected(row) ? this.selection.deselect(row) : this.selection.select(row)
  }

  applyFilters() {
    this.listData.filter = this.searchKey.trim().toLowerCase()
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listData.data.forEach((element: any) => this.selection.select(element));
  }

  nextReport() {
    this.reportCount = this.reportCount + 1
    this.getReport()
  }

  previousReport() {
    this.reportCount = this.reportCount - 1
    this.getReport()
  }

  getInitials(string: any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  openReport(row: any) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "20%";
    dialogConfig.data = row;

    this.dialog.open(ViewReportComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res == 'success') {
          this.getReport()
        }
      })
  }

  enableReport(row: any) {
    let payload = new adminReportPayload
    payload.reportId = row._id
    payload.desiredStatus = 'disable'
    row.loading = true
    this.app.productService.updateStatusReportAdmin(payload)
      .subscribe({
        next: (res) => {
          row.loading = false
          if (res['status'] == true) {
            this.successDialog(res['message'])
            this.getReport()
          }
          else if (res['status'] == false) {
            this.errorDialog(res['message'])
          }
        },
        error: (err) => {
          row.loading = false
          this.errorDialog(err)
        }
      })
  }

  errorDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

  successDialog(item: any, msg?: string) {
    let alert: alertModal = {
      details: item,
      message: msg || 'Process Completed',
      type: 'SUCCESS',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }
}
