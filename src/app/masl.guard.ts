
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root' 
}) 
export class MaslGuard implements CanActivate {
  LoginStatus: boolean = false;

  constructor(private msalService: MsalService, private router: Router, private app: AppService){
    this.ListentoLoginStatus();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree { 
      if (this.LoginStatus) {
        return true;
      }
      else{
        localStorage.setItem("redirect", state.url)
        this.router.navigateByUrl('/');
        return false;
      }
  }

  ListentoLoginStatus() {
    this.app.loginObserverable().subscribe(res => {
      this.LoginStatus = res;
    });
  }
  
}
