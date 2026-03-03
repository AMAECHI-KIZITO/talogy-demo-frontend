import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-user-audit-trail',
  templateUrl: './user-audit-trail.component.html',
  styleUrls: ['./user-audit-trail.component.scss']
})
export class UserAuditTrailComponent implements OnInit {
  displayedColumns: string[] = ['email', 'description', 'timestamp'];
  listData: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  auditList: any = [];
  loading: boolean = false;
  error: boolean = false;
  searchKey: string = '';

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.getAuditTrail();
  }

  getAuditTrail() {
    this.loading = true;
    this.app.productService.getUsersAuditTrail()
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false;
            this.error = false;
            this.auditList = res['data'];
            this.listData = new MatTableDataSource(this.auditList);
            this.listData.paginator = this.paginator;
            this.listData.filterPredicate = (data: any, filter: string) =>
              data.userInvolved?.useremail?.toLowerCase().includes(filter) ||
              data.description?.toLowerCase().includes(filter);
          } else {
            this.loading = false;
            this.error = true;
            this.auditList = [];
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = true;
          this.auditList = [];
        }
      });
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
}
