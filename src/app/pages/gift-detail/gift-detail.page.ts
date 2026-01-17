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
import { CarData, UserData } from 'src/app/schema';

@Component({
  selector: 'app-gift-detail',
  templateUrl: './gift-detail.page.html',
  styleUrls: ['./gift-detail.page.scss'],
})
export class GiftDetailPage implements OnInit {

  gift_id = null;

  gift_data = null;
  checking_gift_data = null;

  upload_type = null;

  readonly = true;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();

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
        if (params && params.gift_id) {
          this.gift_id = parseInt(params.gift_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.gift_id != null) {
      this.getGiftData();
    }
    else {
      this.readonly = false;
      this.setNewGiftDataTemplate();
    }
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData();
    }
  }

  setNewGiftDataTemplate() {
    this.gift_data = {
      "id": null,
      "data_type": "gift_data",
      "create_date": "",
      "disabled": false,
      "zh_title": "",
      "en_title": "",
      "zh_description": "",
      "en_description": "",
      "img_url": "",
      "used": false,
      "code": "",
      "user_id": null,
      "user_list":[]
    };
  }

  getGiftData() {
    let send_data = {
      id: this.gift_id,
      data_type: "gift_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.gift_data = JSON.parse(JSON.stringify(res.data));
        this.checking_gift_data = JSON.parse(JSON.stringify(res.data));

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
              this.gift_data.img_url = upload_base64_to_server.data;
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
      id: this.gift_data.id
    }
    if (this.gift_data.zh_title == undefined || this.gift_data.zh_title == null || this.gift_data.zh_title == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文名稱");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.gift_data, this.checking_gift_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_gift, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.readonly = true;
        this.gift_data = JSON.parse(JSON.stringify(res.data));
        this.checking_gift_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        switch (true) {
          case res.data == 'gift code duplicated':
            this.commonService.openErrorSnackBar("禮品碼已重覆");
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

  createNewGift() {

    if (this.gift_data.zh_title == undefined || this.gift_data.zh_title == null || this.gift_data.zh_title == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文名稱");
    }

    this.apiService.postFromServer(ApiPath.new_multi_gift, this.gift_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        // this.gift_id = res.data.id;
        // this.gift_data = JSON.parse(JSON.stringify(res.data));
        // this.checking_gift_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          // this.location.replaceState('/gift-detail?gift_id=' + res.data.id);
          this.location.replaceState('/gift');
        }, 1000);
      } else {
        switch (true) {
          case res.data == 'gift code duplicated':
            this.commonService.openErrorSnackBar("禮品碼已重覆");
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




  // triggerImgUpload(type) {
  //   if (this.upload_img == null) {
  //     return;
  //   }
  //   this.upload_type = type;
  //   this.upload_img.nativeElement.click();
  // }
  // uploadImg() {
  //   if (this.upload_img == null || this.commonService.isLoading) {
  //     return;
  //   }
  //   const fileList: FileList = this.upload_img.nativeElement.files;
  //   if (fileList && fileList.length > 0) {
  //     Array.from(fileList).forEach(file => {
  //       if (file.size/1024/1024 > 10){
  //         return this.commonService.openErrorSnackBar("不能上載大於10mb的案檔");
  //       }

  //       this.commonService.firstFileToBase64(file).then(async (base64: string) => {
  //         // console.log(base64);
  
  //         let send_data = {
  //           file_name: '',
  //           file_type: this.commonService.getFileType(file.type),
  //           base64: base64
  //         }
  //         this.commonService.isLoading = true;
  //         const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
  //         this.commonService.isLoading = false;
  //         if (upload_base64_to_server.result == "success") {
  //               this.gift_data.img_url = upload_base64_to_server.data;
  //         }
  //         else {
  //           this.commonService.openErrorSnackBar("無法上載檔案");
  //         }
  //       })

  //     });
  //     return;

  //   }
  // }
}
