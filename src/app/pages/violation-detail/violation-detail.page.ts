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
import { AdminData, AdminType, Authority, CarData, UserData } from 'src/app/schema';

@Component({
  selector: 'app-violation-detail',
  templateUrl: './violation-detail.page.html',
  styleUrls: ['./violation-detail.page.scss'],
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
export class ViolationDetailPage implements OnInit {

  violation_id = null;

  violation_data = null;
  checking_violation_data = null;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();

  other_doc_file_name = "";

  upload_type = null;

  readonly = true;

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }

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
        if (params && params.violation_id) {
          this.violation_id = parseInt(params.violation_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.violation_id != null) {
      this.getViolationData();
    }
    else {
      this.readonly = false;
      this.setNewViolationyDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData();
    }
  }

  setNewViolationyDataTemplate() {
    this.violation_data = {
      "id": null,
      "data_type": "violation_data",
      "create_date": "",
      "disabled": false,
      "user_id": null,
      "car_id": null,
      "order_id": null,
      "amount": null,
      "status": "",
      "contravention_type": "",
      "reference_number": "",
      "violation_date": "",
      "payment_deadline_date": "",
      "payment_method": "",
      "payment_completed_datetime": "",
      "payment_order_data": null,
      "pay_to_wasp": true,
      "payment_img_url_list": [],
      "other_doc_url_list": [],
      "notification_date": ""
    };
  }

  getViolationData() {
    let send_data = {
      id: this.violation_id,
      data_type: "violation_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.violation_data = JSON.parse(JSON.stringify(res.data));
        this.checking_violation_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.violation_data.id
    }
    // if (this.violation_data.discount_type == undefined || this.violation_data.discount_type == null || this.violation_data.discount_type == '') {
    //   return this.commonService.openErrorSnackBar("必須選擇優惠券類型");
    // }
    if (this.violation_data.payment_deadline_date != this.checking_violation_data.payment_deadline_date) {
      if (!this.commonService.validateYYYYmmddFormat(this.violation_data.payment_deadline_date)) {
        return this.commonService.openErrorSnackBar("繳款到期日格式不正確");
      }
      send_data['payment_deadline_date'] = this.violation_data.payment_deadline_date;
    }
    if (this.violation_data.notification_date != this.checking_violation_data.notification_date) {
      if (!this.commonService.validateYYYYmmddFormat(this.violation_data.notification_date)) {
        return this.commonService.openErrorSnackBar("通知繳款日格式不正確");
      }
      send_data['payment_deadline_date'] = this.violation_data.notification_date;
    }
    if (this.violation_data.user_id == undefined || this.violation_data.user_id == null || this.violation_data.user_id == '') {
      return this.commonService.openErrorSnackBar("必須選用戶");
    }
    send_data = this.commonService.updateDataChecker(send_data, this.violation_data, this.checking_violation_data);


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_violation, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.violation_data = JSON.parse(JSON.stringify(res.data));
        this.checking_violation_data = JSON.parse(JSON.stringify(res.data));
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

  createNewViolation() {
    if (this.violation_data.user_id == undefined || this.violation_data.user_id == null || this.violation_data.user_id == '') {
      return this.commonService.openErrorSnackBar("必須選用戶");
    }
    if (this.violation_data.payment_deadline_date != null && this.violation_data.payment_deadline_date != '' && !this.commonService.validateYYYYmmddFormat(this.violation_data.payment_deadline_date)) {
      return this.commonService.openErrorSnackBar("繳款到期日格式不正確");
    }
    if (this.violation_data.contravention_type == null || this.violation_data.contravention_type == ''){
      return this.commonService.openErrorSnackBar("必須選擇違例類型");
    }
    if (this.violation_data.status == null || this.violation_data.status == ''){
      return this.commonService.openErrorSnackBar("必須選擇違例狀態");
    }

    this.apiService.postFromServer(ApiPath.new_violation, this.violation_data, true).then((res: Response) => {

      console.log(res);
      if (res.result == "success") {
        this.violation_id = res.data.id;
        this.violation_data = JSON.parse(JSON.stringify(res.data));
        this.checking_violation_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/violation-detail?violation_id=' + res.data.id);
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
            case 'payment_img_url_list':
              this.violation_data.payment_img_url_list.push(upload_base64_to_server.data);
              break;
            case 'other_doc_url_list':
              this.violation_data.other_doc_url_list.unshift({
                name: this.other_doc_file_name,
                url: upload_base64_to_server.data,
                upload_date: this.commonService.GetDateTimeMatchBackendFormat(new Date())
              });
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


  selectionDateChanged(field, date: HTMLInputElement) {
    if (date.value != null && date.value != '' && date.value != null && date.value != '') {
      this.violation_data[field] = date.value.substring(0, 10);
    }
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }



}
