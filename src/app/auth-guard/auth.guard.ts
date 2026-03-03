import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private app: AppService, private router: Router, private location: Location) { }
    role: any = this.app.helperService.getRole()
    canAccess: any;

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        var currentRole = route.data['role'];
        this.canAccess = this.hasAccess(this.role, currentRole)
      
        
        if (!this.canAccess) {
            // localStorage.clear()
            // this.app.logoutUser()
            // this.router.navigateByUrl('/not_found')
            this.location.back()
        }
        return this.canAccess;
    }

    hasAccess(role: string, currentRole: string) {
        switch (currentRole) {
            case 'admin':
                if (role == 'member') {
                    return false
                }
                return true
            case 'user':
                if (role == 'admin') {
                    return false
                }
                return true
            case 'super admin':
                if (role == 'member') {
                    return false
                }
                return true
            default:
                return true
        }
    }
}