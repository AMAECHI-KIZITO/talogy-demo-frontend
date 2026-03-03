import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';
import { powerbiToken } from 'src/app/model/clientInfo';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import { IReportEmbedConfiguration, models, Page, Report, service, VisualDescriptor } from 'powerbi-client';
import { PowerbiServiceService } from 'src/app/api/powerbi-service.service';

@Component({
  selector: 'app-manage-report',
  templateUrl: './manage-report.component.html',
  styleUrls: ['./manage-report.component.scss']
})
export class ManageReportComponent implements OnInit {
  workspaceid: any;
  reportid: any;
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

  eventHandlersMap:any
  reportConfig : any;
 

  constructor(private breadcrumb: BreadcrumbService, private router: ActivatedRoute,
    private app : AppService,public httpService: PowerbiServiceService ) { 
    let history;
    this.breadcrumb.breadcrumbObs$.subscribe(
      (item)=>{
        history = item
      }
    )

    this.breadcrumb.updateBreadcrumb({
      parent: 'Manage Report',
      parentLink: 'manage-report',
      children: []
    })
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe( res => {
      this.workspaceid = res['workspaceid']
      this.reportid = res['reportid']

      this.getToken()
    })

  }

  getToken(){
    this.loading = true
    let payload = new powerbiToken
    payload.report_id = this.reportid
    payload.workspace_id = this.workspaceid
    this.app.productService.getPowerbiToken(payload)
    .subscribe({
      next: (res) => {
        if(res && res['status'] === true){
          this.loading = false
          this.listToken = res['data']
          let temp : IReportEmbedConfiguration =
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
          
        }else{
          this.loading = false
          this.error = true
        }
      },
      error: (err) => {
        this.loading = false
        this.error = true
      }
    })
  }

  

}
