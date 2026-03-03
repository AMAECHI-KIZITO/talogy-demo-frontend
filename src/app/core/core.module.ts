import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomePageComponent } from './home-page/home-page.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RequestComponent } from './landing-page/request/request.component';
import { ViewReportComponent } from './landing-page/view-report/view-report.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';




@NgModule({
  declarations: [
    HomePageComponent,
    SignInComponent,
    LandingPageComponent,
    RequestComponent,
    ViewReportComponent,

  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    NgxSkeletonLoaderModule
  ]
})
export class CoreModule { }
