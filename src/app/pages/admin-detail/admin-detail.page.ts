import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AdminData, AdminType, DATA_TYPE } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.page.html',
  styleUrls: ['./admin-detail.page.scss'],
})
export class AdminDetailPage implements OnInit {


  admin_id = null;

  deposit_amount = null;

  admin_data: AdminData = null;
  checking_admin_data = null;

  password = "";

  readonly = true;

  public get admin_type(): typeof AdminType {
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
        if (params && params.admin_id) {
          this.admin_id = parseInt(params.admin_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.admin_id != null) {
      this.getAdminData();
    }
    else{
      this.readonly = false;
      this.setNewAdminDataTemplate();
    }
  }

  setNewAdminDataTemplate() {
    this.admin_data = {
      "id": null,
      "data_type": DATA_TYPE.ADMIN_DATA,
      "create_date": "",
      "disabled": false,
      "username": "",
      "couchbase_username": "",
      "email": "",
      "phone": "",
      "password_data": "",
      "last_update_datetime": "",
      "icon_url": "",
      "authority_list": [],
      "type": AdminType.admin,
      "notification_id": '',
      "device_id": "",
      "device_info": null,
      "owner_car_id_list": []
    };
  }

  getAdminData() {
    let send_data = {
      id: this.admin_id,
      data_type: "admin_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.admin_data = JSON.parse(JSON.stringify(res.data));
        this.checking_admin_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
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
            this.admin_data.icon_url = upload_base64_to_server.data;
            
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  save() {
    let send_data = {
      id: this.admin_data.id
    }
    if (this.admin_data.username == undefined || this.admin_data.username == null || this.admin_data.username == '') {
      return this.commonService.openErrorSnackBar("必須填寫用戶名稱");
    }
    // if (this.admin_data.email == undefined || this.admin_data.email == null || this.admin_data.email == '') {
    //   return this.commonService.openErrorSnackBar("必須填寫電郵地址");
    // }
    // if (this.admin_data.phone == undefined || this.admin_data.phone == null || this.admin_data.phone == '') {
    //   return this.commonService.openErrorSnackBar("必須填寫電話");
    // }
    if (this.admin_data.username != this.checking_admin_data.username) {
      send_data['username'] = this.admin_data.username;
    }
    if (this.admin_data.email != this.checking_admin_data.email) {
      send_data['email'] = this.admin_data.email;
    }
    if (this.admin_data.phone != this.checking_admin_data.phone) {
      send_data['phone'] = this.admin_data.phone;
    }
    if (this.admin_data.icon_url != this.checking_admin_data.icon_url) {
      send_data['icon_url'] = this.admin_data.icon_url;
    }
    if (this.admin_data.type != this.checking_admin_data.type) {
      send_data['type'] = this.admin_data.type;
    }

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_admin, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        if (this.checking_admin_data.type != this.admin_data.type){
          this.auth.Logout();
        }
        this.readonly = true;
        this.admin_data = JSON.parse(JSON.stringify(res.data));
        this.checking_admin_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
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
        
          default:
            this.commonService.openErrorSnackBar("未能更新資料");
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  createNewAdmin() {
    function hasWhiteSpace(s) {
      return /\s/g.test(s);
    }
    function isAlphanumeric(s) {
      return /\s/g.test(s);
    }
    if (this.admin_data.username == undefined || this.admin_data.username == null || this.admin_data.username == '') {
      return this.commonService.openErrorSnackBar("必須填寫用戶名稱");
    }
    if (hasWhiteSpace(this.admin_data.username) && !isAlphanumeric(this.admin_data.username)){
      return this.commonService.openErrorSnackBar("用戶名稱只可輸入英文或數字");
    }
    // if (this.admin_data.email == undefined || this.admin_data.email == null || this.admin_data.email == '') {
    //   return this.commonService.openErrorSnackBar("必須填寫電郵地址");
    // }
    // if (this.admin_data.phone == undefined || this.admin_data.phone == null || this.admin_data.phone == '') {
    //   return this.commonService.openErrorSnackBar("必須填寫電話");
    // }
    this.admin_data['password'] = this.password;


    this.apiService.postFromServer(ApiPath.new_admin, this.admin_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.admin_id = res.data.id;
        this.admin_data = JSON.parse(JSON.stringify(res.data));
        this.checking_admin_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/admin-detail?admin_id=' + res.data.id);
        }, 1000);
      } else {
        switch (true) {
          case res.data == 'username exist':
            this.commonService.openErrorSnackBar("用戶名已存在");
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


}
