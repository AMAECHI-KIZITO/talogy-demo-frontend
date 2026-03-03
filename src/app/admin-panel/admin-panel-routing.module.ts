import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { MaslGuard } from '../masl.guard';
import { RequestsComponent } from './requests/requests.component';
import { ReportManagementComponent } from './report-management/report-management.component';
import { ConnectorManagementComponent } from './connector-management/connector-management.component';
import { SettingsComponent } from '../core-app/settings/settings.component';
import { SettingsAdminComponent } from './settings-admin/settings-admin.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ReportWorkflowComponent } from './report-workflow/report-workflow.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      {
        path: '',
        redirectTo: 'account-management',
        pathMatch: 'prefix'
      },
      {
        path: 'account-management',
        component: AccountManagementComponent,
        canActivate: [MaslGuard]
      },
      // {
      //   path: 'connector-management',
      //   component: ConnectorManagementComponent,
      //   canActivate: [MaslGuard]
      // },
      {
        path: 'report-management',
        component: ReportManagementComponent,
        canActivate: [MaslGuard]
      },
      {
        path: 'report-workflow',
        component: ReportWorkflowComponent,
        canActivate: [MaslGuard]
      },
      // {
      //   path: 'request',
      //   component: RequestsComponent,
      //   canActivate: [MaslGuard]
      // },
      {
        path: 'settings',
        component: SettingsAdminComponent,
        canActivate: [MaslGuard]
      },
      // {
      //   path: 'analytics',
      //   component: AnalyticsComponent,
      //   canActivate: [MaslGuard]
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
