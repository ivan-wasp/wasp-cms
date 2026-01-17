import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { CarData, EmergencyData, EmergencyStatus, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-emergency-detail',
  templateUrl: './emergency-detail.page.html',
  styleUrls: ['./emergency-detail.page.scss'],
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
export class EmergencyDetailPage implements OnInit {

  emergency_id = null;

  emergency_data: EmergencyData | any = null;
  checking_emergency_data: EmergencyData | any = null;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();

  upload_type = null;

  readonly = true;

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
        if (params && params.emergency_id) {
          this.emergency_id = parseInt(params.emergency_id);
        }
      }
    });
  }

  async ngOnInit() {
    if (this.emergency_id != null) {
      this.getEmergencyData();
    }
    else {
      this.readonly = false;
      this.setNewEmergencyDataTemplate();
    }
    if (this.dataService.user_data_list$.value == null) {
      await this.dataService.getAllUserData();
    }
    if (this.dataService.car_data_list$.value == null) {
      await this.dataService.getAllCarData();
    }
    this.getUserIdListByType();
  }

  setNewEmergencyDataTemplate() {
    this.emergency_data = {
      "id": null,
      "data_type": "emergency_data",
      "create_date": "",
      "disabled": false,
      "user_id": null,
      "order_id": null,
      "accident_type": "",
      "accident_datetime": "",
      "accident_location": "",
      "weather": "",
      "speed": "",
      "witness": false,
      "witness_plate": "",
      "witness_identity": "",
      "witness_name": "",
      "witness_phone": "",
      "damage_level": "",
      "damage_img_url_list": [],
      "reported": false,
      "report_number": "",
      "compensation_amount": null,
      "payer": "",
      "status": EmergencyStatus.in_progress,
      "remark": "",
      "settlement_pdf_url": ""
    };
  }

  getEmergencyData() {
    let send_data = {
      id: this.emergency_id,
      data_type: "emergency_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.emergency_data = JSON.parse(JSON.stringify(res.data));
        this.checking_emergency_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getUserIdListByType() {
    let send_data = {
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_user_id_list_by_type, send_data, true).then((res: Response) => {
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

  save() {
    let send_data = {
      id: this.emergency_data.id
    }
    if (this.emergency_data.user_id == undefined || this.emergency_data.user_id == null || this.emergency_data.user_id == '') {
      return this.commonService.openErrorSnackBar("必須選用戶");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.emergency_data, this.checking_emergency_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_emergency, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.emergency_data = JSON.parse(JSON.stringify(res.data));
        this.checking_emergency_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        this.commonService.isLoading = false;
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

  createNewEmergency() {
    if (this.emergency_data.user_id == undefined || this.emergency_data.user_id == null || this.emergency_data.user_id == '') {
      return this.commonService.openErrorSnackBar("必須選用戶");
    }

    this.apiService.postFromServer(ApiPath.new_emergency, this.emergency_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.emergency_id = res.data.id;
        this.emergency_data = JSON.parse(JSON.stringify(res.data));
        this.checking_emergency_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/emergency-detail?emergency_id=' + res.data.id);
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



  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }


  triggerImgUpload() {
    if (this.upload_img == null) {
      return;
    }
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
          this.emergency_data.damage_img_url_list.push(upload_base64_to_server.data);
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }


  selectionDateChanged(field, date: HTMLInputElement) {
    if (date.value != null && date.value != '' && date.value != null && date.value != '') {
      this.emergency_data[field] = date.value.substring(0, 10);
    }
  }
  appointmentDatetimeChange(e) {
    // console.log(e.value);
    this.emergency_data.accident_datetime = this.commonService.GetDateTimeMatchBackendFormat(new Date(e.value));
    console.log(this.emergency_data.accident_datetime);
  }

  resetAppointmentDate() {
    this.emergency_data.accident_datetime = '';
  }

  generateSettlementPdf(){
    if (!this.emergency_data.witness){
      return this.commonService.openErrorSnackBar('未有對方司機資料');
    }
    if (this.emergency_data.witness_identity == ''){
      return this.commonService.openErrorSnackBar('未有對方司機身份證號碼');
    }
    if (this.emergency_data.witness_name == ''){
      return this.commonService.openErrorSnackBar('未有對方司機姓名');
    }
    if (this.emergency_data.witness_phone == ''){
      return this.commonService.openErrorSnackBar('未有對方司機電話號碼');
    }
    if (this.emergency_data.witness_phone == ''){
      return this.commonService.openErrorSnackBar('未有對方司機電話號碼');
    }
    if (this.emergency_data.payer == ''){
      return this.commonService.openErrorSnackBar('未有選擇賠償方');
    }
    if (this.emergency_data.compensation_amount == ''){
      return this.commonService.openErrorSnackBar('未有賠償金額');
    }
    let send_data = {
      emergency_id: this.emergency_data.id,
      verify_code: '',
      by_pass_verification: true
    }
    this.apiService.postFromServer(ApiPath.generate_personal_settlement_by_emergency_id, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.emergency_data.settlement_pdf_url = res.data;
        this.checking_emergency_data.settlement_pdf_url = res.data;
        this.commonService.downloadMedia(this.emergency_data.settlement_pdf_url, true);
      } else {
        switch (res.data) {
        
          default:
            this.commonService.openErrorSnackBar();
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  requestVerifyCode() {
    if (this.emergency_data.witness_phone == '') {
      return this.commonService.openErrorSnackBar('請輸入對方司機電話號碼');
    }
    if (this.emergency_data.payer == '') {
      return this.commonService.openErrorSnackBar('請選擇賠償方');
    }
    let send_data = {
      emergency_id: this.emergency_data.id
    }
    this.apiService.postFromServer(ApiPath.request_settlement_verify_code, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.commonService.openSnackBar(`${`驗證碼已傳送到${this.emergency_data.witness_phone}，待對方完成驗證後，和解書將自動產生`}`, undefined, 10000);
      }
      else {
        switch (res.data) {
          case 'phone not found':
            return this.commonService.openErrorSnackBar('電話號碼不正確');
            break;

          default:
            return this.commonService.openErrorSnackBar('系統錯誤');
            break;
        }
      }
    });
  }


}
