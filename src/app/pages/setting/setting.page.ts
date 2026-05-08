import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { SystemData } from 'src/app/schema';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  system_data: SystemData | any = null;
  checking_system_data: SystemData | any = null;

  readonly = true;
  @ViewChild('upload_cover_img', { static: false }) upload_cover_img: ElementRef;
  @ViewChild('upload_background_img', { static: false }) upload_background_img: ElementRef;

  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController
  ) { }

  async ngOnInit() {
    await this.dataService.getSystemData();
    this.system_data = JSON.parse(JSON.stringify(this.dataService.system_data$.value));
    this.checking_system_data = JSON.parse(JSON.stringify(this.dataService.system_data$.value));
    if (!this.system_data.app_home_page_car_cover_list) {
      this.system_data.app_home_page_car_cover_list = [];
    }
    if (!this.checking_system_data.app_home_page_car_cover_list) {
      this.checking_system_data.app_home_page_car_cover_list = [];
    }
    if (!this.system_data.app_home_page_background_img) {
      this.system_data.app_home_page_background_img = '';
    }
    if (!this.checking_system_data.app_home_page_background_img) {
      this.checking_system_data.app_home_page_background_img = '';
    }
  }

  // addNewBank() {
  //   this.system_data.bank_transfer_list.push(
  //     {
  //       "bank_name": "",
  //       "bank_account_holder_name": "",
  //       "bank_account_number": ""
  //     }
  //   );
  // }


  save() {
    let send_data = {
      id: this.system_data.id
    }

    if (this.system_data.hong_kong_island_custom_pick_up_charge == null || this.system_data.hong_kong_island_custom_pick_up_charge == '') {
      return this.commonService.openErrorSnackBar("上門取車地區收費不能留空");
    }
    if (this.system_data.kowloon_custom_pick_up_charge == null || this.system_data.kowloon_custom_pick_up_charge == '') {
      return this.commonService.openErrorSnackBar("上門取車地區收費不能留空");
    }
    if (this.system_data.new_territories_custom_pick_up_charge == null || this.system_data.new_territories_custom_pick_up_charge == '') {
      return this.commonService.openErrorSnackBar("上門取車地區收費不能留空");
    }
    if (this.system_data.minimum_appointment_day_in_advance == null || this.system_data.minimum_appointment_day_in_advance == '') {
      return this.commonService.openErrorSnackBar("客人預約維修最少提前N日不能留空");
    }
    if (this.system_data.maximum_booking_month_in_advance == null || this.system_data.maximum_booking_month_in_advance == '') {
      return this.commonService.openErrorSnackBar("客人預約租車最多預約N月後");
    }
    if (this.system_data.maximum_return_time_to_allow_another_pickup == null || this.system_data.maximum_return_time_to_allow_another_pickup == '') {
      return this.commonService.openErrorSnackBar("N時間之後還車，另一張訂單將不能同日預約取車不能留空");
    }
    if (this.system_data.maximum_pick_time_to_allow_another_return == null || this.system_data.maximum_pick_time_to_allow_another_return == '') {
      return this.commonService.openErrorSnackBar("N時間之前取車，另一張訂單將不能同日預約還車不能留空");
    }
    if (this.system_data.referral_coupon_amount == null || this.system_data.referral_coupon_amount == '') {
      return this.commonService.openErrorSnackBar("推薦人優惠值不能留空");
    }
    if (this.system_data.referral_coupon_type == null || this.system_data.referral_coupon_type == '') {
      return this.commonService.openErrorSnackBar("推薦人優惠類型不能留空");
    }
    if (this.system_data.penality_percentage == null || this.system_data.penality_percentage == '') {
      return this.commonService.openErrorSnackBar("逾期繳費罰款百分比不能留空");
    }
    if (this.system_data.starting_hour_to_allow_pickup == null || this.system_data.starting_hour_to_allow_pickup == '') {
      return this.commonService.openErrorSnackBar("最早可選取車時間不能留空");
    }
    if (this.system_data.ending_hour_to_allow_return == null || this.system_data.ending_hour_to_allow_return == '') {
      return this.commonService.openErrorSnackBar("最早可選取車時間不能留空");
    }
    if (this.system_data.minimun_hour_interval_between_pickup_return == null || this.system_data.minimun_hour_interval_between_pickup_return == '') {
      return this.commonService.openErrorSnackBar("兩張訂單取車及還車時間最少相隔N小時不能留空");
    }
    if (this.system_data.maximum_appointment_day_in_advance == null || this.system_data.maximum_appointment_day_in_advance == '') {
      return this.commonService.openErrorSnackBar("客人預約維修最多預約N日後不能留空");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.system_data, this.checking_system_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }


    this.apiService.postFromServer(ApiPath.update_system_data, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.readonly = true;
        this.system_data = JSON.parse(JSON.stringify(res.data));
        this.checking_system_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        this.commonService.openErrorSnackBar("未能更新資料");
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  triggerImgUpload(type: 'cover' | 'background') {
    const uploadRef = type == 'cover' ? this.upload_cover_img : this.upload_background_img;
    if (uploadRef == null || this.readonly) {
      return;
    }
    uploadRef.nativeElement.click();
  }

  uploadCoverImg() {
    if (this.upload_cover_img == null || this.commonService.isLoading || this.readonly) {
      return;
    }
    const fileList: FileList = this.upload_cover_img.nativeElement.files;
    this.uploadImg(fileList, (imgUrl: string) => {
      if (!this.system_data.app_home_page_car_cover_list) {
        this.system_data.app_home_page_car_cover_list = [];
      }
      this.system_data.app_home_page_car_cover_list.push(imgUrl);
    });
  }

  uploadBackgroundImg() {
    if (this.upload_background_img == null || this.commonService.isLoading || this.readonly) {
      return;
    }
    const fileList: FileList = this.upload_background_img.nativeElement.files;
    this.uploadImg(fileList, (imgUrl: string) => {
      this.system_data.app_home_page_background_img = imgUrl;
    });
  }

  private uploadImg(fileList: FileList, onSuccess: (imgUrl: string) => void) {
    if (fileList && fileList.length > 0) {
      Array.from(fileList).forEach(file => {
        if (file.size / 1024 / 1024 > 20) {
          return this.commonService.openErrorSnackBar("不能上載大於20mb的案檔");
        }
        this.commonService.firstFileToBase64(file).then(async (base64: string) => {
          const send_data = {
            file_name: '',
            file_type: this.commonService.getFileType(file.type),
            base64: base64
          };
          this.commonService.isLoading = true;
          const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
          this.commonService.isLoading = false;
          if (upload_base64_to_server.result == "success") {
            onSuccess(upload_base64_to_server.data);
          } else {
            this.commonService.openErrorSnackBar("無法上載檔案");
          }
        });
      });
    }
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.system_data.app_home_page_car_cover_list = ev.detail.complete(this.system_data.app_home_page_car_cover_list);
  }

  ionInput(type) {
    setTimeout(() => {
      switch (type) {
        case 'starting_hour_to_allow_pickup':
          this.system_data.maximum_pick_time_to_allow_another_return = `${((this.system_data.starting_hour_to_allow_pickup + this.system_data.minimun_hour_interval_between_pickup_return) > 24 ? 24 : (this.system_data.starting_hour_to_allow_pickup + this.system_data.minimun_hour_interval_between_pickup_return)).toString().padStart(2, '0')}:00`
          break;
        case 'ending_hour_to_allow_return':
          this.system_data.maximum_return_time_to_allow_another_pickup = `${((this.system_data.ending_hour_to_allow_return - this.system_data.minimun_hour_interval_between_pickup_return) < 0 ? 0 : (this.system_data.ending_hour_to_allow_return - this.system_data.minimun_hour_interval_between_pickup_return)).toString().padStart(2, '0')}:00`
          break;

        default:
          break;
      }
    }, 250);
  }

}
