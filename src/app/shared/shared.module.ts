import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { materials } from './angular-material/material-modules';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoaderComponent } from '../misc/loader/loader.component';
import { ButtonLoaderComponent } from '../misc/button-loader/button-loader.component';
import { PrimaryButtonLoaderComponent } from '../misc/primary-button-loader/primary-button-loader.component';
import { WarnButtonLoaderComponent } from '../misc/warn-button-loader/warn-button-loader.component';
import { EmptyStateStyle1Component } from '../core-app/empty-state/empty-state-style1/empty-state-style1.component';
import { ErrorStateComponent } from '../core-app/empty-state/error-state/error-state.component';
import { EmptyStateComponent } from '../core-app/empty-state/empty-state/empty-state.component';
import { EmptyStateCreateComponent } from '../core-app/empty-state/empty-state-create/empty-state-create.component';
import { DeleteWarningComponent } from '../misc/delete-warning/delete-warning.component';
import { ReportEmptyStateComponent } from '../core-app/empty-state/report-empty-state/report-empty-state.component';
import { BreadcrumbComponent } from '../misc/breadcrumb/breadcrumb.component';
import { EmptyListComponent } from '../misc/empty-list/empty-list.component';
import { DemoBreadcurmbComponent } from '../misc/demo-breadcurmb/demo-breadcurmb.component';
import { LoginButtonLoaderComponent } from '../misc/login-button-loader/login-button-loader.component';
import { SafePipe } from '../services/safe.pipe';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextChange } from '../services/text.pipe';




@NgModule({
  declarations: [
    LoaderComponent,
    ButtonLoaderComponent,
    LoginButtonLoaderComponent,
    PrimaryButtonLoaderComponent,
    WarnButtonLoaderComponent,
    EmptyStateStyle1Component,
    ErrorStateComponent,
    EmptyStateComponent,
    EmptyStateCreateComponent,
    DeleteWarningComponent,
    ReportEmptyStateComponent,
    BreadcrumbComponent,
    DemoBreadcurmbComponent,
    EmptyListComponent,
    SafePipe,
    TextChange,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // FontAwesomeModule,
    ...materials
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoaderComponent,
    ButtonLoaderComponent,
    LoginButtonLoaderComponent,
    PrimaryButtonLoaderComponent,
    WarnButtonLoaderComponent,
    EmptyStateStyle1Component,
    ErrorStateComponent,
    EmptyStateComponent,
    EmptyStateCreateComponent,
    DeleteWarningComponent,
    ReportEmptyStateComponent,
    BreadcrumbComponent,
    DemoBreadcurmbComponent,
    EmptyListComponent,
    SafePipe,
    TextChange,
    ClipboardModule,
    ...materials
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule
    };
  }
}