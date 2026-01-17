import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { AdminData, AdminType, Authority, CarData, UserData } from 'src/app/schema';
@Component({
  selector: 'app-seven-coupon-detail',
  templateUrl: './seven-coupon-detail.page.html',
  styleUrls: ['./seven-coupon-detail.page.scss'],
})
export class SevenCouponDetailPage implements OnInit {

  seven_coupon_id = null;

  seven_coupon_data = null;
  checking_seven_coupon_data = null;

  upload_type = null;

  readonly = true;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();

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
        if (params && params.seven_coupon_id) {
          this.seven_coupon_id = parseInt(params.seven_coupon_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.seven_coupon_id != null) {
      this.getSevenCouponData();
    }
    else {
      this.readonly = false;
      this.setNewSevenCouponDataTemplate();
    }
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData();
    }
  }

  setNewSevenCouponDataTemplate() {
    this.seven_coupon_data = {
      "id": null,
      "data_type": "seven_coupon_data",
      "create_date": "",
      "disabled": false,
      "code": "",
      "user_id": null,
      "used": false
    };
  }

  getSevenCouponData() {
    let send_data = {
      id: this.seven_coupon_id,
      data_type: "seven_coupon_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.seven_coupon_data = JSON.parse(JSON.stringify(res.data));
        this.checking_seven_coupon_data = JSON.parse(JSON.stringify(res.data));

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
              this.seven_coupon_data.img_url = upload_base64_to_server.data;
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
      id: this.seven_coupon_data.id
    }

    send_data = this.commonService.updateDataChecker(send_data, this.seven_coupon_data, this.checking_seven_coupon_data);

    console.log(send_data);
    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_seven_coupon, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.readonly = true;
        this.seven_coupon_data = JSON.parse(JSON.stringify(res.data));
        this.checking_seven_coupon_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        switch (true) {
          case res.data == 'seven_coupon code duplicated':
            this.commonService.openErrorSnackBar("7-11優惠碼已重覆");
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

  createNewSevenCoupon() {
    this.apiService.postFromServer(ApiPath.new_seven_coupon, this.seven_coupon_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.seven_coupon_id = res.data.id;
        this.seven_coupon_data = JSON.parse(JSON.stringify(res.data));
        this.checking_seven_coupon_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/seven-coupon-detail?seven_coupon_id=' + res.data.id);
        }, 1000);
      } else {
        switch (true) {
          case res.data == 'seven coupon code duplicated':
            this.commonService.openErrorSnackBar("7-11優惠碼已重覆");
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


  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }


}
