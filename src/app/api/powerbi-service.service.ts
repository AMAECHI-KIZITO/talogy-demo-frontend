import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ConfigResponse } from '../model/clientInfo';

@Injectable({
  providedIn: 'root'
})
export class PowerbiServiceService {
  private url = 'https://aka.ms/CaptureViewsReportEmbedConfig'
  constructor(private httpClient: HttpClient) {}

  /**
   * @returns embed configuration
   */
  getEmbedConfig(): Observable<ConfigResponse> {
    return this.httpClient.get<ConfigResponse>(this.url)
    .pipe(
      catchError( err => this.errorHandler(err))
    )
  }

  errorHandler(error:HttpErrorResponse){
    return throwError(error.message || "Server Error") 
  }
}
