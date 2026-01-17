import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import { AdminToken, AuthService } from '../services/auth.service';
import { AdminType } from '../schema';

@Injectable({
  providedIn: 'root'
})
export class NonPickupDropoffGuard implements CanActivate {
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
    if (adminTokenData != undefined && adminTokenData != null && adminTokenData.type != AdminType.pickup_dropoff){
      return true;
    }
    else{
      // this.commonService.openSnackBar("權限不足");
      this.commonService.openCMSPage('', 'root');
    }

  }
}
