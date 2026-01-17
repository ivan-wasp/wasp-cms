import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username = null;
  password = null;
  dev = environment.production ? false : true;

  constructor(
    private apiService: ApiService,
    private nav: NavController,
    public commonService: CommonService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    // var data =  this.authService.isAuthenticated();
    // console.log(data);
    // if (data != undefined && data != null) {
    //   this.nav.navigateRoot('');
    // }

  }

  ionViewDidEnter(){
    if (this.authService.getParsedAdminToken() != null){
      this.nav.navigateRoot('');
    }
  }

  login(){
    if (this.username == null || this.username == ''){
      this.commonService.openSnackBar("請輸入用戶名稱");
      return;
    }
    if (this.password == null || this.password == ''){
      this.commonService.openSnackBar("請輸入密碼");
      return;
    }
    if (this.commonService.isLoading){
      return;
    }
    this.commonService.isLoading = true;
    this.authService.Login(this.username, this.password).then( res => {
      if (res != null){
        setTimeout(() => {
          this.commonService.isLoading = false;
          this.nav.navigateRoot('');
        }, 1000);
      }
      else{
        this.commonService.isLoading = false;
        // this.verify_code_field.setFocus();
      }
    });
  }
}
