import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppService } from '../app.service';
import { addReport, adjustDB, adjustFinal, adjustPayload, checkUserData, connect, gaPayload, generateReport, getTokenModel, magentoPayload, pausePayload, powerbiToken } from '../model/clientInfo';
import { UtilService } from '../services/util.service';


const headers = new HttpHeaders({
  'Content-Type': 'application/json'
})


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  constructor(private http: HttpClient, private app: UtilService) {

  }
  private fivetran = environment.fivetranURL
  private generateReportUrl = environment.reportUrl
  private powerbiToken = environment.powerbiToken
  private powerbiUrl = environment.powerbiUrl
 



  //Fivetran






  errorHandler(error: HttpErrorResponse) {
   
    return throwError(error.message || "Server Error")
  }
}
