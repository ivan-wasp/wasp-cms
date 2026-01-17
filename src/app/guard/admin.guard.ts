import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminType } from '../schema';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let adminTokenData = this.authService.getParsedAdminToken();
    if (adminTokenData != undefined && adminTokenData != null && adminTokenData.type == AdminType.admin){
      return true;
    }
    else{
      this.commonService.openSnackBar("權限不足");
      this.commonService.openCMSPage('home', 'root');
    }

  }
  
}
