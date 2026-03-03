import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomePageComponent } from '../core/home-page/home-page.component';
import { MaslGuard } from '../masl.guard';
import { AiSearchComponent } from './ai-search/ai-search.component';
import { CoreAppComponent } from './core-app.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PowerbiDisplayComponent } from './report/powerbi-display/powerbi-display.component';
import { ReportComponent } from './report/report.component';
import { SettingsComponent } from './settings/settings.component';
import { TestReportComponent } from './report/test-report/test-report.component';
import { LandingPageComponent } from '../core/landing-page/landing-page.component';
import { GbqChatComponent } from './ai-search/gbq-chat/gbq-chat.component';

const routes: Routes = [
  {
    path: '',
    component: CoreAppComponent,
    children: [
      {
        path: '',
        redirectTo: 'report',
        pathMatch: 'prefix',
      },
      // {
      //   path: 'home',
      //   component: LandingPageComponent,
      //   canActivate: [MaslGuard],
      // },
      // {
      //   path: 'create-connector',
      //   component: DataConnectorComponent,
      //   canActivate: [MaslGuard],
      // },
      // {
      //   path: 'my-connectors',
      //   component: MyConnectorComponent,
      //   canActivate: [MaslGuard],
      // },
      // {
      //   path: 'create-report',
      //   component: CreateReportComponent,
      //   canActivate: [MaslGuard],
      // },
      // {
      //   path: 'ai-search',
      //   component: AiSearchComponent,
      //   canActivate: [MaslGuard],
      // },
      // { 
      //   path: 'ai-search/gbq', 
      //   component: GbqChatComponent,
      //   canActivate: [MaslGuard]
      // },
      // {
      //   path: 'dashboard',
      //   component: DashboardComponent,
      //   canActivate: [MaslGuard],
      // },

      // {
      //   path: 'destination-manager',
      //   component: ConnectorDestinationComponent,
      //   canActivate: [MaslGuard]
      // },
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [MaslGuard]
      },
      {
        path: 'test-report',
        component: TestReportComponent,
        canActivate: [MaslGuard]
      },
      {
        path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        canActivate: [MaslGuard]
      },
      {
        path: 'report/report-view',
        component: PowerbiDisplayComponent,
        canActivate: [MaslGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreAppRoutingModule { }
