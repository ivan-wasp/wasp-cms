import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { ItemReorderEventDetail } from '@ionic/core';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AdminType, ParkingData, SystemData, CarDamage, DATA_TYPE, AdminData, Authority, CarData, Engine, OfferPlan, CarDamageCategory, CarDamageFrontSubcategory, CarDamageLeftSideSubcategory, CarDamageRightSideSubcategory, CarDamageRearSubcategory, InsuranceType } from 'src/app/schema';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Editor, Toolbar } from 'ngx-editor';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
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
export class CarDetailPage implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];

  car_id = null;
  car_data: CarData = null;
  checking_car_data = null;

  upload_type = null;
  upload_index = null;

  system_data$: Observable<SystemData> = this.dataService.system_data$.pipe();

  readonly = true;

  other_doc_file_name = "";

  isLiveStreamingModalOpen: boolean = false;
  isHistoricalStreamingModalOpen: boolean = false;
  streaming_url: any = '';

  all_parking_data_list$: Observable<ParkingData[]> = this.dataService.parking_data_list$.pipe();
  parking_data_list_of_car_rental_point$: Observable<ParkingData[]> = this.dataService.parking_data_list$.pipe(
    map((p: ParkingData[]) => {
      return p ? p.filter(d => d.is_car_rental_point) : [];
    })
  );
  parking_data_list_of_car_rental_point_name$: Observable<string[]> = this.dataService.parking_data_list$.pipe(
    map((p: ParkingData[]) => {
      return p ? p.filter(d => d.is_car_rental_point).map(d => d.zh_name) : [];
    })
  );

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  // selected_car_damage_index: number = null;
  // selected_category: CarDamageCategory = CarDamageCategory.front;
  // selected_subcategory: CarDamageFrontSubcategory | CarDamageLeftSideSubcategory | CarDamageRightSideSubcategory | CarDamageRearSubcategory = null;
  subcategory_list: any = this.carDamageFrontSubcategory;

  jimi_device_location: any = null;

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  public get insuranceType(): typeof InsuranceType {
    return InsuranceType;
  }
  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }
  public get carDamageCategory() {
    return Object.keys(CarDamageCategory);
  }
  public get carDamageFrontSubcategory() {
    return Object.keys(CarDamageFrontSubcategory);
  }
  public get carDamageLeftSideSubcategory() {
    return Object.keys(CarDamageLeftSideSubcategory);
  }
  public get carDamageRightSideSubcategory() {
    return Object.keys(CarDamageRightSideSubcategory);
  }
  public get carDamageRearSubcategory() {
    return Object.keys(CarDamageRearSubcategory);
  }
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private location: Location,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params) {
        if (params && params.car_id) {
          this.car_id = parseInt(params.car_id);
        }
      }
    });
  }

  ngOnInit() {
    this.editor = new Editor();
    if (this.car_id != null) {
      this.getCarData();
    }
    else {
      this.readonly = false;
      this.setNewCarDataTemplate();
    }
    this.dataService.getAllParkingData();
    this.dataService.getSystemData();
  }


  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  setFavoriteCar(id) {
    let send_data = {
      id: this.dataService.system_data$.value.id,
      favorite_car_id: id
    }

    this.apiService.postFromServer(ApiPath.update_system_data, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.dataService.system_data$.next(res.data);
        this.commonService.openSnackBar("已更新最受歡迎車款");
      } else {
        this.commonService.openErrorSnackBar("未能更新資料");
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  setNewCarDataTemplate() {
    this.car_data = {
      "id": null,
      "data_type": DATA_TYPE.CAR_DATA,
      "create_date": "",
      "disabled": false,
      "sold": false,
      "for_sale": false,
      "model": "",
      "brand": "",
      "engine": Engine.hybrid,
      "year": "",
      "plate": "",
      "color_code": "",
      "color_zh_name": "",
      "color_en_name": "",
      "endurance": "",
      "seat": "",
      "fuel_consumption": "",
      "equipment_list": [],
      "engine_number": "",
      "chassis_number": "",
      "register_number": "",
      "tire_size": "",
      "tire_brand": "",
      "tire_model": "",
      "category": "",
      "odometer_value": "",
      "cover_img_url_list": [],
      "other_img_url_list": [],
      "car_licence_url": "",
      "car_licence_expiry_date": "",
      "insurance_url": "",
      "insurance_expiry_date": "",
      "car_check_date": "",
      "car_check_url": "",
      "other_doc_url_list": [],
      "index": null,
      "deposit": 1,
      "rent_to_buy_price": null,
      "original_price_per_day": null,
      "price_per_day": 1,
      "offer_plan_list": [],
      "applicable_pickup_parking_id_list": [],
      "applicable_return_parking_id_list": [],
      "last_return_parking_id": null,
      "current_location": "",
      "remark": "",
      "cc": "",
      "head": "",
      "hash_tag": [],
      "purchase_date": "",
      "purchase_price": null,
      "received_date": "",
      "accumulated_rental_income": 0,
      "accumulated_maintenance_cost": 0,
      "accumulated_repair_cost": 0,
      "registered": false,
      "launched_date": "",
      "status_img_url_list": [],
      "car_damage_list": [],
      "prerent": false,
      "tutorial_html_content": "",
      "vin": "",
      "keyless_type": "",
      "maximum_pick_time_to_allow_another_return": "",
      "maximum_return_time_to_allow_another_pickup": "",
      "starting_hour_to_allow_pickup": null,
      "ending_hour_to_allow_return": null,
      "minimun_hour_interval_between_pickup_return": null,
      "minimum_booking_days": null,
      "maximum_booking_days": null,
      "price_per_odometer": null,
      "included_odometer_per_month": null,
      "insurance_price_tier_one_percentage": null,
      "insurance_price_tier_two_percentage": null,
      "ev_mac_address": "",
      "dashcam_imei": "",
      "insurance_type": InsuranceType.third_party,
      "own_damage": null,
      "theft_loss_excess": null,
      "parking_damage_excess": null,
      "third_party_property_excess": null,
      "premium": null,
      "obd_number": "",
      "obd_device_id": "",
      "keyless_tutorial_video_url": "",
      "keyless_tutorial_website_url": ""
    };
  }


  getCarData() {
    let send_data = {
      id: this.car_id,
      data_type: "car_data"
    }
    // console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.car_data = JSON.parse(JSON.stringify(res.data));
        this.checking_car_data = JSON.parse(JSON.stringify(res.data));
        if (this.auth.adminData.value != null && this.auth.adminData.value.type == 'buyer' && !this.car_data.for_sale) {
          return this.nav.navigateRoot('');
        }
        if (this.checking_car_data.hide_total == undefined) {
          this.checking_car_data.hide_total = false;
        }
        for (let i = 0; i < this.checking_car_data.offer_plan_list.length; i++) {
          if (this.checking_car_data.offer_plan_list[i].hide_total == undefined) {
            this.checking_car_data.offer_plan_list[i].hide_total = false;
          }
        }
        console.log(this.car_data.dashcam_imei);
        if (this.car_data.dashcam_imei != ''){
          this.getJimiDeviceLocation();
          console.log(123);
          this.openJimiSreaming(1);
        }
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  triggerImgUpload(type, index?) {
    if (this.upload_img == null) {
      return;
    }
    this.upload_type = type;
    this.upload_index = index;
    this.upload_img.nativeElement.click();
  }
  uploadImg() {
    if (this.upload_img == null || this.commonService.isLoading) {
      return;
    }
    const fileList: FileList = this.upload_img.nativeElement.files;
    if (fileList && fileList.length > 0) {
      Array.from(fileList).forEach(file => {
        if (file.size / 1024 / 1024 > 20) {
          return this.commonService.openErrorSnackBar("不能上載大於20mb的案檔");
        }

        this.commonService.firstFileToBase64(file).then(async (base64: string) => {
          // console.log(base64);

          let send_data = {
            file_name: '',
            file_type: this.commonService.getFileType(file.type),
            base64: base64
          }
          this.commonService.isLoading = true;
          const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
          this.commonService.isLoading = false;
          console.log(upload_base64_to_server.data);
          if (upload_base64_to_server.result == "success") {
            switch (this.upload_type) {
              case 'car_licence_url':
                this.car_data.car_licence_url = upload_base64_to_server.data;
                break;
              case 'insurance_url':
                this.car_data.insurance_url = upload_base64_to_server.data;
                break;
              case 'car_check_url':
                this.car_data.car_check_url = upload_base64_to_server.data;
                break;
              case 'other_img_url_list':
                this.car_data.other_img_url_list.push(upload_base64_to_server.data);
                break;
              case 'status_img_url_list':
                this.car_data.status_img_url_list.push(upload_base64_to_server.data);
                break;
              case 'cover_img_url_list':
                this.car_data.cover_img_url_list = [upload_base64_to_server.data];
                break;
              case 'car_damage_list':
                this.car_data.car_damage_list[this.upload_index].img_url_list.push(upload_base64_to_server.data);
                break;

              case 'other_doc_url_list':
                this.car_data.other_doc_url_list.unshift({
                  name: this.other_doc_file_name,
                  url: upload_base64_to_server.data,
                  upload_date: this.commonService.GetDateTimeMatchBackendFormat(new Date())
                });
                this.other_doc_file_name = "";
                break;

              default:
                break;
            }
            console.log(this.car_data);
          }
          else {
            this.commonService.openErrorSnackBar("無法上載檔案");
          }
        })

      });
      return;

    }
  }

  save() {
    let send_data = {
      id: this.car_data.id
    }

    if (this.car_data.engine == null) {
      return this.commonService.openErrorSnackBar("必須選擇引擎");
    }
    if (this.car_data.year == null || this.car_data.year == '') {
      return this.commonService.openErrorSnackBar("必須填寫年份");
    }
    if (this.car_data.color_code == null || this.car_data.color_code == '') {
      return this.commonService.openErrorSnackBar("必須填寫顏色碼");
    }
    if (this.car_data.cover_img_url_list.length <= 0) {
      return this.commonService.openErrorSnackBar("必須上載封面圖");
    }
    if (this.car_data.car_licence_expiry_date != this.checking_car_data.car_licence_expiry_date) {
      if (!this.commonService.validateYYYYmmddFormat(this.car_data.car_licence_expiry_date)) {
        return this.commonService.openErrorSnackBar("行車證到期日格式不正確");
      }
      send_data['car_licence_expiry_date'] = this.car_data.car_licence_expiry_date;
    }
    if (this.car_data.insurance_expiry_date != this.checking_car_data.insurance_expiry_date) {
      if (!this.commonService.validateYYYYmmddFormat(this.car_data.insurance_expiry_date)) {
        return this.commonService.openErrorSnackBar("保險到期日格式不正確");
      }
      send_data['insurance_expiry_date'] = this.car_data.insurance_expiry_date;
    }
    if (this.car_data.car_check_date != this.checking_car_data.car_check_date) {
      if (!this.commonService.validateYYYYmmddFormat(this.car_data.car_check_date)) {
        return this.commonService.openErrorSnackBar("驗車到期日格式不正確");
      }
      send_data['car_check_date'] = this.car_data.car_check_date;
    }
    if (this.car_data.deposit == null) {
      return this.commonService.openErrorSnackBar("必須填寫按金");
    }
    if ((this.car_data.price_per_day == null)) {
      return this.commonService.openErrorSnackBar("必須填寫日租價錢");
    }
    if (JSON.stringify(this.car_data.offer_plan_list) != JSON.stringify(this.checking_car_data.offer_plan_list)) {
      if (this.car_data.offer_plan_list.filter(d => d.minimum_rental_days == null).length > 0) {
        return this.commonService.openErrorSnackBar("必須填寫所有計劃日數");
      }
      if (this.car_data.offer_plan_list.filter(d => d.price_per_day == null).length > 0) {
        return this.commonService.openErrorSnackBar("必須填寫所有計劃價錢");
      }
      // if (this.car_data.offer_plan_list.filter(d => d.info == null || d.info == '').length > 0) {
      //   return this.commonService.openErrorSnackBar("必須填寫所有額外資料");
      // }
      // if (this.car_data.offer_plan_list.filter(d => d.original_price == null || d.original_price == '').length > 0) {
      //   return this.commonService.openErrorSnackBar("必須填寫所有計劃原價");
      // }
      if (this.hasDuplicates(this.car_data.offer_plan_list.map(d => d.minimum_rental_days))) {
        return this.commonService.openErrorSnackBar("所有計劃日數不能重覆");
      }
      send_data['offer_plan_list'] = this.car_data.offer_plan_list.sort((a, b) => (a.minimum_rental_days > b.minimum_rental_days) ? 1 : ((b.minimum_rental_days > a.minimum_rental_days) ? -1 : 0));
    }
    if (this.car_data.minimum_booking_days != null && this.car_data.minimum_booking_days <= 0) {
      return this.commonService.openErrorSnackBar("最少租用日必須為1天");
    }
    if (this.car_data.minimum_booking_days > this.car_data.maximum_booking_days) {
      return this.commonService.openErrorSnackBar("最少租用日不得大於最多租用日");
    }
    if (this.car_data.car_damage_list.length > 0) {
      if (this.car_data.car_damage_list.filter((d: CarDamage) => d.category == null || d.subcategory == null).length > 0) {
        return this.commonService.openErrorSnackBar("原有破損必須選擇分類及子分類");
      }
      if (this.car_data.car_damage_list.filter((d: CarDamage) => d.img_url_list.length <= 0).length > 0) {
        return this.commonService.openErrorSnackBar("原有破損必須上載相片");
      }
    }

    send_data = this.commonService.updateDataChecker(send_data, this.car_data, this.checking_car_data);

    console.log(send_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_car, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.car_data = JSON.parse(JSON.stringify(res.data));
        this.checking_car_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        this.commonService.openErrorSnackBar("未能更新資料");
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  createNewCar() {

    if (this.car_data.engine == null) {
      return this.commonService.openErrorSnackBar("必須選擇引擎");
    }
    if (this.car_data.year == null || this.car_data.year == '') {
      return this.commonService.openErrorSnackBar("必須填寫年份");
    }
    if (this.car_data.color_code == null || this.car_data.color_code == '') {
      return this.commonService.openErrorSnackBar("必須填寫顏色碼");
    }
    if (this.car_data.cover_img_url_list.length <= 0) {
      return this.commonService.openErrorSnackBar("必須上載封面圖");
    }
    if (!this.commonService.validateYYYYmmddFormat(this.car_data.car_licence_expiry_date)) {
      return this.commonService.openErrorSnackBar("行車證到期日格式不正確");
    }
    if (!this.commonService.validateYYYYmmddFormat(this.car_data.insurance_expiry_date)) {
      return this.commonService.openErrorSnackBar("保險到期日格式不正確");
    }
    // if (!this.commonService.validateYYYYmmddFormat(this.car_data.car_check_date)) {
    //   return this.commonService.openErrorSnackBar("驗車到期日格式不正確");
    // }
    if (this.car_data.deposit == null) {
      return this.commonService.openErrorSnackBar("必須填寫按金");
    }
    if ((this.car_data.price_per_day == null)) {
      return this.commonService.openErrorSnackBar("必須填寫日租價錢");
    }
    if (this.car_data.offer_plan_list.filter(d => d.minimum_rental_days == null).length > 0) {
      return this.commonService.openErrorSnackBar("必須填寫所有計劃日數");
    }
    // if (this.car_data.offer_plan_list.filter(d => d.price_per_day == null || d.price_per_day == '').length > 0) {
    //   return this.commonService.openErrorSnackBar("必須填寫所有計劃價錢");
    // }
    // if (this.car_data.offer_plan_list.filter(d => d.original_price == null || d.original_price == '').length > 0) {
    //   return this.commonService.openErrorSnackBar("必須填寫所有計劃原價");
    // }
    if (this.hasDuplicates(this.car_data.offer_plan_list.map(d => d.minimum_rental_days))) {
      return this.commonService.openErrorSnackBar("所有計劃日數不能重覆");
    }
    if (this.car_data.minimum_booking_days != null && this.car_data.minimum_booking_days <= 0) {
      return this.commonService.openErrorSnackBar("最少租用日必須為1天");
    }
    if (this.car_data.minimum_booking_days > this.car_data.maximum_booking_days) {
      return this.commonService.openErrorSnackBar("最少租用日不得大於最多租用日");
    }
    console.log(JSON.stringify(this.car_data));
    this.apiService.postFromServer(ApiPath.new_car, this.car_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.car_id = res.data.id;
        this.car_data = JSON.parse(JSON.stringify(res.data));
        this.checking_car_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/car-detail?car_id=' + res.data.id);
        }, 1000);
      } else {
        switch (true) {
          case res.data == 'invalid engine':
            this.commonService.openErrorSnackBar("引撆不正確");
            break;
          case res.data == 'invalid offer plan list format':
            this.commonService.openErrorSnackBar("租借計劃不正確");
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

  addOfferPlan() {
    let offer_plan: OfferPlan = {
      hide_total: false,
      info: null,
      minimum_rental_days: null,
      price_per_day: null,
      original_price: null,
      insurance_price_tier_one_percentage: null,
      insurance_price_tier_two_percentage: null
    };
    this.car_data.offer_plan_list.push(offer_plan);
  }

  disabledChange(ev) {
    console.log(ev);
    this.car_data.disabled = !ev.detail.checked;
  }

  hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>, type) {
    this.car_data[type] = ev.detail.complete(this.car_data[type]);
    ev.detail.complete();
  }

  selectionDateChanged(field, date: HTMLInputElement) {
    if (date.value != null && date.value != '' && date.value != null && date.value != '') {
      this.car_data[field] = date.value.substring(0, 10);
    }
  }

  handleDefaultPickupChange(e) {
    console.log(e);
    this.car_data.applicable_pickup_parking_id_list = e.detail.value != '' ? [e.detail.value] : [];
  }

  keylessPickupDropOffCheckboxChange(e) {
    console.log(e);
    if (e.detail.checked) {
      this.car_data.maximum_pick_time_to_allow_another_return = "03:00";
      this.car_data.maximum_return_time_to_allow_another_pickup = "20:00";
      this.car_data.starting_hour_to_allow_pickup = 0;
      this.car_data.ending_hour_to_allow_return = 23;
      this.car_data.minimun_hour_interval_between_pickup_return = 1;
    } else {
      this.car_data.maximum_pick_time_to_allow_another_return = "";
      this.car_data.maximum_return_time_to_allow_another_pickup = "";
      this.car_data.starting_hour_to_allow_pickup = null;
      this.car_data.ending_hour_to_allow_return = null;
      this.car_data.minimun_hour_interval_between_pickup_return = null;
    }
  }

  newCarDamage() {
    let new_car_damage: CarDamage = {
      category: null,
      category_name: "",
      subcategory: null,
      subcategory_name: '',
      img_url_list: []
    }
    this.car_data.car_damage_list.push(new_car_damage);
  }

  damageCategoryChange(index) {
    setTimeout(() => {
      this.car_data.car_damage_list[index].category_name = this.translateService.translations[this.translateService.currentLang]['car_damage'][this.car_data.car_damage_list[index].category];
      this.car_data.car_damage_list[index].subcategory = null;
      switch (this.car_data.car_damage_list[index].category) {
        case CarDamageCategory.front:
          this.subcategory_list = this.carDamageFrontSubcategory;
          break;
        case CarDamageCategory.left_side:
          this.subcategory_list = this.carDamageLeftSideSubcategory;
          break;
        case CarDamageCategory.right_side:
          this.subcategory_list = this.carDamageRightSideSubcategory;
          break;
        case CarDamageCategory.rear:
          this.subcategory_list = this.carDamageRearSubcategory;
          break;

        default:
          break;
      }
    }, 500);
  }

  damageSubcategoryChange(index) {
    setTimeout(() => {
      if (this.car_data.car_damage_list.filter((d: CarDamage) => d.category == this.car_data.car_damage_list[index].category && d.subcategory == this.car_data.car_damage_list[index].subcategory).length > 1) {
        this.car_data.car_damage_list[index].subcategory = null;
        this.commonService.openErrorSnackBar('相同分類及子分類已存在');
        return;
      }
      this.car_data.car_damage_list[index].subcategory_name = this.translateService.translations[this.translateService.currentLang]['car_damage'][this.car_data.car_damage_list[index].subcategory];
    }, 500);
  }

  async openJimiSreaming(type) {
    if (!this.commonService.isWeb){
      // return this.commonService.openErrorSnackBar("只支援desktop");
      return;
    }
    const get_streaming_live_url_result: Response = await this.dataService.getJimiDeviceStreamingLive(this.car_id, type, 0);
      console.log("get_streaming_live_url_result: ", get_streaming_live_url_result);
    if (get_streaming_live_url_result.result == 'success') {
      if (get_streaming_live_url_result.data == '') {
        return this.commonService.openErrorSnackBar();
      }
      this.streaming_url = this.sanitizer.bypassSecurityTrustResourceUrl(get_streaming_live_url_result.data);
      console.log("streaming_url: ", this.streaming_url);
      // this.isLiveStreamingModalOpen = true;
      // this.isHistoricalStreamingModalOpen = true;
    }
  }

  async openJimiMap() {
    if (!this.commonService.isWeb){
      return this.commonService.openErrorSnackBar("只支援desktop");
    }
    const get_live_map_url_result: Response = await this.dataService.getJimiDeviceLiveMap(this.car_id);
    if (get_live_map_url_result.result == 'success') {
      if (get_live_map_url_result.data == '') {
        return this.commonService.openErrorSnackBar();
      }
      window.open(get_live_map_url_result.data, '_blank');
    }
  }

  async getJimiDeviceLocation() {
    const get_jimi_device_location_result: Response = await this.dataService.getJimiDeviceLocation(this.car_id);
    console.log(get_jimi_device_location_result);
    if (get_jimi_device_location_result.result == 'success') {
      this.jimi_device_location = get_jimi_device_location_result.data[0];
    }
  }

  onDidDismiss(event: Event) {
    this.isLiveStreamingModalOpen = false;
    this.isHistoricalStreamingModalOpen = false;
    this.streaming_url = '';
  }

}

