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
import { AdminData, Authority, CarData, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-coupon-detail',
  templateUrl: './coupon-detail.page.html',
  styleUrls: ['./coupon-detail.page.scss'],
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
export class CouponDetailPage implements OnInit {

  coupon_id = null;
  car_id = null;

  coupon_data = null;
  checking_coupon_data = null;

  upload_type = null;

  readonly = true;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe(
    map(
      (d: CarData[]) => {
        return d != null ? d.filter((c: CarData) => c.disabled == false && c.sold == false) : d;
      }
    )
  );
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();

  having_deposit_user_id_list = null;
  all_user_id_list_exluding_having_deposit = null;
  having_past_order_user_id_list = null;

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();


  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  public get authority(): typeof Authority {
    return Authority;
  }
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
        if (params && params.coupon_id) {
          this.coupon_id = parseInt(params.coupon_id);
        }
        if (params && params.car_id) {
          this.car_id = parseInt(params.car_id);
        }
      }
    });
  }

  async ngOnInit() {
    if (this.coupon_id != null) {
      this.getCouponData();
    }
    else {
      this.readonly = false;
      this.setNewCouponDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
    if (this.dataService.user_data_list$.value == null) {
      await this.dataService.getAllUserData();
    }
    this.getUserIdListByType();
  }

  setNewCouponDataTemplate() {
    this.coupon_data = {
      "id": null,
      "data_type": "coupon_data",
      "create_date": "",
      "disabled": false,
      "user_id_list": [],
      "car_id_list": this.car_id == null ? [] : [this.car_id],
      "payment_id": null,
      "only_first_order": false,
      "zh_title": "",
      "en_title": "",
      "zh_description": "",
      "en_description": "",
      "img_url": "",
      "code": "",
      "reusable": false,
      "used": false,
      "start_date": "",
      "expiry_date": "",
      "discount_type": "percentage",
      "discount_amount": 1,
      "remark": "",
      "minimum_booking_days": null,
      "maximum_booking_days": null,
      "is_generated_by_system": false
    };
  }

  getUserIdListByType() {
    let send_data = {
    }
    // this.commonService.isLoading = true;
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_user_id_list_by_type, send_data, true).then((res: Response) => {
      // this.commonService.isLoading = false;
      console.log(res.data);
      if (res.result == "success") {
        this.having_deposit_user_id_list = res.data.having_deposit_user_id_list;
        this.all_user_id_list_exluding_having_deposit = this.dataService.user_data_list$.value.map(d => d.id).filter(d => !res.data.having_deposit_user_id_list.includes(d));
        this.having_past_order_user_id_list = res.data.having_past_order_user_id_list;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getCouponData() {
    let send_data = {
      id: this.coupon_id,
      data_type: "coupon_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.coupon_data = JSON.parse(JSON.stringify(res.data));
        this.checking_coupon_data = JSON.parse(JSON.stringify(res.data));

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
              this.coupon_data.img_url = upload_base64_to_server.data;
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
      id: this.coupon_data.id
    }
    if (this.coupon_data.discount_type == undefined || this.coupon_data.discount_type == null || this.coupon_data.discount_type == '') {
      return this.commonService.openErrorSnackBar("必須選擇優惠券類型");
    }
    if (this.coupon_data.discount_amount == undefined || this.coupon_data.discount_amount == null || this.coupon_data.discount_amount == '') {
      return this.commonService.openErrorSnackBar("必須選擇優惠券數值");
    }
    send_data = this.commonService.updateDataChecker(send_data, this.coupon_data, this.checking_coupon_data);


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_coupon, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.coupon_data = JSON.parse(JSON.stringify(res.data));
        this.checking_coupon_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        this.commonService.isLoading = false;
        switch (true) {
          case res.data == 'invalid discount type':
            this.commonService.openErrorSnackBar("優惠類型不正確");
            break;
          case res.data == 'price discount amount must larger than 0':
            this.commonService.openErrorSnackBar("優惠數值必須大於0");
            break;
          case res.data == 'percentage discount amount must larger than 0 and smaller than 100':
            this.commonService.openErrorSnackBar("折扣優惠數值必須大於0及少於100");
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

  createNewCoupon() {

    if (this.coupon_data.discount_type == undefined || this.coupon_data.discount_type == null || this.coupon_data.discount_type == '') {
      return this.commonService.openErrorSnackBar("必須選擇優惠券類型");
    }
    if (this.coupon_data.discount_amount == undefined || this.coupon_data.discount_amount == null || this.coupon_data.discount_amount == '') {
      return this.commonService.openErrorSnackBar("必須選擇優惠券數值");
    }

    this.apiService.postFromServer(ApiPath.new_coupon, this.coupon_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.coupon_id = res.data.id;
        this.coupon_data = JSON.parse(JSON.stringify(res.data));
        this.checking_coupon_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/coupon-detail?coupon_id=' + res.data.id);
        }, 1000);
      } else {
        switch (true) {
          case res.data == 'invalid discount amount':
            this.commonService.openErrorSnackBar("優惠數值不正確");
            break;
          case res.data == 'invalid discount type':
            this.commonService.openErrorSnackBar("優惠類型不正確");
            break;
          case res.data == 'price discount amount must larger than 0':
            this.commonService.openErrorSnackBar("優惠數值必須大於0");
            break;
          case res.data == 'percentage discount amount must larger than 0 and smaller than 100':
            this.commonService.openErrorSnackBar("折扣優惠數值必須大於0及少於100");
            break;
          case res.data == 'start date must before expiry date':
            this.commonService.openErrorSnackBar("開始日期必須早於結束日期");
            break;
          case res.data == 'coupon code duplicated':
            this.commonService.openErrorSnackBar("優惠碼重覆");
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
      this.coupon_data.start_date = dateRangeStart.value.substring(0, 10) + "T00:00:00";
      this.coupon_data.expiry_date = dateRangeEnd.value.substring(0, 10) + "T23:59:59";
      console.log(this.coupon_data);
    }
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }





  resetCouponDate() {
    this.coupon_data.start_date = '';
    this.coupon_data.expiry_date = '';
  }

  encodeArray(value) {
    return JSON.stringify(value);
  }

}
