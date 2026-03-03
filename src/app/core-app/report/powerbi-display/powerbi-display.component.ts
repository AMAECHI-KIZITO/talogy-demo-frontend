import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import {
  IReportEmbedConfiguration,
  models,
  Page,
  Report,
  service,
  VisualDescriptor,
} from 'powerbi-client';
import { PowerbiServiceService } from 'src/app/api/powerbi-service.service';
import { ConfigResponse, powerbiToken } from 'src/app/model/clientInfo';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ScreenshortService } from 'src/app/services/screenshort.service';
import html2canvas from 'html2canvas';
import { domToPng } from 'modern-screenshot';
import { Location } from '@angular/common';
import { ShareReportComponent } from '../share-report/share-report.component';
import { MessageUtil } from 'src/app/helpers/messages';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { BehaviorSubject } from 'rxjs';
import { alertModal, UiService } from 'src/app/services/ui.service';

import * as pbi from 'powerbi-client'
import { gptChat } from 'src/app/model/productModel';
import { UtilService } from 'src/app/services/util.service';
import { Service } from 'service';
import { EncryptService } from 'src/app/services/encrypt.service';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';

@Component({
  selector: 'app-powerbi-display',
  templateUrl: './powerbi-display.component.html',
  styleUrls: ['./powerbi-display.component.scss'],
})
export class PowerbiDisplayComponent implements OnInit {
  workspaceid: any;
  reportid: any;
  datasetid: any;
  loading: boolean = false;
  error: boolean = false;
  listToken: any;

  dataList: any;

  // Track Report embedding status
  isEmbedded = false;

  // Overall status message of embedding
  displayMessage =
    'The report is bootstrapped. Click Embed Report button to set the access token.';

  // CSS Class to be passed to the wrapper
  // Hide the report container initially
  reportClass = 'report-container hidden';
  reportClassFull = 'report-container-full hidden';

  // Flag which specify the type of embedding
  phasedEmbeddingFlag = false;

  eventHandlersMap: any;

  reportConfig!: IReportEmbedConfiguration;

  reportData: any;

  downloadLoading: boolean = false;
  downloadError: boolean = false;
  isSideOpen: boolean = false;

  chatList: any = [];

  // @ViewChild('reportContainer', { static: false }) reportContainer!: ElementRef;
  shareloading: boolean = false;

  fullview: boolean = false;
  reportLoading: boolean = false;
  selectedReport: any;
  openChat: any;



  showBtnPrev: boolean = true;

  newToken = new BehaviorSubject<any>('')
  newToken$ = this.newToken.asObservable();
  id: string = ''

  constructor(
    private dialogref: MatDialogRef<FullscreenComponent>,
    public httpService: PowerbiServiceService,
    private app: AppService,
    private element: ElementRef<HTMLDivElement>,
    private router: ActivatedRoute,
    private ui: UiService,
    private encrypt: EncryptService,
    private breadcrumb: BreadcrumbService,
    private dialog1: MatDialog,
    private screenshotService: ScreenshortService,
    private location: Location
  ) {
    // this.breadcrumb.breadcrumbObs$.subscribe(
    //   (item) => {
    //     history = item
    //   }
    // )

    this.breadcrumb.updateBreadcrumb({
      parent: 'Report View',
      parentLink: 'report/report-view',
      children: [],
    });
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe((res) => {
      this.workspaceid = res['workspaceid'];
      this.reportid = res['reportid'];
      this.datasetid = res['datasetid'];
      this.id = res['id'];
      this.reportData = JSON.parse(res['data']);
    });

    if (this.reportData.type == 'PowerBI') {
      this.getToken();
    }
  }

