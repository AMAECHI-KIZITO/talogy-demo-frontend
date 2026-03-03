import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreAppComponent } from './core-app/core-app.component';
import { CoreComponent } from './core/core.component';
import { ErrorPageComponent } from './misc/error-page/error-page.component';

import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './auth/auth.interceptor';

import { EventService } from './services/event.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
// import { DemoReportComponent } from './demo-report/demo-report.component';
import { DemoBreadcurmbComponent } from './misc/demo-breadcurmb/demo-breadcurmb.component';
// import { RegularUserComponent } from './regular-user/regular-user.component';
import { PreviewComponent } from './preview/preview.component';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { GlobalAlertComponent } from './misc/global-alert/global-alert.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SafePipe } from './services/safe.pipe';
import { ExpirationLinkComponent } from './preview/expiration-link/expiration-link.component';
import { CheckOtpComponent } from './preview/check-otp/check-otp.component';
import { ClipboardModule } from '@angular/cdk/clipboard';






export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.domain == 'staging' ? environment.clientIdKey : environment.productionIdKey,
      redirectUri: environment.WEB_URL
    }
  })
}

const config: SocketIoConfig = {
	url: environment.socketUrl, // socket server url;
	options: {
		transports: ['websocket']
	}
}

@NgModule({
  declarations: [
    AppComponent,
    CoreComponent,
    ErrorPageComponent,
    // RegularUserComponent,
    PreviewComponent,
    GlobalAlertComponent,
    ExpirationLinkComponent,
    CheckOtpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    PowerBIEmbedModule,
    MsalModule,
    SocketIoModule.forRoot(config), 
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    EventService,
    MsalService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
