import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { adjustFinal, adjustPayload, connect, filterPayload, gaPayload, generateReport, getTokenModel, magentoPayload, powerbiToken, sendReport, verifyOTP } from '../model/clientInfo';
import { acceptOrRejectRequest, activateUserPayload, addReport, adminReportPayload, basicConnectorPayload, brandOrgPayload, cloneOrgPayload, createGroup, customConnectorPayload, embedReport, gbqChat, gptChat, groupReportAccessPayload, inviteUserPayload, orgStatusPayload, pauseConnect, payPayload, postOrgPayload, postUserPayload, postlogoPaylod, refreshToken, reportAccessPayload, requestConnectorPayload, requestDestinationPayload, requestReportPayload, requestTemplatePayload, slackAlert, syncStatePayload, templateAccessPayload, testPayload, updateDestPayload, updateReportPayload, updateRequestPayload, updateRolePayload, upgradePayload, userLogsPayload, userStatusPayload } from '../model/productModel';
import { EncryptService } from '../services/encrypt.service';
import { UtilService } from '../services/util.service';


const headers = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded'
})
@Injectable({
  providedIn: 'root'
})
export class DataProductV2Service {
 

  constructor(private http: HttpClient, private app: UtilService, private encrypt: EncryptService) {

  }
  private baseUrlv2 = environment.domain == "staging" ? environment.baseUrlv2 : environment.productionbaseUrlv2
  private fivetranUrlv2 = environment.fivetranUrlv2
  private slackApis = environment.slack_API

  