  getSelectedReport() {
    this.reportLoading = true;
    let type = 'null';
    let status = 'null';

    this.app.productService.getBasicReport(type, status)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.reportLoading = false
            let list = res['reports']
            this.selectedReport = list.find((l: any) => l.reportid == this.reportid)

            if (this.selectedReport) {
              if (this.selectedReport.reportPlatform == 'Looker' || this.selectedReport.dbtProcessedName == 'No DBT data' || this.selectedReport.templateUsed == 'N/A') {
                this.selectedReport = ''
              } else this.sendNew()
            }
          }
          else {
            this.reportLoading = false
          }
        },
        error: (err) => {
          this.reportLoading = false
        }
      })
  }

  sendNew() {
    let message = "Can you tell me if I am connected to this report and tell me what it's about and what questions can I ask this report?";
    let payload: gptChat = {
      dataset_id: this.getDatasetId(this.selectedReport) || '',
      report_id: this.selectedReport._id,
      user_prompt: message || '',
      user: this.app.helperService.getActiveid(),
      gbq_project: this.app.helperService.getDestinationTitle()
    }

    this.app.productService.dataeGPTChat(payload)
      .subscribe({
        next: res => {
          if (res.status) {
            this.openChat = res.response
          } else {
            setTimeout(() => {
              this.openChat = res.response
            }, 1000);
          }
        }, error: err => {
        }
      })
  }

  getDatasetId(report: any) {
    switch (report.templateUsed.toLowerCase()) {
      case 'asana':
        return report.dbtProcessedName + '_intermediate';
      case 'adjust':
        return report.dbtProcessedName + '_intermediate';
      case 'intraday':
        return report.dbtProcessedName + '_reporting';
      case 'ecommerce marketing':
        return report.dbtProcessedName + '_reporting';
      case 'ad source':
        return report.dbtProcessedName + '_ad_reporting';
      default:
        return report.dbtProcessedName + '_reporting';
    }
  }

  downloadReport() {
    this.downloadLoading = true
    let url = window.location.href;

    this.app.productService.screenshotDownload(url)
      .subscribe({
        next: (res) => {
          if (res['status'] == true) {
            this.downloadLoading = false
          }
          else {
            this.downloadLoading = false
            this.downloadError = true
            this.errorDialog(res['message'])
          }

        },
        error: (err) => {
          this.downloadLoading = false
          this.downloadError = true
          this.errorDialog(err)
        }
      })
  }

  // shareReport() {
  //   if (this.reportContainer) {
  //     this.screenshotService
  //       .captureReport(this.reportContainer.nativeElement)
  //       .then((dataUrl) => {
  //         const link = document.createElement('a');
  //         link.href = dataUrl;
  //         link.download = 'report.png';
  //         link.click();
  //       })
  //       .catch((err) => {
  //         console.error('Error capturing screenshot:', err);
  //       });
  //   }
  // }

  // captureScreenshot() {
  //   const reportElement = this.reportContainer.nativeElement;
  //   domToPng(reportElement)
  //     .then((dataUrl: string) => {
  //       const link = document.createElement('a');
  //       link.href = dataUrl;
  //       link.download = 'report-screenshot.png';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     })
  //     .catch((error) => {
  //       console.error('Error capturing screenshot:', error);
  //     });
  // }

  shareReportEmail() {
    window.analytics.track('button_clicked', {
      button_name: 'share_report',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '30%';
    dialogConfig.data = { report: this.id, workspace: this.workspaceid, reportData: this.reportData };
    this.dialog1
      .open(ShareReportComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
        }
      });
  }

  preview() {
    this.ui.setCloseSide(true);
    this.showBtnPrev = false;
  }

  noPrev() {
    this.ui.setCloseSide(false);
    this.showBtnPrev = true;
  }

  openFullview() {
    window.analytics.track('button_clicked', {
      button_name: 'preview_report',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.width = '100vw';
    dialogConfig.height = '100vh';
    dialogConfig.backdropClass = 'back-drop';
    dialogConfig.panelClass = 'custom-popup';
    dialogConfig.data = {
      reportConfig: this.reportConfig,
      reportClass: this.reportClassFull,
      phasedEmbeddingFlag: this.phasedEmbeddingFlag,
      eventHandlersMap: this.eventHandlersMap,
      reportType: this.reportData.type,
      reportUrl: this.reportData.reporturl,
      timer: this.timer,
    };
    this.dialog1
      .open(FullscreenComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
        }
      });
  }

  getNewAccessToken() {
    // Code for generating new Azure AD token
    let token;
    this.newToken$.subscribe((tok) => token = tok);
    return token
  };

  filter: models.ReportLevelFilters = {
    $schema: "http://powerbi.com/product/schema#basic",
    operator: "In",
    filterType: models.FilterType.Basic,

    target: {
      table: 'performance_reporting',
      column: 'User'
    },
    values: [this.app.helperService.getEmail()],
  };

  embedPowerBIReport() {
    let temp: IReportEmbedConfiguration = {
      type: 'report',
      // embedUrl: this.listToken.reportConfig[0].embedUrl,
      embedUrl: this.listToken.embedUrl,
      tokenType: models.TokenType.Embed,
      accessToken: this.listToken.accessToken,
      filters: [this.filter],
      // eventHooks: {
      //   accessTokenProvider: getNewAccessToken,
      // },

      settings: {
        panes: {
          filters: {
            expanded: false,
            visible: false,
          },
        },
        background: models.BackgroundType.Transparent,
      },
    };
      console.log(this.reportid, 'report id');

    if(this.reportid == "8653593e-4eb0-43a6-ba54-1bf166b1b1e7"){
      console.log('filtered here');
      
      // temp.filters = [this.filter]
    }

    this.reportConfig = temp;


    // Initialize your Power BI embed configuration
    const embedConfig: pbi.IEmbedConfiguration = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken: this.listToken.accessToken,
      embedUrl: this.listToken.embedUrl,
      id: this.reportid,
      datasetId: this.reportid,


    };

    const powerbi = window['powerbi']
    let embedContainer = document.getElementById('reportContainer')!;

    // Set container size dynamically
    embedContainer.style.width = '100%';

    let report = powerbi.embed(embedContainer, embedConfig)

    // loaded,saved,rendered,saveAsTriggered,error,dataSelected,buttonClicked,info,filtersApplied,pageChanged,commandTriggered,swipeStart,swipeEnd,bookmarkApplied,dataHyperlinkClicked,visualRendered,visualClicked,selectionChanged,renderingStarted,blur. You passed: onchange

    report.on('loaded', (event) => {
      // console.log(event, 'report loaded');
    })
  }

  getToken(ref?: boolean) {
    if (!ref) this.loading = true;
    let payload = new powerbiToken();
    payload.report_id = this.reportid;
    payload.workspace_id = this.workspaceid;
    payload.dataset_id = this.datasetid;
    this.error = false

    this.app.productService.getPowerbiToken(payload).subscribe({
      next: (res) => {
        if (res['status'] === true) {
          // if (ref) {
          //   this.timerComplete = true;
          //   this.app.timertoken.next(-2);
          //   setTimeout(() => {
          //     this.timerComplete = false;
          //   }, 300);
          // }


          this.loading = false;
          this.listToken = res['data'];

          this.newToken.next(this.listToken.accessToken);

          if (ref) {
            this.updateAccessToken(res['data'].accessToken)
          } else {
            this.embedPowerBIReport()
            this.getSelectedReport();
          }

          this.endTime = new Date(res['data'].tokenExpiry);
          this.setTimer();



          // if (ref) {
          //   this.app.reportConfig.next(this.reportConfig)
          // }
        } else {
          this.loading = false;
          // this.errorDialog(res['message'])
          this.error = true;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  updateAccessToken(newAccessToken: string) {
    let embedContainer = document.getElementById('reportContainer')!;

    const report = window['powerbi'].get(
      embedContainer
    ) as Report;
    report
      .setAccessToken(newAccessToken)
      .catch((err) => console.error('Failed to update token', err));
    report.on('filtersApplied', (event) => {
      console.log(event, 'filtersApplied');
    })
  }

  errorDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000,
    };
    this.app.ui.setAlertStatus(alert);
  }

  openSide() {
    this.isSideOpen = !this.isSideOpen;
    this.app.uiService.drawerStatus.next(!this.isSideOpen);
  }

  saveChatList(arr: any) {
    this.chatList = arr;
  }

  inputDigit: any;
  timer: string = '';
  endTime: Date = new Date();
  timerComplete: boolean = false;

  setTimer() {
    // let time = 70;
    let timer = setInterval(() => {
      let time = parseInt(
        ((this.endTime.getTime() - new Date().getTime()) / 1000).toFixed()
      );
      // console.log(time);
      time = time - 1;
      if (time <= 61) {
        this.countDown();
        this.openAlert(time);
        clearInterval(timer);
      }
      // if (time <= 0) 
    }, 1000);
  }

  openAlert(time: number) {
    let alert: alertModal = {
      details: '',
      message: `This report will refresh in 1 minute`,
      type: 'INFO',
      duration: 10000,
      action: 'Refresh now',
    };
    this.app.ui.setAlertStatus(alert);
    this.app.ui.alertButton.asObservable().subscribe((click) => {
      if (click == 'Refresh now') {
        this.getToken(true);
        this.app.ui.clickAlertButton('');
      }
    });
  }

  countDown() {
    clearInterval(this.inputDigit);
    let start = 60;
    this.inputDigit = setInterval(() => {
      start = start - 1;
      this.app.timertoken.next(start);
      this.timer = '00:' + start.toString();
      if (start < 0) {
        this.getToken(true);
        clearInterval(this.inputDigit);
        this.timer = '';
      }
    }, 1000);
  }
}
