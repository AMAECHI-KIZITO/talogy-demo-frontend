import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AccountManagementComponent } from './account-management/account-management.component';
import { AdminPanelComponent } from './admin-panel.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { InviteUserComponent } from './user-management/invite-user/invite-user.component';
import { AdminAuditTrailComponent } from './admin-audit-trail/admin-audit-trail.component';
import { UserAuditTrailComponent } from './user-audit-trail/user-audit-trail.component';
import { SharedModule } from '../shared/shared.module';
import { ConnectorManagementComponent } from './connector-management/connector-management.component';
import { ReportManagementComponent } from './report-management/report-management.component';
import { RequestsComponent } from './requests/requests.component';
import { AddOrganisationComponent } from './account-management/add-organisation/add-organisation.component';
import { AddNewuserComponent } from './account-management/add-newuser/add-newuser.component';
import { ChangestatusComponent } from './account-management/changestatus/changestatus.component';
import { CustomConnectorComponent } from './connector-management/custom-connector/custom-connector.component';
import { BasicConnectorComponent } from './connector-management/basic-connector/basic-connector.component';
import { DeleteReportComponent } from './report-management/delete-report/delete-report.component';
import { DeleteConnectorComponent } from './connector-management/delete-connector/delete-connector.component';
import { CloneOrgComponent } from './account-management/clone-org/clone-org.component';
import { BrandManagementComponent } from './account-management/brand-management/brand-management.component';
import { SettingsAdminComponent } from './settings-admin/settings-admin.component';
import { ReportConfigComponent } from './settings-admin/report-config/report-config.component';
import { AddReportTemplateComponent } from './settings-admin/report-config/add-report-template/add-report-template.component';

import { EmbedReportComponent } from './report-management/embed-report/embed-report.component';
import { ManageUserAccessComponent } from './report-management/manage-user-access/manage-user-access.component';
import { InviteExternalUserComponent } from './report-management/invite-external-user/invite-external-user.component';
import { ManageGroupReportAccessComponent } from './report-management/manage-group-report-access/manage-group-report-access.component';
import { ReportTemplateAccessComponent } from './account-management/report-template-access/report-template-access.component';
import { ManageModeComponent } from './account-management/manage-mode/manage-mode.component';
import { DestinationSetupComponent } from './account-management/destination-setup/destination-setup.component';
import { ViewLogsComponent } from './account-management/view-logs/view-logs.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DetailsComponent } from './analytics/details/details.component';
import { ReportWorkflowComponent } from './report-workflow/report-workflow.component';
import { ViewReportComponent } from './report-workflow/view-report/view-report.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { GroupManagementComponent } from './group-management/group-management.component';
import { ViewGroupMembersComponent } from './group-management/view-group-members/view-group-members.component';
import { ManageGroupAccessComponent } from './group-management/manage-group-access/manage-group-access.component';


@NgModule({
  declarations: [
    AdminPanelComponent,
    UserManagementComponent,
    InviteUserComponent,
    AdminAuditTrailComponent,
    UserAuditTrailComponent,
    AccountManagementComponent,
    ConnectorManagementComponent,
    ReportManagementComponent,
    RequestsComponent,
    AddOrganisationComponent,
    AddNewuserComponent,
    ChangestatusComponent,
    CustomConnectorComponent,
    BasicConnectorComponent,
    DeleteReportComponent,
    DeleteConnectorComponent,
    CloneOrgComponent,
    BrandManagementComponent,
    SettingsAdminComponent,
    ReportConfigComponent,
    AddReportTemplateComponent,
    EmbedReportComponent,
    ManageUserAccessComponent,
    InviteExternalUserComponent,
    ManageGroupReportAccessComponent,
    ReportTemplateAccessComponent,
    ManageModeComponent,
    DestinationSetupComponent,
    ViewLogsComponent,
    AnalyticsComponent,
    DetailsComponent,
    ReportWorkflowComponent,
    ViewReportComponent,
    GroupManagementComponent,
    ViewGroupMembersComponent,
    ManageGroupAccessComponent
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    NgxSkeletonLoaderModule,
    SharedModule,
  ]
})
export class AdminPanelModule { }
