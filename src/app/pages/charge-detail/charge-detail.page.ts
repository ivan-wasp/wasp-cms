import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable } from 'rxjs';
import { AdminData, AdminType, Authority, CarData, ChargeType, DATA_TYPE, UserData } from 'src/app/schema';

@Component({
  selector: 'app-charge-detail',
  templateUrl: './charge-detail.page.html',
  styleUrls: ['./charge-detail.page.scss'],
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
export class ChargeDetailPage implements OnInit {

  charge_id = null;

  charge_data = null;
  checking_charge_data = null;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();

  upload_type = null;

  readonly = true;

  stepHour = 1;
  stepMinute = 1;
  enableMeridian = false;
  showSeconds = false;

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();
  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }
  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  public get chargeTypeList(){
    return Object.keys(ChargeType);
  }
  public get chargeType(): typeof ChargeType {
    return ChargeType;
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
        if (params && params.charge_id) {
          this.charge_id = parseInt(params.charge_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.charge_id != null) {
      this.getChargeData();
    }
    else {
      this.readonly = false;
      this.setNewChargeyDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData();
    }
  }

  setNewChargeyDataTemplate() {
    this.charge_data = {
      "id": null,
      "data_type": DATA_TYPE.CHARGE_DATA,
      "create_date": "",
      "disabled": false,
      "user_id": null,
      "car_id": null,
      "order_id": null,
      "status": "",
      "type": "",
      "description": "",
      "reference_number": "",
      "date": "",
      "payment_method": "",
      "payment_order_data": null,
      "payment_completed_datetime": "",
      "payment_deadline_date": "",
      "other_doc_url_list": [],
      "notification_date": "",
      "amount": 0,
      "penalty": 0,
      "total_amount": 0,
      "remark": ""
    };
  }

  getChargeData() {
    let send_data = {
      id: this.charge_id,
      data_type: "charge_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.charge_data = JSON.parse(JSON.stringify(res.data));
        this.checking_charge_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.charge_data.id
    }
    // if (this.charge_data.discount_type == undefined || this.charge_data.discount_type == null || this.charge_data.discount_type == '') {
    //   return this.commonService.openErrorSnackBar("必須選擇優惠券類型");
    // }
    if (this.charge_data.payment_deadline_date != this.checking_charge_data.payment_deadline_date) {
      if (!this.commonService.validateYYYYmmddFormat(this.charge_data.payment_deadline_date)) {
        return this.commonService.openErrorSnackBar("繳款到期日格式不正確");
      }
      send_data['payment_deadline_date'] = this.charge_data.payment_deadline_date;
    }
    if (this.charge_data.notification_date != this.checking_charge_data.notification_date) {
      if (!this.commonService.validateYYYYmmddFormat(this.charge_data.notification_date)) {
        return this.commonService.openErrorSnackBar("通知繳款日格式不正確");
      }
      send_data['payment_deadline_date'] = this.charge_data.notification_date;
    }
    if (this.charge_data.user_id == undefined || this.charge_data.user_id == null || this.charge_data.user_id == '') {
      return this.commonService.openErrorSnackBar("必須選用戶");
    }
    send_data = this.commonService.updateDataChecker(send_data, this.charge_data, this.checking_charge_data);


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_charge, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.charge_data = JSON.parse(JSON.stringify(res.data));
        this.checking_charge_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        switch (true) {
          default:
            this.commonService.openErrorSnackBar("未能更新資料");
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  createNewCharge() {
    if (this.charge_data.user_id == undefined || this.charge_data.user_id == null || this.charge_data.user_id == '') {
      return this.commonService.openErrorSnackBar("必須選用戶");
    }
    if (this.charge_data.payment_deadline_date != null && this.charge_data.payment_deadline_date != '' && !this.commonService.validateYYYYmmddFormat(this.charge_data.payment_deadline_date)) {
      return this.commonService.openErrorSnackBar("繳款到期日格式不正確");
    }
    if (this.charge_data.type == null || this.charge_data.type == ''){
      return this.commonService.openErrorSnackBar("必須選擇類型");
    }
    if (this.charge_data.status == null || this.charge_data.status == ''){
      return this.commonService.openErrorSnackBar("必須選擇狀態");
    }
    if (this.charge_data.total_amount == null || this.charge_data.total_amount <= 0){
      return this.commonService.openErrorSnackBar("總額必須多於0");
    }

    this.apiService.postFromServer(ApiPath.new_charge, this.charge_data, true).then((res: Response) => {

      console.log(res);
      if (res.result == "success") {
        this.charge_id = res.data.id;
        this.charge_data = JSON.parse(JSON.stringify(res.data));
        this.checking_charge_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/charge-detail?charge_id=' + res.data.id);
        }, 1000);
      } else {
        switch (true) {
          default:
            this.commonService.openErrorSnackBar("未能建立資料");
            break;
        }

      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
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
            case 'payment_order_data':
              this.charge_data.payment_order_data = upload_base64_to_server.data;
              break;
            case 'other_doc_url_list':
              this.charge_data.other_doc_url_list.push(upload_base64_to_server.data);
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


  removeImg(data) {
    console.log(data);
    this.charge_data.payment_order_data = "";
  }


  selectionDateChanged(field, date: HTMLInputElement) {
    if (date.value != null && date.value != '' && date.value != null && date.value != '') {
      this.charge_data[field] = date.value.substring(0, 10);
    }
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  async dateChange(e) {
    // console.log(e.value);
    this.charge_data.date = this.commonService.GetDateTimeMatchBackendFormat(new Date(e.value));

  }

  resetDate() {
    this.charge_data.date = '';
  }

  amountChange(e){
    // console.log(e);
    setTimeout(() => {
      this.charge_data.total_amount = this.charge_data.amount+this.charge_data.penalty;
    }, 100);

  }


}
