import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AdminData, AgeGroup, Area, Authority, CarRentingPurpose, CarType, Color, DATA_TYPE, DrivingExperience, Gender, HongKongDistinct, KowloonDistinct, LifeStage, MonthlyLeisureSpendingBudget, NewTerritoriesDistinct, Occupation, Plan } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
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
export class UserDetailPage implements OnInit {

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  user_id = null;

  deposit_amount = null;
  referral_bonus = null;

  user_data = null;
  checking_user_data = null;

  upload_type = null;

  readonly = true;

  other_doc_file_name = "";
  credit_doc_file_name = "";

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  public get authority(): typeof Authority {
    return Authority;
  }
  public get area(): typeof Area {
    return Area;
  }
  public get areaList() {
    return Object.keys(Area);
  }
  public get hongKongDistinct(): typeof HongKongDistinct {
    return HongKongDistinct;
  }
  public get hongKongDistinctList() {
    return Object.keys(HongKongDistinct);
  }
  public get kowloonDistinct(): typeof KowloonDistinct {
    return KowloonDistinct;
  }
  public get kowloonDistinctList() {
    return Object.keys(KowloonDistinct);
  }
  public get newTerritoriesDistinct(): typeof NewTerritoriesDistinct {
    return NewTerritoriesDistinct;
  }
  public get newTerritoriesDistinctList() {
    return Object.keys(NewTerritoriesDistinct);
  }
  public get carRentingPurpose(): typeof CarRentingPurpose {
    return CarRentingPurpose;
  }
  public get carRentingPurposeList() {
    return Object.keys(CarRentingPurpose);
  }
  public get monthlyLeisureSpendingBudget(): typeof MonthlyLeisureSpendingBudget {
    return MonthlyLeisureSpendingBudget;
  }
  public get monthlyLeisureSpendingBudgetList() {
    return Object.keys(MonthlyLeisureSpendingBudget);
  }
  public get ageGroup(): typeof AgeGroup {
    return AgeGroup;
  }
  public get ageGroupList(){
    return Object.keys(AgeGroup);
  }
  public get Gender(): typeof Gender {
    return Gender;
  }
  public get genderList(){
    return Object.values(Gender);
  }
  public get Occupation(): typeof Occupation {
    return Occupation;
  }
  public get occupationList(){
    return Object.values(Occupation);
  }
  public get drivingExperience(): typeof DrivingExperience {
    return DrivingExperience;
  }
  public get drivingExperienceList(){
    return Object.values(DrivingExperience);
  }
  public get lifeStage(): typeof LifeStage {
    return LifeStage;
  }
  public get lifeStageList(){
    return Object.values(LifeStage);
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
        if (params && params.user_id) {
          this.user_id = parseInt(params.user_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.user_id != null) {
      this.getUserData();
      this.getUserDeposit();
    }
    else{
      this.readonly = false;
      this.setNewUserDataTemplate();
    }


  }

  setNewUserDataTemplate() {
    this.user_data = {
      "id": null,
      "data_type": DATA_TYPE.USER_DATA,
      "create_date": "",
      "disabled": false,
      "username": "",
      "email": "",
      "phone": "",
      "referrer_code": "",
      "referral_code": "",
      "verify_code": "",
      "request_datetime": "",
      "notification_id": "",
      "zh_company_name": "",
      "en_company_name": "",
      "zh_full_name": "",
      "en_full_name": "",
      "identity_number": "",
      "date_of_birth": "",
      "address": "",
      "br_url": "",
      "identity_card_url": "",
      "driving_license_url": "",
      "address_proof_url": "",
      "income_certificate_url": "",
      "suspension_record": null,
      "penalty_record": null,
      "bankrupt_record": null,
      "dangerous_driving_record": null,
      "two_year_driving_experience": null,
      "drug_driving_record": null,
      "other_doc_url_list": [],
      "favorite_car_model_list": [],
      "credit_rating": "",
      "credit_doc_url_list": [],
      "preference": null,
      "device_id": "",
      "device_info": null,
      "profile_img_url": ""
    };
  }

  async getUserData() {
    const get_user_data_result: Response = await this.dataService.getUserDataById(this.user_id);
    if (get_user_data_result.result == 'success'){
      this.user_data = JSON.parse(JSON.stringify(get_user_data_result.data));
      this.checking_user_data = JSON.parse(JSON.stringify(get_user_data_result.data));
      console.log("user_data: ", this.user_data);
    }
  }

  getUserDeposit() {
    let send_data = {
      user_id: this.user_id
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_awaiting_application_deposit_amount_and_create_date_by_user_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.deposit_amount = res.data.amount;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  triggerImgUpload(type) {
    if (this.readonly) return;
    if (this.upload_img == null) return;
    if (type == 'identity_card_url') {
      return this.commonService.openErrorSnackBar('客人必需自行於GoSwap App上載身份證以通過身份證認證', 'OK', 10000);
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
            case 'br_url':
              this.user_data.br_url = upload_base64_to_server.data;
              break;
            case 'identity_card_url':
              this.user_data.identity_card_url = upload_base64_to_server.data;
              break;
            case 'address_proof_url':
              this.user_data.address_proof_url = upload_base64_to_server.data;
              break;
            case 'driving_license_url':
              this.user_data.driving_license_url = upload_base64_to_server.data;
              break;
            case 'income_certificate_url':
              this.user_data.income_certificate_url = upload_base64_to_server.data;
              break;
            case 'other_doc_url_list':
              this.user_data.other_doc_url_list.unshift({
                name: this.other_doc_file_name,
                url: upload_base64_to_server.data,
                upload_date: this.commonService.GetDateTimeMatchBackendFormat(new Date())
              });
              this.other_doc_file_name = "";
              break;
            case 'credit_doc_url_list':
              this.user_data.credit_doc_url_list.unshift({
                name: this.credit_doc_file_name,
                url: upload_base64_to_server.data,
                upload_date: this.commonService.GetDateTimeMatchBackendFormat(new Date())
              });
              this.credit_doc_file_name = "";
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
      id: this.user_data.id
    }
    if (this.user_data.username == undefined || this.user_data.username == null || this.user_data.username == '') {
      return this.commonService.openErrorSnackBar("必須填寫用戶名稱");
    }
    if (this.user_data.email == undefined || this.user_data.email == null || this.user_data.email == '') {
      return this.commonService.openErrorSnackBar("必須填寫電郵地址");
    }
    if (this.user_data.phone == undefined || this.user_data.phone == null || this.user_data.phone == '') {
      return this.commonService.openErrorSnackBar("必須填寫電話");
    }
    if (this.user_data.date_of_birth != this.checking_user_data.date_of_birth) {
      if (!this.commonService.validateYYYYmmddFormat(this.user_data.date_of_birth)) {
        return this.commonService.openErrorSnackBar("出生日期格式不正確");
      }
      send_data['date_of_birth'] = this.user_data.date_of_birth;
    }
    send_data = this.commonService.updateDataChecker(send_data, this.user_data, this.checking_user_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    send_data['return_user_data'] = true;

    this.apiService.postFromServer(ApiPath.update_user, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.user_data = JSON.parse(JSON.stringify(res.data));
        this.checking_user_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        this.commonService.isLoading = false;
        switch (true) {
          case res.data == 'invalid phone number':
            this.commonService.openErrorSnackBar("電話號碼不正確");
            break;
          case res.data == 'invalid email address':
            this.commonService.openErrorSnackBar("電郵地址不正確");
            break;
          case res.data == 'phone registered':
            this.commonService.openErrorSnackBar("電話號碼已註冊");
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

  createNewUser() {

    if (this.user_data.username == undefined || this.user_data.username == null || this.user_data.username == '') {
      return this.commonService.openErrorSnackBar("必須填寫用戶名稱");
    }
    if (this.user_data.email == undefined || this.user_data.email == null || this.user_data.email == '') {
      return this.commonService.openErrorSnackBar("必須填寫電郵地址");
    }
    if (this.user_data.phone == undefined || this.user_data.phone == null || this.user_data.phone == '') {
      return this.commonService.openErrorSnackBar("必須填寫電話");
    }
    if (this.user_data.date_of_birth != null && this.user_data.date_of_birth != '') {
      if (!this.commonService.validateYYYYmmddFormat(this.user_data.date_of_birth)) {
        return this.commonService.openErrorSnackBar("出生日期格式不正確");
      }
    }
    this.user_data['return_user_data'] = true;

    this.apiService.postFromServer(ApiPath.new_user, this.user_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.user_id = res.data.id;
        this.user_data = JSON.parse(JSON.stringify(res.data));
        this.checking_user_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.location.replaceState('/user-detail?user_id='+res.data.id);
        }, 1000);
      } else {
        switch (true) {
          case res.data == 'invalid phone number':
            this.commonService.openErrorSnackBar("電話號碼不正確");
            break;
          case res.data == 'invalid email address':
            this.commonService.openErrorSnackBar("電郵地址不正確");
            break;
          case res.data == 'phone registered':
            this.commonService.openErrorSnackBar("電話號碼已註冊");
            break;
          case res.data == 'referral code duplicated':
            this.commonService.openErrorSnackBar("推薦碼重覆");
            break;
          case res.data == 'invalid referrer code':
            this.commonService.openErrorSnackBar("被推薦碼不正確");
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


  selectionDateChanged(field, date: HTMLInputElement) {
    if (date.value != null && date.value != '' && date.value != null && date.value != '') {
      this.user_data[field] = date.value.substring(0, 10);
    }
  }

}
