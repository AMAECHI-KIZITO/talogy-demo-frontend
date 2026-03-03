import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { getDate } from 'src/app/helpers/dateformat';
import { MessageUtil } from 'src/app/helpers/messages';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-advance-connector',
  templateUrl: './advance-connector.component.html',
  styleUrls: ['./advance-connector.component.scss'],
})
export class AdvanceConnectorComponent implements OnInit {
  searchKey2: string = '';
  displayedColumns1: string[] = [
    'name',
    'schema',
    'service',
    'status',
    'created_at',
  ];
  listData1: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: any;

  customLoading: boolean = false;
  customList: any = [];
  customError: boolean = false;
  customTempList: any = [];

  filterGroup: FormGroup;

  reportStatus = [
    { name: 'Connected', value: 'Connected' },
    { name: 'In Progress', value: 'In Progress' },
    { name: 'Broken', value: 'Broken' },
  ];

  startDate: any;
  serviceList: any = [];
  serviceListFilter: any = [];

  listLoading: boolean = false;
  listError: boolean = false;
  list: any;

  constructor(
    private breadcrumb: BreadcrumbService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private app: AppService
  ) {
    this.filterGroup = this.fb.group({
      service: [''],
      status: [''],
      date: [this.startDate],
    });
  }

  ngOnInit(): void {
    this.getCustomConnector('');
    this.getService();

    this.getConnectorList();
  }

  getService() {
    this.serviceList = [
      { name: 'google_analytics', value: 'google_analytics' },
      { name: 'google_sheets', value: 'google_sheets' },
      { name: 'facebook_ads', value: 'facebook_ads' },
      { name: 'adjust', value: 'adjust' },
      { name: 'adobe_analytics', value: 'adobe_analytics' },
      { name: 'tiktok_ads', value: 'tiktok_ads' },
      { name: 'snapchat_ads', value: 'snapchat_ads' },
      { name: 'reddit_ads', value: 'reddit_ads' },
      { name: 'pinterest_ads', value: 'pinterest_ads' },
      { name: 'asana', value: 'asana' },
      { name: 'shopify', value: 'shopify' },
      { name: 'instagram_business', value: 'instagram_business' },
      { name: 'google_ads', value: 'google_ads' },
      { name: 'magento', value: 'magento' },
      { name: 'big_commerce', value: 'big_commerce' },
    ];
    this.serviceListFilter = this.serviceList;
  }

  gotoRoute() {
    this.router.navigate(['/app/create-connector']);
    window.analytics.track('button_clicked', {
      button_name: 'create_connector',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
  }

  handleClick() {
    window.analytics.track('filter_my_connector_start', {
      username: this.app.helperService.getEmail().split('@')[0],
      datae_user_id: this.app.helperService.getActiveid(),
      plan_type: this.app.helperService.getTrial(),
      user_role: this.app.helperService.getRole(),
      organisation_name: this.app.helperService.getOrg(),
    });
  }

  getCustomConnector(item: any) {
    this.customTempList = [];
    this.customLoading = true;
    let user = this.app.helperService.getActiveid();
    let status = this.filterGroup.value.status
      ? this.filterGroup.value.status
      : null;
    let service = this.filterGroup.value.service
      ? this.filterGroup.value.service
      : null;
    let date = this.filterGroup.value.date
      ? getDate(this.filterGroup.value.date)
      : null;
    let schema = '';
    this.app.productService
      .getCustomConnector(user, service, status, date, schema)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            if (item == 'Refresh') {
              window.analytics.track('refresh_connectors', {
                username: this.app.helperService.getEmail().split('@')[0],
                datae_user_id: this.app.helperService.getActiveid(),
                plan_type: this.app.helperService.getTrial(),
                user_role: this.app.helperService.getRole(),
                organisation_name: this.app.helperService.getOrg(),
              });
            }
            if (item == 'Filter') {
              window.analytics.track('filter_my_connectors_apply', {
                service: this.filterGroup.value.service
                  ? this.filterGroup.value.service
                  : null,
                status: this.filterGroup.value.status
                  ? this.filterGroup.value.status
                  : null,
                date_created: this.filterGroup.value.date
                  ? getDate(this.filterGroup.value.date)
                  : null,
                username: this.app.helperService.getEmail().split('@')[0],
                datae_user_id: this.app.helperService.getActiveid(),
                plan_type: this.app.helperService.getTrial(),
                user_role: this.app.helperService.getRole(),
                organisation_name: this.app.helperService.getOrg(),
              });
            }
            this.customLoading = false;
            this.customList = res['connectors'].reverse();
            this.listData1 = new MatTableDataSource(this.customList);
            this.listData1.paginator = this.paginator;
            this.customError = false;
          } else {
            this.customLoading = false;
            this.customList = [];
            this.customError = true;
          }
        },
        error: (err) => {
          this.customLoading = false;
          this.customList = [];
          this.customError = true;
        },
      });
  }

  getConnectorList() {
    this.listLoading = true;
    this.app.productService.getConnectorList().subscribe({
      next: (res) => {
        if (res['status'] === true) {
          this.listLoading = false;
          this.listError = false;
          this.list = res['connectors'];
        } else {
          this.listLoading = false;
          this.listError = true;
          this.list = [];
        }
      },
      error: (err) => {
        this.listLoading = false;
        this.listError = true;
        this.list = [];
      },
    });
  }

  submitFilter() {}

  applyFilters2() {
    this.listData1.filter = this.searchKey2.trim().toLowerCase();
  }
  clearSearch2() {
    this.searchKey2 = '';
    this.applyFilters2();
  }

  reset() {
    this.onKey('');
  }

  onKey(value: string) {
    this.serviceList = this.search(value);
  }

  search(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.serviceListFilter;
    }
    return this.serviceListFilter.filter((option: any) => {
      if (option.name) {
        return option.name.toString().startsWith(keyWord);
      }
    });
  }

  formatStartDate(event: any) {
    this.startDate = getDate(event.value);
  }
}
