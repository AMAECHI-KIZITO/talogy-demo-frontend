import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AccountsComponent } from './accounts/accounts.component';
import { MaslGuard } from 'src/app/masl.guard';
import { BillingComponent } from './billing/billing.component';
import { UsersComponent } from './users/users.component';
import { AuditComponent } from './audit/audit.component';
import { GroupComponent } from './group/group.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'prefix'
      },
      {
        path: 'accounts',
        component: AccountsComponent,
        canActivate: [MaslGuard]
      },
      {
        path: 'billings',
        component: BillingComponent,
        canActivate: [MaslGuard]
      },
      {
        path: 'user',
        component: UsersComponent,
        canActivate: [MaslGuard]
      },
      {
        path: 'audit',
        component: AuditComponent,
        canActivate: [MaslGuard]
      },
      {
        path: 'group',
        component: GroupComponent,
        canActivate: [MaslGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
