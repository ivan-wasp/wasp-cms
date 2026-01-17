import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.page.html',
  styleUrls: ['./notification-detail.page.scss'],
})
export class NotificationDetailPage implements OnInit {

  notification_id = null;
  user_id_list = null;

  notification_data = null;
  checking_notification_data = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();

  upload_type = null;

  readonly = true;

  send_sms_notification = false;
  send_push_notification = false;
  sms_content = null;
  sms_user_id_list = [];

  having_deposit_user_id_list = null;
  all_user_id_list_exluding_having_deposit = null;
  having_past_order_user_id_list = null;

  all_notification_template_data_list = null;

  all_user_data_list: UserData[] = null;

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  @ViewChild('portComponent') portComponent: IonicSelectableComponent;
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
        if (params && params.notification_id) {
          this.notification_id = parseInt(params.notification_id);
        }
        if (params && params.user_id_list) {
          this.user_id_list = JSON.parse(params.user_id_list);
          console.log(this.user_id_list);
        }
      }
    });
  }

  ngOnInit() {
    if (this.notification_id != null) {
      this.getNotificationData();
    }
    else {
      this.readonly = false;
      this.setNewFactoryDataTemplate();
      this.getAllNotificationTemplateData();
    }
    if (this.dataService.car_data_list$.value == null) {
      this.dataService.getAllCarData();
    }
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData().then(d => {
        this.all_user_data_list = this.dataService.user_data_list$.value;
      });
    }

  }

  notificationTemplateChange(ev) {
    console.log(ev);
    let notification_template_data = this.all_notification_template_data_list.find(d => d.id == ev.value);
    this.send_push_notification = true;
    if (notification_template_data.sms_content != ''){
      this.send_sms_notification = true;
    }
    this.sms_content = notification_template_data.sms_content;
    this.notification_data.zh_title = notification_template_data.zh_title;
    this.notification_data.en_title = notification_template_data.en_title;
    this.notification_data.zh_content = notification_template_data.zh_content;
    this.notification_data.en_content = notification_template_data.en_content;
    this.notification_data.user_id_list = notification_template_data.user_id_list;
    this.notification_data.website = notification_template_data.website;
    this.notification_data.image_url_android = notification_template_data.image_url_android;
    this.notification_data.image_url_ios = notification_template_data.image_url_ios;
  }

  setNewFactoryDataTemplate() {
    this.notification_data = {
      "id": null,
      "data_type": "notification_data",
      "create_date": "",
      "disabled": false,
      "zh_title": "",
      "en_title": "",
      "zh_content": "",
      "en_content": "",
      "user_id_list": this.user_id_list == null ? [] : this.user_id_list,
      "notification_id_list": [],
      "hidden_user_id_list": [],
      "additional_data": null,
      "website": "",
      "image_url_android": "",
      "image_url_ios": "",
      "recipients": ""
    };
  }

  getNotificationData() {
    let send_data = {
      id: this.notification_id,
      data_type: "notification_data"
    }

    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.notification_data = JSON.parse(JSON.stringify(res.data));
        this.checking_notification_data = JSON.parse(JSON.stringify(res.data));

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
      id: this.notification_data.id
    }
    if (this.notification_data.en_content == undefined || this.notification_data.en_content == null || this.notification_data.en_content == '') {
      return this.commonService.openErrorSnackBar("必須輸入英文內容");
    }
    if (this.notification_data.user_id_list == undefined || this.notification_data.user_id_list.length <= 0) {
      return this.commonService.openErrorSnackBar("必須至少選擇一個用戶");
    }
    send_data = this.commonService.updateDataChecker(send_data, this.notification_data, this.checking_notification_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_notification, send_data, true).then((res: Response) => {

      if (res.result == "success") {
        this.readonly = true;
        this.notification_data = JSON.parse(JSON.stringify(res.data));
        this.checking_notification_data = JSON.parse(JSON.stringify(res.data));
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

  async createNewNotification() {
    if (this.send_sms_notification) {
      if (this.sms_content == undefined || this.sms_content == null || this.sms_content == '') {
        return this.commonService.openErrorSnackBar("必須輸入SMS內容");
      }
      if (this.notification_data.user_id_list == undefined || this.notification_data.user_id_list.length <= 0) {
        return this.commonService.openErrorSnackBar("必須至少選擇一個用戶");
      }

      let send_data = {
        content: this.sms_content,
        user_id_list: this.notification_data.user_id_list
      }
      const send_sms_notification = await this.apiService.postFromServer(ApiPath.send_custom_sms, send_data, true);
      if (send_sms_notification.result == "success") {

        this.commonService.openSnackBar("已傳送sms");
        if (!this.send_push_notification) {
          setTimeout(() => {
            this.readonly = true; 
            this.commonService.isLoading = false;
            window.location.reload();
          }, 1000);
        }
      } else {
        this.commonService.isLoading = false;
        switch (true) {
          default:
            this.commonService.openErrorSnackBar("未能傳送sms");
            break;
        }

      }
    }
    if (this.send_push_notification) {
      if (this.notification_data.en_content == undefined || this.notification_data.en_content == null || this.notification_data.en_content == '') {
        return this.commonService.openErrorSnackBar("必須輸入英文內容");
      }
      if (this.notification_data.user_id_list == undefined || this.notification_data.user_id_list.length <= 0) {
        return this.commonService.openErrorSnackBar("必須至少選擇一個用戶");
      }
      // console.log(JSON.stringify(this.notification_data));
      this.apiService.postFromServer(ApiPath.new_onesignal_notification, this.notification_data, true).then((res: Response) => {
        console.log(res);
        if (res.result == "success") {

          this.commonService.openSnackBar("已建立資料");
          setTimeout(() => {
            this.readonly = true;
            this.location.replaceState('/notification-detail?notification_id=' + res.data.id);
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


  }

  async createNewNotificationTemplate() {
    if (this.notification_data.en_content == undefined || this.notification_data.en_content == null || this.notification_data.en_content == '') {
      return this.commonService.openErrorSnackBar("必須輸入英文內容");
    }

    let notification_template_data = {
      sms_content: this.sms_content,
      zh_title: this.notification_data.zh_title,
      en_title: this.notification_data.en_title,
      zh_content: this.notification_data.zh_content,
      en_content: this.notification_data.en_content,
      website: this.notification_data.website,
      image_url_android: this.notification_data.image_url_android,
      image_url_ios: this.notification_data.image_url_ios
    }

    this.apiService.postFromServer(ApiPath.new_notification_template, notification_template_data, true).then((res: Response) => {
      if (res.result == "success") {

        this.commonService.openSnackBar("已建立資料");
        this.getAllNotificationTemplateData();
        this.setNewFactoryDataTemplate();
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

  getAllNotificationTemplateData() {
    let send_data = {
      data_type: "notification_template_data"
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {

      if (res.result == "success") {
        this.all_notification_template_data_list = res.data;

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
        const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
        if (upload_base64_to_server.result == "success") {
          switch (this.upload_type) {
            case "image_url_android":
              this.notification_data.image_url_android = (upload_base64_to_server.data);
              break;
            case "image_url_ios":
              this.notification_data.image_url_ios = (upload_base64_to_server.data);
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


  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  clear() {
    // this.notification_data.user_id_list = [];
    this.portComponent.toggleItems(false);
    //     this.portComponent.clear();
    // this.portComponent.close();
  }

  selectAll() {
    // this.portComponent.toggleItems(this.portComponent.itemsToConfirm.length ? false : true);
    this.portComponent.toggleItems(true);

    // Confirm items and close Select page
    // without having the user to click Confirm button.
    // this.confirm();
  }

  confirm() {
    this.portComponent.confirm();
    this.portComponent.close();
  }

  smsChange(ev){
    if (ev.detail.checked){
      this.send_push_notification = false;
      this.dataService.user_data_list$.next(this.all_user_data_list);    
    }

    console.log(this.dataService.user_data_list$.value);
  }
  pushNotificationChange(ev){
    if (ev.detail.checked){
      this.send_sms_notification = false;
      this.dataService.user_data_list$.next(this.all_user_data_list.filter(d => d.notification_id != '' && d.notification_id != null));
    }
    else{
      this.dataService.user_data_list$.next(this.all_user_data_list);

    }
  }

}
