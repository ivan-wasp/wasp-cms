import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { CarData, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.page.html',
  styleUrls: ['./campaign-detail.page.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY',
        },
      }
    },
  ]
})
export class CampaignDetailPage implements OnInit {

  campaign_id = null;
  car_id = null;

  campaign_data = null;
  checking_campaign_data = null;

  upload_type = null;

  readonly = true;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();

  having_deposit_user_id_list = null;
  all_user_id_list_exluding_having_deposit = null;
  having_past_order_user_id_list = null;

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private location: Location
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params) {
        if (params && params.campaign_id) {
          this.campaign_id = parseInt(params.campaign_id);
        }
        if (params && params.car_id) {
          this.car_id = parseInt(params.car_id);
        }
      }
    });
  }

  async ngOnInit() {
    if (this.campaign_id != null) {
      this.getCampaignData();
    }
    else {
      this.readonly = false;
      this.setNewCampaignDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
    if (this.dataService.user_data_list$.value == null) {
      await this.dataService.getAllUserData();
    }
    this.getUserIdListByType();
  }

  getUserIdListByType() {
    let send_data = {
    }
    this.apiService.postFromServer(ApiPath.get_user_id_list_by_type, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.having_deposit_user_id_list = res.data.having_deposit_user_id_list;
        this.all_user_id_list_exluding_having_deposit = this.dataService.user_data_list$.value.map(d => d.id).filter( d => !res.data.having_deposit_user_id_list.includes(d));
        this.having_past_order_user_id_list = res.data.having_past_order_user_id_list;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  setNewCampaignDataTemplate() {
    this.campaign_data = {
      "id": null,
      "data_type": "campaign_data",
      "create_date": "",
      "disabled": false,
      "user_id_list": [],
      "car_id_list": this.car_id == null ? [] : [this.car_id],
      "zh_title": "",
      "en_title": "",
      "zh_description": "",
      "en_description": "",
      "img_url": [],
      "start_date": "",
      "expiry_date": "",
      "minimum_booking_days": null,
      "maximum_booking_days": null,
      "campaign_type": null,
      "free_booking_days": null,
      "percentage_off": null
    };
    console.log(this.campaign_data);
  }

  getCampaignData() {
    let send_data = {
      id: this.campaign_id,
      data_type: "campaign_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.campaign_data = JSON.parse(JSON.stringify(res.data));
        this.checking_campaign_data = JSON.parse(JSON.stringify(res.data));
        console.log(this.campaign_data);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }



  triggerImgUpload(type) {
    if (this.upload_img == null) {
      return;
    }
    this.upload_type = type;
    this.upload_img.nativeElement.click();
  }
  uploadImg() {
    if (this.upload_img == null || this.commonService.isLoading) {
      return;
    }
    const fileList: FileList = this.upload_img.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.commonService.firstFileToBase64(fileList[0]).then(async (base64: string) => {
        // console.log(base64);

        let send_data = {
          file_name: '',
          file_type: this.commonService.getFileType(fileList[0].type),
          base64: base64
        }
        this.commonService.isLoading = true;
        const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
        this.commonService.isLoading = false;
        if (upload_base64_to_server.result == "success") {
          switch (this.upload_type) {
            case 'img_url':
              this.campaign_data.img_url = upload_base64_to_server.data;
              break;


            default:
              break;
          }
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  save() {
    let send_data = {
      id: this.campaign_data.id
    }

    if (this.campaign_data.car_id_list.length <= 0) {
      return this.commonService.openErrorSnackBar("活動必須指定車輛參加");
    }
    if (this.campaign_data.zh_title == null || this.campaign_data.zh_title == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文標題");
    }
    if (!Number.isInteger(this.campaign_data.minimum_booking_days) || this.campaign_data.minimum_booking_days <= 0) {
      return this.commonService.openErrorSnackBar("最少租借數值不正確");
    }
    if (this.campaign_data.campaign_type == null || this.campaign_data.campaign_type == '') {
      return this.commonService.openErrorSnackBar("必須選擇免租類型");
    }
    if (this.campaign_data.campaign_type=='free_booking_days' && (!Number.isInteger(this.campaign_data.free_booking_days) || this.campaign_data.free_booking_days <= 0)) {
      return this.commonService.openErrorSnackBar("免租日數不正確");
    }
    if (this.campaign_data.campaign_type=='percentage_off' && (!Number.isInteger(this.campaign_data.percentage_off) || this.campaign_data.percentage_off <= 0)) {
      return this.commonService.openErrorSnackBar("免租百分比不正確");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.campaign_data, this.checking_campaign_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    console.log(send_data);

    this.apiService.postFromServer(ApiPath.update_campaign, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.campaign_data = JSON.parse(JSON.stringify(res.data));
        this.checking_campaign_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        this.commonService.isLoading = false;
        switch (true) {
          case res.data == 'car must be selected':
            this.commonService.openErrorSnackBar("活動必須指定車輛參加");
            break;
          case res.data == 'car duplicated':
            this.commonService.openErrorSnackBar("限定車輛當同有車輛已有其他活動");
            break;
          case res.data == 'invalid minimum booking days':
            this.commonService.openErrorSnackBar("最少租借數值不正確");
            break;
          case res.data == 'invalid free booking days':
            this.commonService.openErrorSnackBar("免費日數不正確");
            break;

          default:
            this.commonService.openErrorSnackBar("未能更新資料");
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  createNewCampaign() {

    if (this.campaign_data.car_id_list.length <= 0) {
      return this.commonService.openErrorSnackBar("活動必須指定車輛參加");
    }
    if (this.campaign_data.zh_title == null || this.campaign_data.zh_title == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文標題");
    }
    if (!Number.isInteger(this.campaign_data.minimum_booking_days) || this.campaign_data.minimum_booking_days <= 0) {
      return this.commonService.openErrorSnackBar("最少租借數值不正確");
    }
    // if (!Number.isInteger(this.campaign_data.free_booking_days) || this.campaign_data.free_booking_days <= 0) {
    //   return this.commonService.openErrorSnackBar("免費日數不正確");
    // }
    if (this.campaign_data.campaign_type == null || this.campaign_data.campaign_type == '') {
      return this.commonService.openErrorSnackBar("必須選擇免租類型");
    }
    if (this.campaign_data.campaign_type=='free_booking_days' && (!Number.isInteger(this.campaign_data.free_booking_days) || this.campaign_data.free_booking_days <= 0)) {
      return this.commonService.openErrorSnackBar("免租日數不正確");
    }
    if (this.campaign_data.campaign_type=='percentage_off' && (!Number.isInteger(this.campaign_data.percentage_off) || this.campaign_data.percentage_off <= 0)) {
      return this.commonService.openErrorSnackBar("免租百分比不正確");
    }

    this.apiService.postFromServer(ApiPath.new_campaign, this.campaign_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.campaign_id = res.data.id;
        this.campaign_data = JSON.parse(JSON.stringify(res.data));
        this.checking_campaign_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/campaign-detail?campaign_id=' + res.data.id);
        }, 1000);
      } else {
        switch (true) {
          case res.data == 'car must be selected':
            this.commonService.openErrorSnackBar("活動必須指定車輛參加");
            break;
          case res.data == 'car duplicated':
            this.commonService.openErrorSnackBar("限定車輛當同有車輛已有其他活動");
            break;
          case res.data == 'invalid minimum booking days':
            this.commonService.openErrorSnackBar("最少租借數值不正確");
            break;
          case res.data == 'invalid free booking days':
            this.commonService.openErrorSnackBar("免費日數不正確");
            break;

          default:
            this.commonService.openErrorSnackBar("未能建立資料");
            break;
        }

      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  selectionChanged(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value != null && dateRangeStart.value != '' && dateRangeEnd.value != null && dateRangeEnd.value != '') {
      this.campaign_data.start_date = dateRangeStart.value.substring(0, 10) + "T00:00:00";
      this.campaign_data.expiry_date = dateRangeEnd.value.substring(0, 10) + "T23:59:59";
      console.log(this.campaign_data);
    }
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }





  resetCampaignDate(){
    this.campaign_data.start_date = '';
    this.campaign_data.expiry_date = '';
  }


  encodeArray(value){
    return JSON.stringify(value);
  }


}