  testService(payload: testPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    
    return this.http.post<testPayload>(this.baseUrlv2 + "/api/v1/userconnectors/test-encryption", tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }


  getURL(){
    return this.baseUrlv2 + "/api/v1/users/login/federated/google"
  }




  //Get Account details
  getAccountDetails(userid: any): Observable<any> {
    return this.http.get<any>(this.baseUrlv2 + `/api/v1/users/information/${userid}`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  adjustConnectApi(payload: adjustFinal): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}

    if(environment.domain == 'staging'){
      return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=createcustomconnector`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    } else {
      return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=createcustomconnectorprod`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }
   
  }
  // mail service
  requestReport(payload: requestReportPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/requests/report`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  requestDestination(payload: requestDestinationPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/requests/destination`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  requestConnector(payload: requestConnectorPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/requests/connector`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }


  requestTemplate(payload: requestTemplatePayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/requests/report-template`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  // Magento API
  magentoConnectorApi(payload: magentoPayload): Observable<any>{
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    if(environment.domain == 'staging'){
      return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=createcustomconnector`, tempObj, {headers})
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    } else {
      return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=createcustomconnectorprod`, tempObj, {headers})
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }
   
  }

  // GA API
  gaConnectorApi(payload: gaPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}

    if(environment.domain == 'staging'){
      return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=createcustomconnector`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    } else {
      return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=createcustomconnectorprod`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }
   
  }

  getGaDetailList(id:any): Observable<any> {

    if(environment.domain == 'staging'){
      return this.http.get<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=ga4details&userId=${id}`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    } else {
      return this.http.get<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=ga4detailsprod&userId=${id}`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }
   
  }

  getGa4DetailList(id:any, tkn:any): Observable<any> {

    if(environment.domain == 'staging'){
      return this.http.get<any>(`https://custom-connector-auth-stg.gentlewater-88122a32.uaenorth.azurecontainerapps.io/ga4_properties?token=${tkn}`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    } else {
      return this.http.get<any>(`https://custom-connector-auth-prod.kinddune-e263931e.uaenorth.azurecontainerapps.io/ga4_properties?token=${tkn}`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }
   
  }

  adjustTestApi(payload: adjustPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=tokenvalidation`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  //powerbi apis
  generateReports(payload: generateReport): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/transform-dbt`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }
  getPowerbiToken(payload: powerbiToken): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<powerbiToken>(this.baseUrlv2 + `/api/v1/reports/generate-embed-token/`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }
  getPowerbiTokenNoAuth(payload: powerbiToken): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<powerbiToken>(this.baseUrlv2 + `/api/v1/orchestrators/load-report?type=powerbiembedinfo&loadReport=true`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }
  sendReport(payload: sendReport): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<powerbiToken>(this.baseUrlv2 + `/api/v1/reports/send-report`, tempObj)
      .pipe(
        catchError(err => throwError(() => err))
        // catchError(err => this.errorHandler(err))
      )
  }
  shareReport(payload: sendReport): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<powerbiToken>(this.baseUrlv2 + `/api/v1/reports/share-report/`, tempObj)
      .pipe(
        catchError(err => throwError(() => err))
        // catchError(err => this.errorHandler(err))
      )
  }
  verifyOTP(payload: verifyOTP): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<powerbiToken>(this.baseUrlv2 + `/api/v1/reports/external-report-access/otp/verify`, tempObj)
      .pipe(
        catchError(err => throwError(() => err))
      )
  }
  cloneWorkspace(payload: any): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=clonereportworkspace`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }
  updateWorkspace(payload: any): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=updatereportworkspace`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }
  refreshWorkspace(payload: any): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<any>(this.baseUrlv2 + `/api/v1/orchestrators/?type=refreshreport`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  //Get plan list
  getPlan(): Observable<any> {
    return this.http.get<any>(this.baseUrlv2 + "/api/v1/subscriptions/plans/")
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  getActivedays(): Observable<any> {
    return this.http.get<any>(this.baseUrlv2 + "/api/v1/subscriptions/active-days/")
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  pay(payload: payPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<payPayload>(this.baseUrlv2 + "/api/v1/subscriptions/subscribe", tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  //Upgrade plan
  upgradePlan(payload: upgradePayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<upgradePayload>(this.baseUrlv2 + "/api/v1/subscriptions/upgrade", tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }



  // Activate User
  activateUser(payload: activateUserPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<activateUserPayload>(this.baseUrlv2 + "/api/v1/users/validate-user/", tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  //Refresh token
  getRefreshToken(payload: refreshToken): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    return this.http.post<refreshToken>(this.baseUrlv2 + "/api/v1/users/refresh-tokens/", payload)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  //Get Connector list

  getConnectorList(): Observable<any> {
    return this.http.get<any>(this.baseUrlv2 + "/api/v1/connectors/get-connectors/")
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  //Filter Connector api

  filterConnector(payload: filterPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<filterPayload>(this.baseUrlv2 + "/api/v1/connectors/filter-connectors", tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }


  //Filter user report

  getUserReports(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrlv2 + `/api/v1/reports/?reportuser=${id}`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }


  

  getIntraConnectorList(): Observable<any> {
    return this.http.get<any>(this.baseUrlv2 + `/api/v1/connectors/get-connectors/?intraday=yes`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }


  // Post Basic Connector

  postFivetranConnector(payload: connect): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<connect>(this.baseUrlv2 + "/api/v1/userconnectors/create-fivetran-connector", tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  getFivetranToken(payload: getTokenModel): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<getTokenModel>(this.baseUrlv2 + "/api/v1/userconnectors/create-fivetran-token", tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

  postBasicConnector(payload: basicConnectorPayload): Observable<any> {
    let load = this.encrypt.encrypt(JSON.stringify(payload))
    let tempObj = {payload: load}
    return this.http.post<basicConnectorPayload>(this.baseUrlv2 + "/api/v1/userconnectors/basic", tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
  }

    // Post Custom Connector

    postCustomConnector(payload: customConnectorPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<customConnectorPayload>(this.baseUrlv2 + "/api/v1/userconnectors/custom", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

  

    //Get custom user connector
    getCustomConnector(user:any, service?:any, status?:any,datecreated?:any,schema?:any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/userconnectors/custom?user=${user}&service=${service}&status=${status}&datecreated=${datecreated}&schema=${schema}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //Get basic connector 
    getBasicConnector(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/userconnectors/basic`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    checkConnector(fivetranid: string, connectorid: string): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/userconnectors/basic/sync?fivetranId=${fivetranid}&connectorId=${connectorid}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }


    getSyncState(payload: syncStatePayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<any>("https://campaign-gpt-staging.gentlewater-88122a32.uaenorth.azurecontainerapps.io/api/v1/bigquery/table/timesync/", payload)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

  

    //Get report
    getBasicReport(reporttype?:any, status?: any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/reports/?reporttype=${reporttype}&status=${status}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }
    //delete report
    deleteReportList(id: any): Observable<any> {
      return this.http.delete<any>(this.baseUrlv2 + "/api/v1/reports/"+id)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //update report status
    updateStatusReport(payload: updateReportPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<any>(this.baseUrlv2 + "/api/v1/reports/update-report-status/", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //Get report type
    getReportType(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/reports/types`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //Get Group
    getGroup(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/organization/group/user-membership`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }



    //add Report
    addUserReportLists(payload: addReport): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<addReport>(this.baseUrlv2 + "/api/v1/reports/create-report/", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //Embed a Report
    embedReport(payload: embedReport): Observable<any>{
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load};
      return this.http.post<embedReport>(this.baseUrlv2 + `/api/v1/superadmin/reports/embed/`, tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //Pause connector 
    pauseConnector(payload: pauseConnect): Observable<any> {
      return this.http.post<pauseConnect>(this.fivetranUrlv2 + "/modify-connector/", payload)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    redirectToken(token: any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2 + `/redirect/www.fivetran.com/${token}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //logout
    logoutUser(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/users/auth/logout/`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //Admin panel api 


    getRequest(status: any, type: any, organisation: any, fromDate: any, toDate: any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2 + `/api/v1/superadmin/requests?status=${status}&type=${type}&organisation=${organisation}&fromDate=${fromDate}&toDate=${toDate}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    updateRequest(payload: updateRequestPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.patch<updateRequestPayload>(this.baseUrlv2 + "/api/v1/superadmin/update-request", tempObj )
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    postUserLogs(payload: userLogsPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<userLogsPayload>(this.baseUrlv2 + "/api/v1/superadmin/organizations/logon-audit", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

     updateOrgStatus(status: string, payload: orgStatusPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.patch<orgStatusPayload>(this.baseUrlv2 + `/api/v1/superadmin/organizations/update-institution-status/?status=${status}`, tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    updateUserStatus(status: string, payload: userStatusPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.patch<userStatusPayload>(this.baseUrlv2 + `/api/v1/superadmin/organizations/update-user-status/?status=${status}`, tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    postOrganization(payload: postOrgPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<postOrgPayload>(this.baseUrlv2 + "/api/v1/superadmin/organizations/setup", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    cloneOrganization(payload: cloneOrgPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<cloneOrgPayload>(this.baseUrlv2 + "/api/v1/superadmin/organizations/clone", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    brandColorManage(payload: brandOrgPayload, id:any): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<brandOrgPayload>(this.baseUrlv2 + `/api/v1/superadmin/organizations/${id}/personalize`, tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    inviteUsers(payload: inviteUserPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<inviteUserPayload>(this.baseUrlv2 + "/api/v1/administrator/user-invite", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    inviteSuperUsers(payload: inviteUserPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<inviteUserPayload>(this.baseUrlv2 + "/api/v1/superadmin/user-invite/", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    listSuperadminUsers(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2 + '/api/v1/superadmin/list-users/')
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getAdminAuditTrail(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2 + '/api/v1/superadmin/admin-audit-trail/')
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getUsersAuditTrail(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2 + '/api/v1/superadmin/users-audit-trail/')
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    templateAccess(payload: templateAccessPayload, id: any): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<templateAccessPayload>(this.baseUrlv2 + `/api/v1/superadmin/organizations/${id}/assign-report-template/`, tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    reportAccess(payload: reportAccessPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<reportAccessPayload>(this.baseUrlv2 + "/api/v1/reports/manage-access/", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    groupReportAccess(payload: groupReportAccessPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<reportAccessPayload>(this.baseUrlv2 + "/api/v1/reports/manage-group-access/", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    uploadLogo(payload: FormData, id: any): Observable<any> {
    
      return this.http.post<any>(this.baseUrlv2 + `/api/v1/superadmin/organizations/${id}/profile-icon/`, payload)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    updateRole(payload: updateRolePayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.patch<updateRolePayload>(this.baseUrlv2 + "/api/v1/superadmin/organizations/update-user-role/", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getOrganisation(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/organizations`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getUserList(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/administrator/organization/statistics`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getAuditList(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/administrator/organization/audit`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getRoles(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/organizations/user/roles`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }


    getAllDestination(): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/destinations`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    updateOrgDestination(payload: updateDestPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.post<updateDestPayload>(this.baseUrlv2 + "/api/v1/superadmin/destinations/setup/", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }



    getConnectors(type:any, num:any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/connectors/${type}/${num}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getReports(num:any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/reports`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getReportsinProgress(num:any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/reports/in-progress/${num}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getReportsinProgressDetail(workspaceid: string): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/reports/in-progress/${workspaceid}/detail`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    getOrgInfo(id:any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/organizations/${id}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }


    filterReport(num:any, user: any, client:any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+"/api/v1/superadmin/reports/"+num + `?user=${user}&client=${client}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    filterConnectorList(type: any, num:any, orgId: any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/superadmin/filter-connectors/${type}/${num}/${orgId}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    slackAlert(payload: slackAlert):Observable<any>{
      return this.http.post<slackAlert>(this.slackApis, payload, {headers: headers})
      .pipe(
        catchError( err => this.errorHandler(err))
      )
    }

    updateStatusReportAdmin(payload: adminReportPayload): Observable<any> {
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}
      return this.http.patch<adminReportPayload>(this.baseUrlv2 + "/api/v1/superadmin/reports/status", tempObj)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    deleteReportListAdmin(id: any): Observable<any> {
      return this.http.delete<any>(this.baseUrlv2 + "/api/v1/superadmin/reports/"+id)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    deleteConnectorListAdmin(id: any): Observable<any> {
      return this.http.delete<any>(this.baseUrlv2 + "/api/v1/superadmin/connectors/"+id)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    screenshotDownload(url: any): Observable<any> {
      return this.http.get<any>(this.baseUrlv2+`/api/v1/reports/screenshot?url=${url}`)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
    }

    //CHATGPT ENDPOINTS
    dataeGPTChat(payload: gptChat): Observable<any>{
      let load = this.encrypt.encrypt(JSON.stringify(payload))
      let tempObj = {payload: load}

      if(environment.domain == 'staging'){
        return this.http.post<any>(`https://dataegptazureapp.gentlewater-88122a32.uaenorth.azurecontainerapps.io/dataegpt/`, payload)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
      } else {
        return this.http.post<any>(`https://dataegptapp-prod.kinddune-e263931e.uaenorth.azurecontainerapps.io/dataegpt/`, payload)
        .pipe(
          catchError(err => this.errorHandler(err))
        )
      }

      // return this.http.post<any>("https://dataegptazureapp.gentlewater-88122a32.uaenorth.azurecontainerapps.io/dataegpt/", payload)
      // return this.http.post<any>(this.baseUrlv2 + "/api/v1/orchestrators/dataeGPT", tempObj)
    }

    //GPQ ENDPOINTS
    listGBQDatasets(payload: any): Observable<any>{
      // return this.http.post<any>(`https://dataegptazureapp.gentlewater-88122a32.uaenorth.azurecontainerapps.io/external-connections/list-datasets/`, {}, {headers: {'Service-Token': payload}})
      return this.http.post<any>(`https://dataegptazureapp.gentlewater-88122a32.uaenorth.azurecontainerapps.io/external-connections/list-datasets/`, payload)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    dataeGBQChat(payload: gbqChat): Observable<any>{
      // return this.http.post<any>(`https://dataegptazureapp.gentlewater-88122a32.uaenorth.azurecontainerapps.io/external-connections/dataegpt/`, payload, {headers: {'Service-Token': token}})
      return this.http.post<any>(`https://dataegptazureapp.gentlewater-88122a32.uaenorth.azurecontainerapps.io/external-connections/dataegpt/`, payload)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    //SETTINGS GROUP ENDPOINTS
    createOrganisationGroup(obj: createGroup): Observable<any>{
      let load = this.encrypt.encrypt(JSON.stringify(obj))
      let tempObj = {payload: load}
      return this.http.post<any>(this.baseUrlv2+`/api/v1/organization/group/register/`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    retrieveAllOrganisationGroups(): Observable<any>{
      return this.http.get<any>(this.baseUrlv2+`/api/v1/organization/group/`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    retrieveMembersOfGroup(groupid: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2+`/api/v1/organization/group/${groupid}/members/`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    retrieveMembersOfGroupRequests(groupid: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2+`/api/v1/organization/group/${groupid}/membership-requests/`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    retrieveMembersOfOrganization(groupid: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2+`/api/v1/organization/group/${groupid}/members/non-members/`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    requestAccesstoGroup(groupid: string): Observable<any>{
      let load = this.encrypt.encrypt(JSON.stringify({groupID: groupid}))
      let tempObj = {payload: load}
      return this.http.post<any>(this.baseUrlv2+`/api/v1/organization/group/request-access/`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    acceptOrRejectRequest(obj: acceptOrRejectRequest): Observable<any>{
      let load = this.encrypt.encrypt(JSON.stringify(obj))
      let tempObj = {payload: load}
      return this.http.post<any>(this.baseUrlv2+`/api/v1/organization/group/manage-access/`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    addOrRemoveMember(obj: any): Observable<any>{
      let load = this.encrypt.encrypt(JSON.stringify(obj))
      let tempObj = {payload: load}
      return this.http.post<any>(this.baseUrlv2+`/api/v1/organization/group/manage-membership/`, tempObj)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    retrieveGroupReports(groupid: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2+`/api/v1/organization/group/${groupid}/reports/`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    ///Datae Super Admin Analytics Start

    getActiveUsers(period: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2 +`/api/v1/analytics/active-users`, {params: {'period': period}})
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    getUserSignups(period: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2 +`/api/v1/analytics/new-signups`, {params: {'period': period}})
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    getPeriodicReportsInsights(period: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2 +`/api/v1/analytics/periodic-report-insights`, {params: {'period': period}})
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    getOverallReportsInsights(): Observable<any>{
      return this.http.get<any>(this.baseUrlv2 +`/api/v1/analytics/report-insights`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    getOrganizationalInsights(): Observable<any>{
      return this.http.get<any>(this.baseUrlv2 +`/api/v1/analytics/organization-insights`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    getOrganizationalActiveUsers(period: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2 +`/api/v1/analytics/organization-active-users`, {params: {'period': period}})
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    getOrganizationLoginFrequency(orgId: string): Observable<any>{
      return this.http.get<any>(this.baseUrlv2 +`/api/v1/analytics/organization-login-frequency/${orgId}`)
      .pipe(
        catchError(err => this.errorHandler(err))
      )
    }

    ///Datae Super Admin Analytics End






  errorHandler(error: HttpErrorResponse) {
    return throwError(error.error || error.message || "Server Error")
  }
}