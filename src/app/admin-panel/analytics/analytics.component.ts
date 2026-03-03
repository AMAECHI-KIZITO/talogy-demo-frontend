import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Chart from 'chart.js/auto';
import { AppService } from 'src/app/app.service';
import { Util } from 'src/app/helpers/utilities';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  public lineChart!: Partial<any>;
  public barChart!: Partial<any>;
  public stackedChart!: Partial<any>;

  activeLoading: boolean = false;
  activeUsersData: any;
  activeFilter: string = 'daily';

  signupsLoading: boolean = false;
  signupsUsersData: any;
  signupsFilter: string = 'daily';

  periodicLoading: boolean = false;
  periodicData: any;
  periodicFilter: string = 'daily';

  overallReportLoading: boolean = false;
  overallReportData: any;

  organizationalLoading: boolean = false;
  organizationalData: any;

  orgUsersLoading: boolean = false;
  orgUsersData: any;
  orgUsersFilter: string = 'daily';

  orgLoginLoading: boolean = false;
  orgLoginData: any = [];
  orgLoginFilter: any;
  orgLoginList: any = [];

  orgReportsData: any = [];

  popularReportsData: any = [];

  constructor(private app: AppService, private dialog: MatDialog) { }

  organizations: any = [
    { organization: 'Datae', active_users: 5, total_users: 7, date: 'Today 10:42 AM' },
    { organization: 'Mazeed', active_users: 3, total_users: 4, date: 'Today 9:14 AM' },
    { organization: 'Datae', active_users: 5, total_users: 7, date: 'Today 10:42 AM' },
    { organization: 'Mazeed', active_users: 3, total_users: 4, date: 'Today 9:14 AM' },
  ];

  ngOnInit(): void {
    this.getActiveUsers()
    this.getUserSignups()
    this.getPeriodicReportsInsights()
    this.getOverallReportsInsights()
    this.getOrganizationalInsights()
    this.getOrganizationalActiveUsers()
  }

  getActiveUsers(period: string = 'daily') {
    this.activeLoading = true
    this.app.productService.getActiveUsers(period)
      .subscribe({
        next: res => {
          this.activeLoading = false
          this.activeUsersData = res.data
        }, error: err => {
          this.activeLoading = false
        }
      })
  }

  getUserSignups(period: string = 'daily') {
    this.signupsLoading = true
    this.app.productService.getUserSignups(period)
      .subscribe({
        next: res => {
          this.signupsLoading = false
          this.signupsUsersData = res.statistics
        }, error: err => {
          this.signupsLoading = false
        }
      })
  }

  getPeriodicReportsInsights(period: string = 'daily') {
    this.periodicLoading = true
    this.app.productService.getPeriodicReportsInsights(period)
      .subscribe({
        next: res => {
          this.periodicLoading = false
          this.periodicData = res.statistics
        }, error: err => {
          this.periodicLoading = false
        }
      })
  }

  getOverallReportsInsights() {
    this.overallReportLoading = true
    this.app.productService.getOverallReportsInsights()
      .subscribe({
        next: res => {
          this.overallReportLoading = false
          this.overallReportData = res.statistics
          this.orgReportsData = res.statistics.reportsPerOrganization
          this.popularReportsData = res.statistics.mostUsedTemplates

          this.prepareBarChart()
          this.prepareStackedChart()

        }, error: err => {
          this.overallReportLoading = false
        }
      })
  }

  getOrganizationalInsights() {
    this.organizationalLoading = true
    this.app.productService.getOrganizationalInsights()
      .subscribe({
        next: res => {
          this.organizationalLoading = false
          this.organizationalData = res.statistics
          this.orgLoginList = res.statistics?.breakdown?.organizationList || []

          if (this.orgLoginList.length) {
            this.orgLoginFilter = this.orgLoginList[0]._id
            this.getOrganizationLoginFrequency(this.orgLoginFilter)
          }

        }, error: err => {
          this.organizationalLoading = false
        }
      })
  }

  getOrganizationalActiveUsers(period: string = 'daily') {
    this.orgUsersLoading = true
    this.app.productService.getOrganizationalActiveUsers(period)
      .subscribe({
        next: res => {
          this.orgUsersLoading = false
          this.orgUsersData = res.data
        }, error: err => {
          this.orgUsersLoading = false
        }
      })
  }

  getOrganizationLoginFrequency(org: any) {
    this.orgLoginLoading = true
    this.app.productService.getOrganizationLoginFrequency(org)
      .subscribe({
        next: res => {
          this.orgLoginLoading = false
          this.orgLoginData = res.statistics
          this.prepareLineChart()
        }, error: err => {
          this.orgLoginLoading = false
        }
      })
  }

  prepareLineChart() {
    let labels: string[] = []
    let data: number[] = []

    this.orgLoginData.filter((l: any) => {
      let k = Object.keys(l)
      let formk = this.changeStringtoDate(k[0])

      labels.push(formk)
      data.push(l[k[0]])
    })

    this.lineLabels = labels
    this.lineData = data

    if (this.lineChart) {
      this.lineChart['destroy']();
    }
    this.setLineChart()
  }

  prepareBarChart() {
    let labels: string[] = []
    let data: number[] = []

    this.orgReportsData.filter((l: any) => {
      labels.push(l.organizationName)
      data.push(l.totalReports)
    })

    this.barLabels = labels
    this.barData = data

    if (this.barChart) {
      this.barChart['destroy']();
    }
    this.setBarChart()
  }

  prepareStackedChart() {
    let labels: string[] = []
    let data: number[] = []

    this.popularReportsData.filter((l: any) => {
      let k = Object.keys(l)

      labels.push(k[0])
      data.push(l[k[0]])
    })

    this.stackedLabels = labels
    this.stackedData = data

    if (this.stackedChart) {
      this.stackedChart['destroy']();
    }
    this.setStackedChart()
  }

  changeStringtoDate(date: string): string {
    let d = date.split('-')
    let month = Util.months.find(k => k.month == d[1])?.abbr || '';
    let day = d[2]
    return month + ' ' + day
  }


  ngAfterViewInit(): void {
  }

  lineLabels: string[] = []
  lineData: number[] = []

  setLineChart() {
    this.lineChart = new Chart('linecanvas', {
      type: "line",
      data: {
        labels: [...this.lineLabels],
        datasets: [{
          data: [...this.lineData],
          fill: false,
          borderColor: '#1976d2',
          tension: 0.1
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false
            },

          },
        },
      },
    })
  }

  barLabels: string[] = []
  barData: number[] = []

  setBarChart() {
    this.barChart = new Chart('barcanvas', {
      type: "bar",
      data: {
        labels: [...this.barLabels],
        datasets: [{
          data: [...this.barData],
          backgroundColor: '#1976d2',
          barThickness: 15,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false
            },
          },
        },
      },
    })
  }

  stackedLabels: string[] = []
  stackedData: number[] = []

  setStackedChart() {
    this.stackedChart = new Chart('stackedcanvas', {
      type: "bar",
      data: {
        labels: [...this.stackedLabels],
        datasets: [{
          data: [...this.stackedData],
          backgroundColor: '#1976d2',
          barThickness: 10,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            border: {
              display: false
            },
          },
        },
      },
    })
  }

  check() {
    console.log('i work');
  }

  openDetails(type: string) {
    let data: any;
    let name: string = ''

    if (type == 'active_users') {
      data = this.activeUsersData.activeUsers
      name = 'Active Users'
    }

    if(type == 'new_user'){
      data = this.signupsUsersData.breakdown
      name = 'New User Signups'
    }

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.minWidth = '40vw';
    dialogConfig.data = {data: data, type: type, name: name}
    this.dialog
      .open(DetailsComponent, dialogConfig)
  }
}
