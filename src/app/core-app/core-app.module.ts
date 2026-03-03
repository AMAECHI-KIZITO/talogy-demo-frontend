import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreAppRoutingModule } from './core-app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreAppComponent } from './core-app.component';
import { ReportComponent } from './report/report.component';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { PowerbiDisplayComponent } from './report/powerbi-display/powerbi-display.component';
import { DeleteReportComponent } from './report/delete-report/delete-report.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { CreateReportDialogComponent } from './create-report/create-report-dialog/create-report-dialog.component';
import { AddSourceReportComponent } from './create-report/add-source-report/add-source-report.component';
import { MagentoGaReportComponent } from './create-report/magento-ga-report/magento-ga-report.component';
import { AdvanceConnectorComponent } from './advance-connector/advance-connector.component';
import { EnableDisableReportComponent } from './report/enable-disable-report/enable-disable-report.component';
import { AdjustReportComponent } from './create-report/adjust-report/adjust-report.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AiSearchComponent } from './ai-search/ai-search.component';
import { IntradayReportComponent } from './create-report/intraday-report/intraday-report.component';
import { SettingsComponent } from './settings/settings.component';
import { RequestReportComponent } from './create-report/request-report/request-report.component';
import { WaitlistPopupComponent } from './ai-search/waitlist-popup/waitlist-popup.component';
import { ShareReportComponent } from './report/share-report/share-report.component';
import { ManageAccessComponent } from './report/manage-access/manage-access.component';
import { ViewAccessComponent } from './report/view-access/view-access.component';
import { DisableAccessComponent } from './report/disable-access/disable-access.component';
import { FullscreenComponent } from './report/powerbi-display/fullscreen/fullscreen.component';
import { TestReportComponent } from './report/test-report/test-report.component';
import { SafePipe } from '../services/safe.pipe';
import { SideChatComponent } from './report/powerbi-display/side-chat/side-chat.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PipedriveReportComponent } from './create-report/pipedrive-report/pipedrive-report.component';
import { GbqChatComponent } from './ai-search/gbq-chat/gbq-chat.component';
import { GbqPopComponent } from './ai-search/gbq-pop/gbq-pop.component';





@NgModule({
  declarations: [
    CoreAppComponent,
    ReportComponent,
    PowerbiDisplayComponent,
    DeleteReportComponent,
    CreateReportComponent,
    CreateReportDialogComponent,
    AddSourceReportComponent,
    MagentoGaReportComponent,
    AdvanceConnectorComponent,
   
    EnableDisableReportComponent,
    AdjustReportComponent,
    AiSearchComponent,
    IntradayReportComponent,
    SettingsComponent,
    RequestReportComponent,
    WaitlistPopupComponent,
    ShareReportComponent,
    ManageAccessComponent,
    ViewAccessComponent,
    DisableAccessComponent,
    FullscreenComponent,
    TestReportComponent,
    SideChatComponent,
    PipedriveReportComponent,
    GbqChatComponent,
    GbqPopComponent,
  ],
  imports: [
    CommonModule,
    CoreAppRoutingModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    PowerBIEmbedModule
  ],
})
export class CoreAppModule { }
