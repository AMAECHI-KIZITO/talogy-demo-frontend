import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddReportTemplateComponent } from './add-report-template/add-report-template.component';

@Component({
  selector: 'app-report-config',
  templateUrl: './report-config.component.html',
  styleUrls: ['./report-config.component.scss']
})
export class ReportConfigComponent implements OnInit {
  displayedColumnsBasic: string[] = [
    'select',
    'name',
    'status',
    'action'
  ];
  listData: MatTableDataSource<any> | any;
  selection = new SelectionModel<Element>(true, []);
  @ViewChild(MatPaginator) paginator : any;
  configReport: any;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {

    this.getConfigReport()
  }

  getConfigReport(){
    this.configReport = [
      { name: "Template Report 1", status: "Active"},
      { name: "Template Report 2", status: "Inactive"},
      { name: "Template Report 3", status: "Active"},
    ]

    this.listData = new MatTableDataSource(this.configReport)
    this.listData.paginator = this.paginator
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listData.data.forEach((element:any) => this.selection.select(element));
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;

  }

  config(){
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.width = '35vw'

    this.dialog.open(AddReportTemplateComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if(res === 'success'){

        }
      })
  }




}
