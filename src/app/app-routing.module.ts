import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './misc/error-page/error-page.component';
import {AuthGuard} from './auth-guard/auth.guard';
import { PreviewComponent } from './preview/preview.component';
import { ExpirationLinkComponent } from './preview/expiration-link/expiration-link.component';




const routes: Routes = [
  {
    path: '', loadChildren: () => import('./core/core.module').then(m => m.CoreModule)
  },
  {
    path: 'app', loadChildren: () => import('./core-app/core-app.module').then(m => m.CoreAppModule),
    data: {role: 'member'}, 
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard', loadChildren: () => import('./core-app/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'preview', component: PreviewComponent
  },
  {
    path: 'access-denied', component: ExpirationLinkComponent
  },
  // {
  //   path: 'demo-report', loadChildren: () => import('./demo-report/demo-report.module').then(m => m.DemoReportModule),
  //   // data: {role: 'admin'}, 
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'admin-panel', loadChildren: () => import('./admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
    data: {role: 'admin'}, canActivate: [AuthGuard]
  },
  // {
  //   path: 'user-panel', loadChildren: () => import('./regular-user/regular-user.module').then(m => m.RegularUserModule),
  //   // data: {role: 'user'}, 
  //   canActivate: [AuthGuard]
  // },
  
  { path: 'not_found', component:  ErrorPageComponent},

  { path: '**', redirectTo: 'not_found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 