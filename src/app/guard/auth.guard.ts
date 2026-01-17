import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { NavController } from "@ionic/angular";
import { Observable } from "rxjs";
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import { AdminType } from "../schema";
import { AdminToken, AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private nav: NavController
  ){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    let token = this.authService.isAuthenticated();
    let parsed_token_data: AdminToken = this.authService.getParsedAdminToken();
    if (token == undefined || token == null ){
      this.authService.Logout();
      return false;
    }
    // else if (parsed_token_data.type == AdminType.maintainer){
    //   this.nav.navigateRoot('maintenance-dashboard');
    //   return false;
    // }
    else{
      return true;
    }
  }
}
