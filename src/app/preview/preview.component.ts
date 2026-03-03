import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { domToPng } from 'modern-screenshot';
import { PowerbiServiceService } from '../api/powerbi-service.service';
import { AppService } from '../app.service';
import { BreadcrumbService } from '../misc/breadcrumb/breadcrumb.service';
import { powerbiToken } from '../model/clientInfo';
import { ScreenshortService } from '../services/screenshort.service';
import { IReportEmbedConfiguration, models, Page, Report, service, VisualDescriptor } from 'powerbi-client';
import { alertModal } from '../services/ui.service';
import { CheckOtpComponent } from './check-otp/check-otp.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  workspaceid: any;
  reportid: any;
  datasetid: any;
  loading: boolean = false
  error: boolean = false
  listToken: any;

  // Track Report embedding status
  isEmbedded = false;

  // Overall status message of embedding
  displayMessage = 'The report is bootstrapped. Click Embed Report button to set the access token.';

  // CSS Class to be passed to the wrapper
  // Hide the report container initially
  reportClass = 'report-container hidden';

  // Flag which specify the type of embedding
  phasedEmbeddingFlag = false;

  eventHandlersMap: any
  reportConfig: any;

  downloadLoading: boolean = false
  downloadError: boolean = false

  @ViewChild('reportContainer', { static: false }) reportContainer!: ElementRef;
  reportData: any;

  token: string = '';

  constructor(public httpService: PowerbiServiceService, private app: AppService,
    private router: ActivatedRoute, private breadcrumb: BreadcrumbService, private dialog1: MatDialog, private screenshotService: ScreenshortService) {

    // this.breadcrumb.breadcrumbObs$.subscribe(
    //   (item) => {
    //     history = item
    //   }
    // )

    this.breadcrumb.updateBreadcrumb({
      parent: 'Report View',
      parentLink: 'report/report-view',
      children: []
    })
  }


  ngOnInit(): void {
    this.router.queryParams.subscribe(res => {
      // this.workspaceid = res['workspaceid']
      // this.reportid = res['reportid']
      this.token = res['token']
    })
    // this.getToken()
    this.getOtpCode()
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

  shareReport() {
    if (this.reportContainer) {
      this.screenshotService.captureReport(this.reportContainer.nativeElement).then(dataUrl => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'report.png';
        link.click();
      }).catch(err => {
        console.error('Error capturing screenshot:', err);
      });
    }
  }

  captureScreenshot() {
    const reportElement = this.reportContainer.nativeElement;
    domToPng(reportElement).then((dataUrl: string) => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'report-screenshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(error => {
      console.error('Error capturing screenshot:', error);
    });
  }

  getToken() {

    this.loading = true
    let payload = new powerbiToken
    payload.report_id = this.reportid
    payload.workspace_id = this.workspaceid
    payload.dataset_id = this.datasetid;

    this.app.productService.getPowerbiTokenNoAuth(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false
            this.listToken = res['data']

            let temp: IReportEmbedConfiguration =
            {
              type: 'report',
              embedUrl: this.listToken.embedUrl,
              tokenType: models.TokenType.Embed,
              accessToken: this.listToken.accessToken,
              settings: {
                panes: {
                  filters: {
                    expanded: false,
                    visible: false
                  }
                },
                background: models.BackgroundType.Transparent,
              }
            };
            this.reportConfig = temp
            this.eventHandlersMap = new Map<string, (event?: service.ICustomEvent<any>) => void>([

              [
                'rendered',
                () => {

                  // Set displayMessage to empty when rendered for the first time
                  if (!this.isEmbedded) {
                    this.displayMessage = 'Use the buttons above to interact with the report using Power BI Client APIs.';
                  }

                  // Update embed status
                  this.isEmbedded = true;
                },
              ],
              [
                'error',
                (event?: service.ICustomEvent<any>) => {
                  if (event) {
                    console.error(event.detail);
                  }
                },
              ],
            ]);

          } else {
            this.loading = false
            // this.errorDialog(res['message'])
            this.error = true

          }
        },
        error: (err) => {
          this.loading = false
          this.error = true
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

  getOtpCode() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.maxHeight = '40vh';
    dialogConfig.maxWidth = '30vw';
    dialogConfig.data = this.token
    this.dialog1
      .open(CheckOtpComponent, dialogConfig)
      .afterClosed().subscribe(el => {
        if (el) {
          console.log(el);
          this.workspaceid = el['workspaceId']
          this.reportid = el['reportId']
          this.datasetid = el['datasetId']
          this.getToken()
        }
      })
  }
}
