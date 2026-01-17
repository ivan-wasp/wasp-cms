import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminType } from '../schema';
import { AdminToken, AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class NonMaintainerGuard implements CanActivate {

  constructor(
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let adminTokenData: AdminToken = this.authService.getParsedAdminToken();
    console.log(adminTokenData.type);
    if (adminTokenData != undefined && adminTokenData != null && adminTokenData.type != AdminType.maintainer){
      return true;
    }
    else{
      // this.commonService.openSnackBar("權限不足");
      this.commonService.openCMSPage('maintenance-dashboard', 'root');
    }

  }
  
}
