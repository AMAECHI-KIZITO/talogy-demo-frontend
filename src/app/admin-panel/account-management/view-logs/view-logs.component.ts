import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { getDate } from 'src/app/helpers/dateformat';
import { userLogsPayload } from 'src/app/model/productModel';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-view-logs',
  templateUrl: './view-logs.component.html',
  styleUrls: ['./view-logs.component.scss']
})
export class ViewLogsComponent implements OnInit {

  displayedUserColumns: string[] = ['select','email', 'time'];
  listUserData: MatTableDataSource<any> | any;
  filter : FormGroup
  selectionUser = new SelectionModel<Element>(true, []);
  searchKey: string = '';
  userList: any = []
  loading: boolean = false
  error: boolean = false
  startDate: any;
  endDate: any;

  @ViewChild(MatPaginator) paginator: any;
  constructor(private dialog: MatDialogRef<ViewLogsComponent>, 
    @Inject(MAT_DIALOG_DATA) public item : any,
    private app: AppService, private dialog1: MatDialog, private fb: FormBuilder) {

      this.filter = this.fb.group({
        startdate: [''],
        enddate: [''],
      });
    }

  ngOnInit(): void {
    console.log(this.item);
    this.getList()
  }

  getList(){
    this.loading = true
    let payload = new userLogsPayload
    payload.endDate = this.filter.value.enddate ? this.endDate : "N/A"
    payload.startDate = this.filter.value.startdate ? this.startDate : "N/A"
    payload.organizationId = this.item.organizationId
    

    this.app.productService.postUserLogs(payload)
    .subscribe({
      next : (res) => {
        if(res['status'] === true){
          this.loading = false
          this.userList = res['logonAudit']
          this.listUserData = new MatTableDataSource(this.userList)
          this.listUserData.paginator = this.paginator
          
        }else{
          this.loading = false
          this.error = true 
          this.userList = []
        }
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.userList = []
      }
    })
    // this.userList = [
    //   {userName: "Jamiu Onimisi", email: "jamiu@convz.com", status: 'activated'}
    // ];
    // this.listUserData = new MatTableDataSource(this.userList)
  }

  close(){
    this.dialog.close()
  }

  getInitials(string:any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  masterUserToggle() {
    this.isAllUserSelected() ?
      this.selectionUser.clear() :
      this.listUserData.data.forEach((element:any) => this.selectionUser.select(element));
  }


  isAllUserSelected() {
    const numSelected = this.selectionUser.selected.length;
    const numRows = this.listUserData.data.length;
    return numSelected === numRows;

  }
  checkUserSelected(row:any) {
    return this.selectionUser.isSelected(row)
  }
  toggleUserRow(row:any) {
    this.selectionUser.isSelected(row) ? this.selectionUser.deselect(row) : this.selectionUser.select(row)
  }

  applyFilters() {
    this.listUserData.filterPredicate = (data:any, filter:any) => {
      const email = data.userInvolved?.useremail?.toLowerCase() || '';
      const description = data.description?.toLowerCase() || '';
      const timestamp = data.timeStamp?.toLowerCase() || '';
      
      // Check if any property matches the filter
      return email.includes(filter) || description.includes(filter) || timestamp.includes(filter);
    };
    this.listUserData.filter = this.searchKey.trim().toLowerCase();
  }

  formatStartDate(event: any) {
    this.startDate = getDate(event.value);
  }
  formatEndDate(event: any){
    this.endDate = getDate(event.value)
  }

  exportToExcel() {
    const dataToExport = this.userList.map((item: any) => ({
      Email: item.userInvolved?.useremail || '',
      Timestamp: item.timeStamp || ''
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'User Logs': worksheet }, SheetNames: ['User Logs'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blobData: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    FileSaver.saveAs(blobData, `user_logs_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
  
  exportToPDF() {
    const doc = new jsPDF();
  
    const tableData = this.userList.map((item: any) => [
      item.userInvolved?.useremail || '',
      item.timeStamp || ''
    ]);
  
    autoTable(doc, {
      head: [['User Email', 'Time (GMT)']],
      body: tableData,
    });
  
    doc.save(`user_logs_${new Date().toISOString().slice(0, 10)}.pdf`);
  }


}
