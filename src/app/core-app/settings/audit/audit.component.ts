import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  selection = new SelectionModel<Element>(true, []);

  auditList: any;
  auditError: boolean = false;
  loading: boolean = false;
  searchKey: string = '';
  displayedColumns: string[] = ['select','email', 'time', 'description'];
  auditData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private app: AppService, private dialog: MatDialog)  { }

  ngOnInit(): void {
    this.getAudit()
  }

  getAudit() {
    this.loading = true;
    this.app.productService.getAuditList().subscribe({
      next: (res) => {
        if (res['status'] === true) {
          this.loading = false;
          this.auditError = false;
          this.auditList = res['data'];

          this.auditData = new MatTableDataSource(this.auditList);
          this.auditData.paginator = this.paginator;
        } else {
          this.loading = false;
          this.auditError = true;
          this.auditList = [];
        }
      },
      error: (err) => {
        this.loading = false;
        this.auditError = true;
        this.auditList = [];
      },
    });
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.auditData.data.forEach((element: any) =>
          this.selection.select(element)
        );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.auditData.data.length;
    return numSelected === numRows;
  }

  applyFilters() {
    this.auditData.filterPredicate = (data:any, filter:any) => {
      const email = data.userInvolved?.useremail?.toLowerCase() || '';
      const description = data.description?.toLowerCase() || '';
      const timestamp = data.timeStamp?.toLowerCase() || '';
      
      // Check if any property matches the filter
      return email.includes(filter) || description.includes(filter) || timestamp.includes(filter);
    };
    this.auditData.filter = this.searchKey.trim().toLowerCase();
  }

}
