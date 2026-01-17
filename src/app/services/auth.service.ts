import { Injectable } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { ApiPath, ApiService } from './api.service';
import { CommonService } from './common.service';
import { AdminData } from '../schema';

const TOKEN_KEY = 'ADMIN_DATA';

export interface AdminToken {
  id: string;
  username: string;
  email: string;
  phone: string;
  couchbase_username: string;
  data_type: string;
  iss: string;
  iat: number;
  last_update_datetime: string;
  type;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  adminToken: BehaviorSubject<string> = new BehaviorSubject(null);
  adminData: BehaviorSubject<AdminData> = new BehaviorSubject(null);


  constructor(
    private platform: Platform,
    private router: Router,
    private nav: NavController,
    private alertController: AlertController,
    private apiService: ApiService,
    public commonService: CommonService,
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });

  }

  ifLoggedIn() {
    let token = JSON.parse(localStorage.getItem(TOKEN_KEY));
    if (token) {
      console.log(token);
      // this.adminToken.next(this.parseJwt(token));
      this.adminToken.next(token);
      this.VerifyAdmin();
    }
    // console.log(admin_data);
  }

  Logout() {
    this.adminToken.next(null);
    this.adminData.next(null);
    window.localStorage.removeItem(TOKEN_KEY);
    if (!this.router.url.includes('login')){
      window.location.href = './login';
    }
  }

  async Login(username: string, password: string) {    
    let send_data = {
      username: username,
      password: password
    }
    
    const login = await this.apiService.postFromServer(ApiPath.admin_login, send_data);
    console.log(login);
    if (login.result == "success" && login.data != null) {
      this.adminToken.next((login.data));
      // this.adminToken.next(this.parseJwt(login.data));
      localStorage.setItem(TOKEN_KEY, JSON.stringify(login.data));
      this.VerifyAdmin();
      return true;
    }
    else {
      this.commonService.openSnackBar("用戶名稱或密碼錯誤");
      return null;
    }
  }

  async VerifyAdmin() {    
    let send_data = {
      username: this.getParsedAdminToken().username,
      last_update_datetime: this.getParsedAdminToken().last_update_datetime
    }
    const verify_admin_data = await this.apiService.postFromServer(ApiPath.verify_admin, send_data);
    console.log(verify_admin_data.data);
    if (verify_admin_data.result == "success" && verify_admin_data.data != null) {
      this.adminData.next(verify_admin_data.data);
    }
    else {
      this.commonService.openSnackBar("請重新登入");
      setTimeout(() => {
        this.Logout();
      }, 1500);
    }
  }



  // directLogout() {
  //   this.adminToken.next(null);
  //   window.localStorage.removeItem("admin_data");
  //   this.commonService.OpenPage('/home');
  // }

  // SyncUserDate(event?) {
  //   if (this.getStoreAccountData() == null) {
  //     if (event != undefined) {
  //       event.target.complete();
  //     }
  //     return;
  //   }
  //   let send_data = {
  //     data_type: this.getStoreAccountData().data_type, 
  //     application_key: this.getStoreAccountData().application_key
  //   }
  //   this.apiService.GetSingleDataByDataTypeAndApplicationKey(send_data).then(res => {
  //     console.log(res);
  //     if (event != undefined) {
  //       event.target.complete();
  //     }
  //     if (res.result == "success" && res.data != null) {
  //       if (res.data.disabled) {
  //         this.commonService.openSnackBar("帳號已被停用", null, 5000);
  //         this.Logout();
  //         return;
  //       }
  //       if (res.data.password_data != this.getStoreAccountData().password_data) {
  //         this.commonService.openSnackBar("密碼已被更改，請重新登入", null,  5000);
  //         this.Logout();
  //         return;
  //       }
  //       this.updateUserData(res.data);
  //     }
  //     else {
  //       this.Logout();
  //     }
  //   });
  // }

  isAuthenticated() {
    return this.adminToken.value;
  }

  getParsedAdminToken(){
    return this.adminToken.value != null ? this.parseJwt(this.adminToken.value) : null;
  }

  getAdminData() {
    return this.adminData.value;
  }

  updateAdminToken(token) {
    this.adminData.next(this.parseJwt(token));
    this.adminToken.next(token);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  }


  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

}
