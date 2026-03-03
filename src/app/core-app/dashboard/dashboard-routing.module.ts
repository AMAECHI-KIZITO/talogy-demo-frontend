import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaslGuard } from 'src/app/masl.guard';
import { DashboardComponent } from './dashboard.component';
import { ManageReportComponent } from './manage-report/manage-report.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'manage-report',
        component: ManageReportComponent,
        canActivate: [MaslGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
