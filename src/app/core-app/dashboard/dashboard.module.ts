import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageReportComponent } from './manage-report/manage-report.component';
import { AddReportComponent } from './add-report/add-report.component';
import { PowerBIEmbedModule } from 'powerbi-client-angular';


@NgModule({
  declarations: [
    DashboardComponent,
    ManageReportComponent,
    AddReportComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    PowerBIEmbedModule
  ]
})
export class DashboardModule { 

}
