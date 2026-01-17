import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-charity-form',
  templateUrl: './charity-form.page.html',
  styleUrls: ['./charity-form.page.scss'],
})
export class CharityFormPage implements OnInit {

  form_id = null;
  form_data = null;

  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params) {
        if (params && params.form_id) {
          this.form_id = parseInt(params.form_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.form_id != null && this.form_id != '') {
      this.getFormData();
    }
    else {
    }
  }


  typeName(str){
    let txt = "";
    switch(str){
      case "inquiry":
        txt="企業合作";
        break;
        case "sell_car":
          txt="我要放車";
          break;
          case "repair":
            txt="申請為維修中心";
            break;
            case "seller":
              txt="寄賣";
              break;
              case "sponsor":
                txt="贊助";
                break;
    }
    return txt;
  }

  getFormData() {
    let send_data = {
      id: this.form_id
    };
    this.apiService.postFromServer(ApiPath.get_form_by_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.form_data = JSON.parse(JSON.stringify(res.data));
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

}
