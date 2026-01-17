import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemReorderEventDetail, NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Area, CarData, DATA_TYPE, ParkingData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-parking-detail',
  templateUrl: './parking-detail.page.html',
  styleUrls: ['./parking-detail.page.scss'],
})
export class ParkingDetailPage implements OnInit {

  parking_id = null;

  parking_data: ParkingData = null;
  checking_parking_data = null;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();

  upload_type: 'cover_img_url' | 'img_url_list' | 'pickup_dropoff_img_url' = null;

  readonly = true;

  public get areaList() {
    return Object.keys(Area);
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
        if (params && params.parking_id) {
          this.parking_id = parseInt(params.parking_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.parking_id != null) {
      this.getParkingData();
    }
    else {
      this.readonly = false;
      this.setNewParkingDataTemplate();
    }

    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }

  }

  setNewParkingDataTemplate() {
    this.parking_data = {
      id: null,
      data_type: DATA_TYPE.PARKING_DATA,
      create_date: "",
      disabled: false,
      rentable: true,
      zh_name: "",
      en_name: "",
      zh_category: "",
      en_category: "",
      zh_address: "",
      en_address: "",
      zh_description: "",
      en_description: "",
      latitude: "",
      longitude: "",
      pick_up_charge: null,
      price_per_month: null,
      default: false,
      car_id_list: [],
      quota: 0,
      show_in_app_filter: false,
      cover_img_url: "",
      img_url_list: [],
      is_car_rental_point: false,
      minimum_booking_days: 1,
      no_of_parking_space: 1,
      poor_internet: false,
      district: Area.kowloon,
      bnb_car_park_id: null,
      is_private: false,
      is_coming_soon: false,
      ace_parking_token: "",
      pickup_dropoff_remark: "",
      pickup_dropoff_img_url: ""
    };
  }

  getParkingData() {
    let send_data = {
      id: this.parking_id,
      data_type: "parking_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.parking_data = JSON.parse(JSON.stringify(res.data));
        this.checking_parking_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  
  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }




  save() {
    let send_data = {
      id: this.parking_data.id
    }
    if (this.parking_data.zh_name == undefined || this.parking_data.zh_name == null || this.parking_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文名稱");
    }
    if (this.parking_data.zh_address == undefined || this.parking_data.zh_address == null || this.parking_data.zh_address == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文地址");
    }
    if (this.parking_data.price_per_month === undefined || this.parking_data.price_per_month === null) {
      return this.commonService.openErrorSnackBar("必須填寫每月租金");
    }
    
    send_data = this.commonService.updateDataChecker(send_data, this.parking_data, this.checking_parking_data);
  
    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_parking, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.readonly = true;
        this.parking_data = JSON.parse(JSON.stringify(res.data));
        this.checking_parking_data = JSON.parse(JSON.stringify(res.data));
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

  createNewParking() {

    if (this.parking_data.zh_name == undefined || this.parking_data.zh_name == null || this.parking_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文名稱");
    }
    if (this.parking_data.zh_address == undefined || this.parking_data.zh_address == null || this.parking_data.zh_address == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文地址");
    }
    if (this.parking_data.price_per_month === undefined || this.parking_data.price_per_month === null) {
      return this.commonService.openErrorSnackBar("必須填寫每月租金");
    }
    if (this.parking_data.latitude === undefined || this.parking_data.latitude === null) {
      return this.commonService.openErrorSnackBar("必須填寫緯度");
    }
    if (this.parking_data.longitude === undefined || this.parking_data.longitude === null) {
      return this.commonService.openErrorSnackBar("必須填寫經度");
    }
    console.log(this.parking_data);
    this.apiService.postFromServer(ApiPath.new_parking, this.parking_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.parking_id = res.data.id;
        this.parking_data = JSON.parse(JSON.stringify(res.data));
        this.checking_parking_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/parking-detail?parking_id=' + res.data.id);
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


  triggerImgUpload(type: 'cover_img_url' | 'img_url_list' | 'pickup_dropoff_img_url') {
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
          if (this.upload_type == 'cover_img_url'){
            this.parking_data.cover_img_url = upload_base64_to_server.data;
          }
          else if (this.upload_type == 'img_url_list'){
            this.parking_data.img_url_list.push(upload_base64_to_server.data);
          }
          else if (this.upload_type == 'pickup_dropoff_img_url'){
            this.parking_data.pickup_dropoff_img_url = upload_base64_to_server.data;
          }

        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    // console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    this.parking_data.img_url_list = ev.detail.complete(this.parking_data.img_url_list);
    ev.detail.complete();
    // console.log(this.parking_data.img_url_list);
  }

}
