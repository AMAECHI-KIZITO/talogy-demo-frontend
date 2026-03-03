import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { AccountsComponent } from './accounts/accounts.component';
import { BillingComponent } from './billing/billing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReceiptComponent } from './billing/receipt/receipt.component';
import { ContactUsComponent } from './billing/contact-us/contact-us.component';
import { UsersComponent } from './users/users.component';
import { AddNewComponent } from './users/add-new/add-new.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AuditComponent } from './audit/audit.component';
import { GroupComponent } from './group/group.component';
import { InviteuserComponent } from './group/inviteuser/inviteuser.component';
import { DeleteGroupComponent } from './group/delete-group/delete-group.component';
import { ViewGroupUserComponent } from './group/view-group-user/view-group-user.component';
import { CheckRequestsComponent } from './group/check-requests/check-requests.component';
import { AddUserComponent } from './group/add-user/add-user.component';
import { GroupReportComponent } from './group/group-report/group-report.component';


@NgModule({
  declarations: [
    AccountsComponent,
    BillingComponent,
    ReceiptComponent,
    ContactUsComponent,
    UsersComponent,
    AddNewComponent,
    ViewUserComponent,
    AuditComponent,
    GroupComponent,
    InviteuserComponent,
    DeleteGroupComponent,
    ViewGroupUserComponent,
    CheckRequestsComponent,
    AddUserComponent,
    GroupReportComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    NgxSkeletonLoaderModule,
  ]
})
export class SettingsModule { }
