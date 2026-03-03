import { Injectable } from '@angular/core';
import { Constants } from '../helpers/messages';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  getEmail(): any {
    let rawid = this.getFromStore(Constants.LOGIN_USER);
    if(rawid){
      let email = rawid.username
      return email
    }
  }

  getOrg(): any {
    let rawid = this.getFromStore(Constants.LOGIN_USER);
    if(rawid){
      let org = rawid.organization
      return org
    }
  }

  getDestinationFivetran(): any {
    let rawid = this.getFromStore(Constants.LOGIN_USER);
    if(rawid){
      let dest = rawid.destination.destination.fivetranDest.destinationName
      return dest
    }
  }

  getDestinationCustom(): any {
    let rawid = this.getFromStore(Constants.LOGIN_USER);
    if(rawid){
      let dest = rawid.destination.destination.custConnDest.destinationName
      return dest
    }
  }

  getDestinationRegion(): any {
    let rawid = this.getFromStore(Constants.LOGIN_USER);
    if(rawid){
      let dest = rawid.destination.region
      return dest
    }
  }

  getDestinationTitle(): any {
    let rawid = this.getFromStore(Constants.LOGIN_USER);
    if(rawid){
      let dest = rawid.destination.destination.title
      return dest
    }
  }

  getRoles(): any {
    let rawid = this.getFromStore(Constants.LOGIN_USER);
    if(rawid){
      let role = rawid.roles
      return role
    }
  }

  public getClientname(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let name = usern.name
      return name
    }
  }

  // public getTenatId(){
  //   let tenantid = this.getFromStore(Constants.LOGIN_USER);
  //   if(tenantid){
  //     let id = tenantid.userid.tenantId ? tenantid.userid.tenantId : null
  //     return id
  //   }
  // }


  public getTrial(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let trial = usern.trialMode
      return trial
    }
  }

  public getRole(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let role = usern.roleUser
      return role
    }
  }

  public getLogo(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let logo = usern.logo
      return logo
    }
  }

  public getBrand(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let brand = usern.brandColor
      return brand
    }
  } 

  public getReportTemplate(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let template = usern.reportTemplate
      return template
    }
  }
  


  public getRegularConnectorList(){
    let usern = this.getFromStore(Constants.REGULAR_CONNECTOR);
    if(usern){
      let connector = usern.regularconnector
      return connector
    }
  }

  public getLoginType(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let type = usern.type
      return type
    }
  }

  public getClientStatus(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let status = usern.status
      return status
    }
  }
  public getUserid(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let userid = usern.userid
      return userid
    }
  }

  public getActiveid(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let id = usern.id
      return id
    }
  }

  public getUserToken(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let usertoken = usern.userToken.accessTkn
      return usertoken
    }
  }

  public getRefreshUserToken(){
    let usern = this.getFromStore(Constants.LOGIN_USER);
    if(usern){
      let refreshtoken = usern.userToken.refreshTkn
      return refreshtoken
    }
  }


  constructor() {
  }
  
  

  public getFromStore(key:string){
    // return JSON.parse(localStorage.getItem(key) || '{}')

    let store = localStorage.getItem(key);
    // return JSON.parse(store)

    if (store) {
      // let decrypt = this.aes.decrypt(store)
      return JSON.parse(store)
    }
  }

  public saveToStore(key:string, data:any){
    // let encrypt = this.aes.encrypt(JSON.stringify(data));
    localStorage.setItem(key, JSON.stringify(data));

  }

  public removeFromStore(key:string){
    localStorage.removeItem(key)
  }
  
}