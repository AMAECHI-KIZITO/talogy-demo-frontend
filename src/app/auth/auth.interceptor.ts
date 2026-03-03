import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  mergeMap,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { UtilService } from '../services/util.service';
import { refreshToken } from '../model/productModel';
import { AppService } from '../app.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { alertModal } from '../services/ui.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshed: boolean = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private app: UtilService, private data: AppService, private dialog: MatDialog) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.app.getUserToken();
    if (!token) {
      // Skip the interceptor for this request
      return next.handle(request);
    }
    if (this.isExcludedUrl(request.url)) {
      return next.handle(request);
    }

    if (request.url.includes('users/refresh-tokens/')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(request);
    }

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.getRefresh(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isExcludedUrl(url: string): boolean {
    // Define the URLs that don't require the token here
    const excludedUrls = [
      'https://hooks.slack.com/services/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',
      'api/v1/reports/send-report/',
      // Add more excluded URLs if needed
    ];

    return excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }

  getRefresh(request: HttpRequest<any>, next: HttpHandler) {
    let payload = new refreshToken();
    payload.userRefreshToken = this.data.helperService.getRefreshUserToken();

    if (!this.isRefreshed) {
      // Start the refresh process
      this.isRefreshed = true;
      console.log('reached here');

      this.refreshTokenSubject.next(null); // Reset the subject while refreshing

      return this.data.productService.getRefreshToken(payload).pipe(
        mergeMap((res: any) => {
          this.isRefreshed = false;
          console.log('reached here as well');
          let temp = JSON.parse(localStorage.getItem('activeUser') || '');
          temp.userToken = res['tokens'];
          let finalTemp = JSON.stringify(temp);
          localStorage.setItem('activeUser', finalTemp);

          // Update the new access token in the subject
          this.refreshTokenSubject.next(res['tokens'].accessTkn);

          let token = res.tokens.accessTkn;
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });

          return next.handle(request);
        }),
        catchError((err) => {
          this.isRefreshed = false;
          // console.log(JSON.parse(err));

          // if (err.status === 401) {
          // Both access and refresh tokens have expired
          console.log('reached here as well error', err);
          this.data.logoutUser();
          this.errorDialog('SESSION EXPIRED, LOGIN TO CONTINUE'); // Show dialog when session expires
          // }

          return throwError(() => err);
        })
      );
    } else {
      // Wait for the refresh to complete, if already in progress
      console.log('reached here as well error not here');
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1), // Only take the latest emitted token
        switchMap((token) => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(request);
        }),
        catchError((err) => {
          // Handle errors during wait or refresh failure
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.data.logoutUser();
            this.errorDialog('SESSION EXPIRED, LOGIN TO CONTINUE'); // Show dialog here as well
          }
          return throwError(() => err);
        })
      );
    }
  }


  errorDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'SESSION EXPIRED',
      type: 'ERROR',
      duration: 10000
    }
    this.data.ui.setAlertStatus(alert)
  }
}