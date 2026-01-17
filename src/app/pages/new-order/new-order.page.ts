import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { CalendarModal, CalendarModalOptions, DayConfig } from 'ion2-calendar';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { AdminData, AdminType, Authority, CampaignData, CarData, CouponData, EquipmentData, OfferPlan, OrderData, ParkingData, ProductData, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.page.html',
  styleUrls: ['./new-order.page.scss'],
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
export class NewOrderPage implements OnInit {

  user_id: number = null;
  car_id: number = null;

  slideOpts = {
    slidesPerView: 4.5,
    spaceBetween: 10,
  }
  paymentSlideOpts = {
    slidesPerView: 2.2,
    spaceBetween: 10,
  }
  dateRange: {
    from: Date;
    to: Date
  }

  daysConfig: DayConfig[] = [];
  upload_type = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();
  all_admin_data_list$: Observable<AdminData[]> = this.dataService.all_admin_data_list$.pipe();
  rentable_car_data_list$: Observable<CarData[]> = this.dataService.rentable_car_data_list$.pipe();

  temp_order_data: OrderData = null;
  admin_data: AdminData = null;
  admin_data$: Observable<AdminData> = this.auth.adminData.pipe();
  car_data$: Observable<CarData> = this.dataService.selected_car_data$.pipe();
  user_data$: Observable<UserData> = this.dataService.selected_user_data$.pipe();
  update_user_data: UserData = null;

  available_campaign_data$: Observable<CampaignData> = this.dataService.available_campaign_data$.pipe();
  rentable_parking_data_list$: Observable<ParkingData[]> = this.dataService.rentable_parking_data_list$.pipe(
    map((p: ParkingData[]) => {
      return p == null ? null : p.filter(d => d.minimum_booking_days == null || d.minimum_booking_days <= this.temp_order_data.booking_date_list.length);
    })
  );
  drop_off_parking_data_list$: Observable<ParkingData[]> = this.dataService.parking_data_list$.pipe(
    map((p: ParkingData[]) => {
      // console.log(p.filter(d => d.is_car_rental_point));
      return p ? (this.dataService.selected_car_data$.value.applicable_return_parking_id_list.length > 0 ? p.filter(d => this.dataService.selected_car_data$.value.applicable_return_parking_id_list.includes(d.id)) : p.filter(d => d.is_car_rental_point)) : [];
    })
  );

  available_equipment_data_list$: Observable<EquipmentData[]> = this.dataService.available_equipment_data_list$.pipe();
  available_product_data_list$: Observable<ProductData[]> = this.dataService.available_product_data_list$.pipe();
  usable_coupon_data_list$: Observable<CouponData[]> = this.dataService.usable_coupon_data_list$.pipe();

  booking_days = null;
  car_rental_amount = null;

  pickup_selection: 'parking' | 'custom' = null;
  return_selection: 'parking' | 'custom' = null;

  minimun_hour_interval_between_pickup_return = null;
  minimum_booking_days_to_allow_parking_reservation = null;

  pickup_hour_list = null;
  return_hour_list = null;
  selectable_return_hour_list = null;

  insurance_price_tier_one_percentage: number = null;
  insurance_price_tier_two_percentage: number = null;
  price_per_day: number = null;

  coupon_code = null;

  payment_data_list = null;



  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }
  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  @ViewChild('content', { static: false }) content: IonContent;
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private modalController: ModalController,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private cdf: ChangeDetectorRef
  ) {
    this.matIconRegistry.addSvgIcon('visa', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon/visa.svg'));
    this.matIconRegistry.addSvgIcon('master', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon/master.svg'));
    this.matIconRegistry.addSvgIcon('bank_transfer', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon/bank_transfer.svg'));

    this.route.queryParams.subscribe(params => {
      this.user_id = params && params.user_id ? parseInt(params.user_id) : null;
      this.car_id = params && params.car_id ? parseInt(params.car_id) : null;
    });
  }

  async ngOnInit() {
    if (this.dataService.system_data$.value == null) {
      this.dataService.getSystemData();
    }
    if (this.dataService.user_data_list$.value == null) {
      await this.dataService.getAllUserData();
    }
    this.dataService.getAllParkingData();
    // await this.dataService.getAllRentableCarData(null, null, ['id', 'data_type', 'disabled', 'sold', 'brand', 'model', 'plate', 'car_cover_img_url', 'applicable_pickup_parking_id_list', 'applicable_return_parking_id_list', 'keyless_type', 'starting_hour_to_allow_pickup', 'ending_hour_to_allow_return', 'minimum_booking_days_to_allow_parking_reservation', 'insurance_price_tier_one_percentage', 'insurance_price_tier_two_percentage', 'price_per_day', 'minimun_hour_interval_between_pickup_return']);
    await this.dataService.getAllRentableCarData(null, null);

    if (this.car_id != null) {
      console.log(this.car_id);
      this.selectCar(null, this.car_id);
    }
    if (this.user_id != null) {
      console.log(this.user_id);
      this.selectUser(null, this.user_id);
    }

    this.dataService.getAllAdminData();
  }

  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  triggerImgUpload(type) {
    if (this.upload_img == null) {
      return;
    }
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
          let user_data: UserData = this.dataService.selected_user_data$.value;
          switch (this.upload_type) {
            case 'br_url':
              this.update_user_data.br_url = upload_base64_to_server.data;
              break;
            case 'identity_card_url':
              this.update_user_data.identity_card_url = upload_base64_to_server.data;
              break;
            case 'address_proof_url':
              this.update_user_data.address_proof_url = upload_base64_to_server.data;
              break;
            case 'driving_license_url':
              this.update_user_data.driving_license_url = upload_base64_to_server.data;
              break;
            // case 'bank_transfer_img_url':
            //   this.bank_transfer_img_url.setValue(upload_base64_to_server.data);
            //   break;

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

  async getNewTempOrder() {
    const get_temp_order: Response = await this.dataService.getTempOrderDataByUserId();
    this.temp_order_data = get_temp_order.data;
    console.log("temp_order_data: ", this.temp_order_data);
  }

  async getAvailableEquipmentDataList() {
    const get_available_equipment_data_list = await this.dataService.getAvailableEquipmentDataList(this.temp_order_data.booking_date_list);
  }

  async getAvailableProductDataList() {
    const get_available_product_data_list = await this.dataService.getAvailableProductDataList(this.temp_order_data.booking_date_list == null ? 0 : this.temp_order_data.booking_date_list.length);
  }

  async getAvailableCampaign() {
    const get_available_campaign = await this.dataService.getAvailableCampaignByUserIdAndCarid();
  }

  async getUsableCouponData() {
    const get_usable_coupon_data_list = await this.dataService.getUsableCouponDataList(this.temp_order_data.booking_date_list.length);
  }

  async getUnavailableBookingDateListByCarIdAndUserId() {
    const get_unavailable_booking_date_list = await this.dataService.getUnavailableBookingDateListByCarIdAndUserId();
    this.disableUnavailableBookingDateOnCalendar();
  }

  disableUnavailableBookingDateOnCalendar() {
    this.daysConfig = [];
    if (this.dataService.unavailable_booking_date_list$.value != null) {
      if (this.dataService.unavailable_booking_date_list$.value.hasOwnProperty('user_booked_date_list')) {
        this.dataService.unavailable_booking_date_list$.value.user_booked_date_list.forEach(date => {
          this.daysConfig.push({
            date: new Date(date),
            disable: true,
            title: '已租車',
            cssClass: 'calendar-user-booked-date'
          });
        });
      }
      if (this.dataService.unavailable_booking_date_list$.value.hasOwnProperty('car_booked_date_list')) {
        this.dataService.unavailable_booking_date_list$.value.car_booked_date_list.forEach(date => {
          this.daysConfig.push({
            date: new Date(date),
            disable: true,
            title: '已被租用',
            cssClass: 'calendar-user-booked-date'
          });
        });
      }
      if (this.dataService.unavailable_booking_date_list$.value.hasOwnProperty('car_blocked_date_list')) {
        this.dataService.unavailable_booking_date_list$.value.car_blocked_date_list.forEach(date => {
          this.daysConfig.push({
            date: new Date(date),
            disable: true,
            title: '已被禁租',
            cssClass: 'calendar-user-booked-date'
          });
        });
      }
    }
  }

  async selectUser(ev, user_id?) {
    if (user_id) {
      if (this.dataService.user_data_list$.value.find(d => d.id == this.user_id) != null) {
        this.dataService.selected_user_data$.next(this.dataService.user_data_list$.value.find(d => d.id == this.user_id));
      }
      else {
        return;
      }
    }
    else if (ev) {
      this.dataService.selected_user_data$.next(this.dataService.user_data_list$.value.find(d => d.id == ev.value.id));
    }
    else {
      return;
    }
    await this.getUserData();
    // await this.dataService.getAllRentableCarData(null, null, ['id', 'data_type', 'disabled', 'sold', 'brand', 'model', 'plate', 'car_cover_img_url', 'applicable_pickup_parking_id_list', 'applicable_return_parking_id_list', 'keyless_type']);
    await this.dataService.getAllRentableCarData(null, null);
    this.getNewTempOrder();
    this.getUnavailableBookingDateListByCarIdAndUserId();
    if (this.dataService.selected_car_data$.value != null) {
      this.getAvailableCampaign();
    }
  }

  async getUserData() {
    const get_user_data_result: Response = await this.dataService.getUserDataById(this.dataService.selected_user_data$.value.id);
    if (get_user_data_result.result == 'success') {
      this.update_user_data = JSON.parse(JSON.stringify(get_user_data_result.data));
      this.dataService.selected_user_data$.next(get_user_data_result.data);
      console.log(get_user_data_result.data);
      console.log(this.dataService.available_equipment_data_list$.value);
    }
  }

  selectStaff(ev) {
    // console.log(ev);
    // console.log(this.temp_order_data);
    this.temp_order_data.admin_id = this.admin_data.id;
  }

  async getRentableParkingDataList() {
    if (this.dataService.selected_car_data$.value == null) {
      return;
    }
    const get_rentable_parking_data_list = await this.dataService.getRentableParkingDataList();
    this.temp_order_data.parking_id = null;
    this.temp_order_data.parking_data = null;
  }

  async selectCar(ev, car_id?) {
    if (car_id) {
      if (this.dataService.rentable_car_data_list$.value.find(d => d.id == this.car_id) != null) {
        this.dataService.selected_car_data$.next(this.dataService.rentable_car_data_list$.value.find(d => d.id == this.car_id));
      }
      else {
        return;
      }
    }
    else if (ev) {
      let car_id = ev.value.id;
      if (this.dataService.rentable_car_data_list$.value.find(d => d.id == car_id) != null) {
        this.dataService.selected_car_data$.next(this.dataService.rentable_car_data_list$.value.find(d => d.id == car_id));
      }
    }
    else {
      return;
    }
    this.clearPaymentDataList();
    console.log("selected car: ", this.dataService.selected_car_data$.value);
    //REMARK reset date range selection
    this.temp_order_data.start_date = '';
    this.temp_order_data.end_date = '';
    this.booking_days = null;
    this.car_rental_amount = null;

    // this.temp_order_data.start_date = "";
    // this.temp_order_data.end_date = "";
    // this.temp_order_data.booking_date_list = [];
    // this.all_available_car_data_list = null;
    // this.booking_days = null;
    // this.car_rental_amount = null;

    this.temp_order_data.car_id = this.dataService.selected_car_data$.value.id;
    this.getUnavailableBookingDateListByCarIdAndUserId();
    await this.getAvailableCampaign();
    await this.getRentableParkingDataList();

    if (this.temp_order_data.start_date != null && this.temp_order_data.start_date != '') {
      this.calculateRentalAmount();
      //TODO get restriction of pick up/return time
      this.getReturnAndPickupLimit();

      this.resetParking();
      this.resetPickUpAndReturnData();

      this.getAvailableEquipmentDataList();
      this.getAvailableProductDataList();
    }

  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: '選擇租用日期',
      defaultDateRange: this.dateRange,
      doneLabel: '確認',
      closeIcon: true,
      monthFormat: 'YYYY年MM月',
      // to: new Date().setMonth(new Date().getMonth() + this.dataService.system_data$.value.maximum_booking_month_in_advance),
      defaultEndDateToStartDate: true,
      step: 36,
      daysConfig: this.daysConfig
    };

    const booking_calendar = await this.modalController.create({
      component: CalendarModal,
      componentProps: { options },
      showBackdrop: true,
      backdropDismiss: true,
      swipeToClose: true,
      cssClass: "home-booking-calendar",
      // presentingElement: this.routerOutlet.nativeEl //REMARK IOS feature
    });

    booking_calendar.present();

    const event: any = await booking_calendar.onDidDismiss();
    const date: any = event.data;
    console.log(date);
    if (date != null) {
      this.clearPaymentDataList();

      this.dateRange = {
        from: date.from.dateObj,
        to: date.to.dateObj
      };
      this.temp_order_data.start_date = date.from.string;
      this.temp_order_data.end_date = date.to.string;

      if (this.temp_order_data.start_date == this.temp_order_data.end_date) {
        return this.commonService.openSnackBar('至少選擇2日（1晚）');
      }
      const generate_booking_date_list = await this.generateAllBookingDateToList();
      // console.log(this.temp_order_data.booking_date_list);
      if (this.temp_order_data.booking_date_list.filter(d => this.dataService.unavailable_booking_date_list$.value.user_booked_date_list.includes(d) || this.dataService.unavailable_booking_date_list$.value.car_blocked_date_list.includes(d) || this.dataService.unavailable_booking_date_list$.value.car_booked_date_list.includes(d)).length > 0) {
        this.temp_order_data.start_date = '';
        this.temp_order_data.end_date = '';
        this.booking_days = null;
        this.car_rental_amount = null;
        return this.commonService.openSnackBar('此時段不能租用');
      }
      this.getTotalBookingDays();
      this.dataService.getAllRentableCarData(null, null, ['id', 'data_type', 'disabled', 'sold', 'brand', 'model', 'plate', 'car_cover_img_url', 'applicable_pickup_parking_id_list', 'applicable_return_parking_id_list', 'keyless_type']);
      this.getRentableParkingDataList();
      if (this.dataService.selected_car_data$.value != null) {
        this.calculateRentalAmount();
        this.getAvailableEquipmentDataList();
        this.getAvailableProductDataList();
        this.resetPickUpAndReturnData();
        this.getReturnAndPickupLimit();
        this.insurancePlan();
      }

    }
  }

  async dateRangeChanged(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value != null && dateRangeStart.value != '' && dateRangeEnd.value != null && dateRangeEnd.value != '') {
      this.temp_order_data.start_date = dateRangeStart.value.substring(0, 10);
      this.temp_order_data.end_date = dateRangeEnd.value.substring(0, 10);

      if (this.temp_order_data.start_date == this.temp_order_data.end_date) {
        return this.commonService.openSnackBar('至少選擇2日（1晚）');
      }
      const generate_booking_date_list = await this.generateAllBookingDateToList();
      console.log(this.temp_order_data.booking_date_list);
      if (this.temp_order_data.booking_date_list.filter(d => this.dataService.unavailable_booking_date_list$.value.user_booked_date_list.includes(d)).length > 0) {
        return this.commonService.openSnackBar('此用戶已有其他訂單於此時段');
      }
      this.dataService.getAllRentableCarData(null, null, ['id', 'data_type', 'disabled', 'sold', 'brand', 'model', 'plate', 'car_cover_img_url', 'applicable_pickup_parking_id_list', 'applicable_return_parking_id_list', 'keyless_type']);
    }
  }

  generateAllBookingDateToList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.temp_order_data.booking_date_list = [];
      let day = 1000 * 60 * 60 * 24;
      let diff = (new Date(this.temp_order_data.end_date).getTime() - new Date(this.temp_order_data.start_date).getTime()) / day;
      // console.log(diff);
      for (let i = 0; i < diff; i++) {
        let xx = new Date(this.temp_order_data.start_date).getTime() + day * i;
        let yy = new Date(xx);
        let date = yy.getFullYear() + "-" + ('0' + (yy.getMonth() + 1)).slice(-2) + "-" + ('0' + (yy.getDate())).slice(-2);
        this.temp_order_data.booking_date_list.push(date);
      }
      resolve('completed');
    });
  }

  getAllRentableCarData() {
    const get_all_rentable_car_data = this.dataService.getAllRentableCarData(this.temp_order_data.start_date, this.temp_order_data.end_date);
  }


  parkingChange(ev, parking_data?: ParkingData) {
    this.cdf.detectChanges();
    this.clearPaymentDataList();

    if ((ev == null || ev.detail.value == null) && parking_data == undefined) {
      this.temp_order_data.parking_id = null;
      this.temp_order_data.parking_data = null;
    }
    else if (parking_data) {
      this.temp_order_data.parking_id = parking_data.id;
      this.temp_order_data.parking_data = parking_data;
    }
    else {
      let parking_id = ev.detail.value;
      if (this.dataService.rentable_parking_data_list$.value != null && this.dataService.rentable_parking_data_list$.value.length > 0) {
        let parking_data = this.dataService.rentable_parking_data_list$.value.find(d => d.id == parking_id);
        this.temp_order_data.parking_id = parking_id;
        this.temp_order_data.parking_data = parking_data;
      }
    }
    console.log(this.temp_order_data.parking_data);
  }

  resetParking() {
    this.temp_order_data.parking_id = null;
    this.temp_order_data.parking_data = null;
  }

  resetPickUpAndReturnData() {
    this.pickup_selection = null;
    this.return_selection = null;
    this.temp_order_data.pick_up_data.parking_id = null;
    this.temp_order_data.pick_up_data.district = "";
    this.temp_order_data.pick_up_data.address = "";
    this.temp_order_data.pick_up_data.charge = "";
    this.temp_order_data.return_data.parking_id = null;
    this.temp_order_data.return_data.district = "";
    this.temp_order_data.return_data.address = "";
    this.temp_order_data.return_data.charge = "";
  }

  getReturnAndPickupLimit() {
    if (this.temp_order_data.car_id == null) {
      return this.commonService.openSnackBar("請選擇車輛");
    }
    this.dataService.getPickUpAndReturnHourList(this.temp_order_data.car_id, this.temp_order_data.start_date, this.temp_order_data.end_date).then((pickup_and_return_hour_list) => {
      console.log(pickup_and_return_hour_list);
      this.pickup_hour_list = pickup_and_return_hour_list.pickup_hour_list;
      this.return_hour_list = pickup_and_return_hour_list.return_hour_list;
      this.selectable_return_hour_list = pickup_and_return_hour_list.return_hour_list;
    });
  }

  pickUpTimeChange(ev) {
    this.temp_order_data.return_data.time = '';
    this.selectable_return_hour_list = this.return_hour_list.filter(d => d <= Number(this.temp_order_data.pick_up_data.time.split(':')[0]));
  }

  returnTimeChange(ev) {
  }

  padTimeZero(hour_list: number[]) {
    return hour_list != null && hour_list.length > 0 ? hour_list.map(d => `${d.toString().padStart(2, '0')}:00`) : hour_list;
  }

  getTotalBookingDays() {
    let day = 1000 * 60 * 60 * 24;
    this.booking_days = (new Date(this.temp_order_data.end_date).getTime() - new Date(this.temp_order_data.start_date).getTime()) / day;
  }

  calculateRentalAmount() {
    let send_data = {
      booking_days: this.booking_days,
      car_id: this.dataService.selected_car_data$.value.id,
      user_id: this.dataService.selected_user_data$.value.id
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.calculate_car_rental_amount_by_booking_days_and_car_id_and_user_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.car_rental_amount = res.data;
        console.log("car_rental_amount: ", this.car_rental_amount);
      }
      else {
        this.commonService.openErrorSnackBar();
      }
    });
  }

  pickUpSelectionChange(ev) {
    if (ev.detail.value == 'custom') {
      this.temp_order_data.pick_up_data.parking_id = null;
      this.temp_order_data.pick_up_data.address = "";
    }
    else if (ev.detail.value == 'parking') {
      this.getOrderPickupLocation()
    }
  }

  returnSelectionChange(ev) {
    if (ev.detail.value == 'custom') {
      this.temp_order_data.return_data.parking_id = null;
      this.temp_order_data.return_data.address = "";
    }
    else if (ev.detail.value == 'parking') {
      this.temp_order_data.pick_up_data.district = "";
      this.temp_order_data.pick_up_data.charge = null;
    }
  }

  returnpParkingSelectionChange(ev) {
    let parking_id: number = ev.detail.value;
    this.temp_order_data.return_data.parking_id = parking_id;
    this.temp_order_data.return_data.address = this.dataService.parking_data_list$.value.find(d => d.id == parking_id).zh_address;
  }

  async getOrderPickupLocation() {
    console.log(this.dataService.selected_car_data$.value);
    let pickup_parking_data = await this.dataService.getCarParkingDataForPickUp(this.dataService.selected_car_data$.value, this.temp_order_data.start_date);
    this.temp_order_data.pick_up_data.parking_id = pickup_parking_data.id;
    this.temp_order_data.pick_up_data.address = pickup_parking_data.zh_address;
    this.temp_order_data.pick_up_data.district = "";
    this.temp_order_data.pick_up_data.charge = null;
  }

  districtChange(ev, pickup_or_return: 'pickup' | 'return') {
    if (pickup_or_return == 'pickup') {
      this.temp_order_data.pick_up_data.district = ev.detail.value;
      switch (ev.detail.value) {
        case "香港":
          this.temp_order_data.pick_up_data.charge = this.dataService.system_data$.value.hong_kong_island_custom_pick_up_charge.toString();
          break;
        case "九龍":
          this.temp_order_data.pick_up_data.charge = this.dataService.system_data$.value.kowloon_custom_pick_up_charge.toString();
          break;
        case "新界":
          this.temp_order_data.pick_up_data.charge = this.dataService.system_data$.value.new_territories_custom_pick_up_charge.toString();
          break;

        default:
          break;
      }
    }
    else {
      this.temp_order_data.return_data.district = ev.detail.value;
      switch (ev.detail.value) {
        case "香港":
          this.temp_order_data.return_data.charge = this.dataService.system_data$.value.hong_kong_island_custom_pick_up_charge.toString();
          break;
        case "九龍":
          this.temp_order_data.return_data.charge = this.dataService.system_data$.value.kowloon_custom_pick_up_charge.toString();
          break;
        case "新界":
          this.temp_order_data.return_data.charge = this.dataService.system_data$.value.new_territories_custom_pick_up_charge.toString();
          break;

        default:
          break;
      }
    }
  }


  addEquipmentToCart(item) {
    this.clearPaymentDataList();

    if (this.temp_order_data.equipment_data_list.filter(d => d.category == item.category).length == item.available_equipment_data_list.length) {
      this.commonService.openSnackBar('沒有更多可租用設備');
    }
    else {
      let not_added_equipment_data_list = item.available_equipment_data_list.filter(d => !this.temp_order_data.equipment_id_list.includes(d.id));
      if (not_added_equipment_data_list.length > 0) {
        this.temp_order_data.equipment_id_list.push(not_added_equipment_data_list[0].id);
        this.temp_order_data.equipment_data_list.push(JSON.parse(JSON.stringify(not_added_equipment_data_list[0])));
      }
      console.log(this.temp_order_data.equipment_id_list);
      console.log(this.temp_order_data.equipment_data_list);
    }
  }

  removeEquipmentToCart(item) {
    this.clearPaymentDataList();

    let index = this.temp_order_data.equipment_data_list.map(d => d.category).indexOf(item.category);
    if (index != undefined && index != null && index != -1) {
      this.temp_order_data.equipment_id_list.splice(index, 1);
      this.temp_order_data.equipment_data_list.splice(index, 1);
    }
    // console.log(this.temp_order_data.equipment_id_list);
    // console.log(this.temp_order_data.equipment_data_list);
  }

  getOrderEquipmentQuantityByCategory(category) {
    return this.temp_order_data.equipment_data_list.filter(d => d.category == category).length;
  }

  addProductToCart(item) {
    this.clearPaymentDataList();

    let index = this.temp_order_data.product_cart_list.map(d => d.product_id).indexOf(item.id);
    if (index != undefined && index != null && index != -1) {
      // add quantity
      if (this.temp_order_data.product_cart_list[index].quantity >= item.inventory) {
        this.commonService.openSnackBar('沒有更多加購品');
      }
      else if (item.quota && item.quota != null && this.temp_order_data.product_cart_list[index].quantity >= item.quota) {
        this.commonService.openSnackBar('超過可購買配額');
      }
      else {
        this.temp_order_data.product_cart_list[index].quantity++;
      }
    }
    else {
      //add to cart
      let cart_date = {
        product_id: item.id,
        quantity: 1,
        product_data: JSON.parse(JSON.stringify(item))
      }
      this.temp_order_data.product_cart_list.push(cart_date);
    }
    console.log(this.temp_order_data.product_cart_list);
  }

  removeProductToCart(item) {
    this.clearPaymentDataList();

    let index = this.temp_order_data.product_cart_list.map(d => d.product_id).indexOf(item.id);
    if (index != undefined && index != null && index != -1) {
      if (this.temp_order_data.product_cart_list[index].quantity == 1) {
        this.temp_order_data.product_cart_list.splice(index, 1);
      }
      else {
        this.temp_order_data.product_cart_list[index].quantity--;
      }
    }
    console.log(this.temp_order_data.product_cart_list);
  }

  getOrderProductQuantityByProductId(product_id) {
    return this.temp_order_data.product_cart_list.filter(d => d.product_id == product_id).length > 0 ? this.temp_order_data.product_cart_list.filter(d => d.product_id == product_id)[0].quantity : 0;
  }

  clearPaymentDataList() {
    this.payment_data_list = null;
  }

  async generatePaymentDataList() {
    if (!this.dataService.system_data$.value.credit_card_exclusive_user_id_list.includes(this.temp_order_data.user_id) && this.dataService.selected_user_data$.value.auto_charge_adyen_payment_method_id == '') {
      return this.commonService.openErrorSnackBar('客人必需綁定信用卡方可租車', 'OK', 10000);
    }
    if (this.dataService.selected_user_data$.value.identity_card_url == '') {
      return this.commonService.openErrorSnackBar('客人必需上載身份證並通過驗證', 'OK', 10000);
    }
    if (this.dataService.selected_user_data$.value.driving_license_url == '') {
      return this.commonService.openErrorSnackBar('客人必需上載駕駛執照', 'OK', 10000);
    }
    if (this.dataService.selected_user_data$.value.address_proof_url == '') {
      return this.commonService.openErrorSnackBar('客人必需上載住址證明', 'OK', 10000);
    }
    //auto rent all parking for short-term rental
    if (this.temp_order_data.booking_date_list.length > 0 && this.temp_order_data.booking_date_list.length < 30 && this.dataService.rentable_car_data_list$.value && this.dataService.rentable_car_data_list$.value.length > 0) {
      const parking_data_all: ParkingData = this.dataService.rentable_parking_data_list$.value.find(d => d.id == 8);
      if (parking_data_all) this.parkingChange(null, parking_data_all);
    }

    //CHECKING
    if (this.temp_order_data.booking_date_list == null || this.temp_order_data.booking_date_list.length <= 0 || this.temp_order_data.start_date == null || this.temp_order_data.start_date == '' || this.temp_order_data.end_date == null || this.temp_order_data.end_date == '') {
      return this.commonService.openErrorSnackBar("請選擇租用期");
    }
    if (this.temp_order_data.pick_up_data.time == null || this.temp_order_data.pick_up_data.time == '') {
      return this.commonService.openErrorSnackBar("請選擇取車時間");
    }
    if (this.temp_order_data.return_data.time == null || this.temp_order_data.return_data.time == '') {
      return this.commonService.openErrorSnackBar("請選擇還車時間");
    }
    if (this.pickup_selection == 'custom' && (this.temp_order_data.pick_up_data.district == null || this.temp_order_data.pick_up_data.district == '')) {
      return this.commonService.openErrorSnackBar("請選擇取車地區");
    }
    if (this.temp_order_data.pick_up_data.address == null || this.temp_order_data.pick_up_data.address == '') {
      return this.commonService.openErrorSnackBar("請選擇取車地址");
    }
    if (this.return_selection == 'custom' && (this.temp_order_data.return_data.district == null || this.temp_order_data.return_data.district == '')) {
      return this.commonService.openErrorSnackBar("請選擇還車地區");
    }
    if (this.return_selection == 'parking' && this.temp_order_data.return_data.parking_id == null) {
      return this.commonService.openErrorSnackBar("請選擇還車租車點");
    }

    this.temp_order_data.return_data.district = this.temp_order_data.pick_up_data.district;
    this.temp_order_data.return_data.address = this.temp_order_data.pick_up_data.address;
    this.temp_order_data.return_data.charge = this.temp_order_data.pick_up_data.charge;
    console.log(this.temp_order_data);

    let send_data = {
      id: this.update_user_data.id,
    }

    send_data = this.commonService.updateDataChecker(send_data, this.update_user_data, this.dataService.selected_user_data$.value);

    if (Object.keys(send_data).length > 1) {
      const update_user = await this.apiService.postFromServer(ApiPath.update_user, send_data, true);
      if (update_user.result != "success") {
        return this.commonService.openErrorSnackBar();
      }
    }

    //generate payment data
    console.log("order_data for generate payment data list: ", JSON.stringify(this.temp_order_data));
    const generate_payment_data_list = await this.apiService.postFromServer(ApiPath.generate_payment_data, this.temp_order_data, true);
    console.log(generate_payment_data_list);
    if (generate_payment_data_list.result == "success") {
      this.temp_order_data = generate_payment_data_list.data.order_data;
      this.payment_data_list = generate_payment_data_list.data.payment_data_list;
      console.log("order_data: ", this.temp_order_data);
      console.log("payment_data: ", this.payment_data_list);

      if (this.temp_order_data.campaign_data == null) {
        this.getUsableCouponData();
      }
      if (this.dataService.awaiting_application_deposit_amount$.value == null) {
        await this.dataService.getAwaitingApplicationDepositAmountAndCreateDateByUserId();
      }

      setTimeout(() => {
        this.content.scrollToBottom(500);
      }, 100);

      // this.step++;
    } else {
      this.commonService.openErrorSnackBar();
    }
  }


  async recalculatePayment() {
    if (this.payment_data_list[0].status == 'paid' && this.payment_data_list[0].payment_method == 'credit_card') {
      return this.commonService.openErrorSnackBar("已使用信用卡付款，不能更改");
    }
    if (this.payment_data_list[0].penality_amount === null || this.payment_data_list[0].penality_amount === '') {
      return this.commonService.openErrorSnackBar("所有金額數值不能留空，最少為0");
    }
    if (this.payment_data_list[0].internal_discount_amount === null || this.payment_data_list[0].internal_discount_amount === '') {
      return this.commonService.openErrorSnackBar("所有金額數值不能留空，最少為0");
    }
    if (this.payment_data_list[0].internal_charge_amount === null || this.payment_data_list[0].internal_charge_amount === '') {
      return this.commonService.openErrorSnackBar("所有金額數值不能留空，最少為0");
    }

    const calculated_payment_data = await this.dataService.calculatePaymentDataAmount(this.payment_data_list[0]);
    if (calculated_payment_data != null) {
      this.payment_data_list[0] = calculated_payment_data;
    }
  }


  async applyDiscount(discount_type: 'coupon' | 'deposit_discount' | 'reset', coupon_code?) {
    const apply_payment_data = await this.dataService.applyCouponToPayment(discount_type, this.payment_data_list[0], (discount_type == 'coupon' ? (coupon_code ? coupon_code : this.coupon_code) : null));
    console.log(apply_payment_data);
    if (apply_payment_data) {
      this.payment_data_list[0] = apply_payment_data;
    }
  }

  async changePaymentMethod(payment_method) {
    if (this.payment_data_list[0].payment_method != payment_method) {
      this.payment_data_list[0].payment_method = payment_method;
      const calculated_payment_data = await this.dataService.calculatePaymentDataAmount(this.payment_data_list[0]);
      if (calculated_payment_data != null) {
        this.payment_data_list[0] = calculated_payment_data;
      }
    }
  }

  async makeOrder() {
    const make_order_result: Response = await this.dataService.makeOrder(this.temp_order_data, this.payment_data_list);
    if (make_order_result.result == "success") {
      this.commonService.isLoading = true;
      this.temp_order_data = JSON.parse(JSON.stringify(make_order_result.data.order_data));
      this.payment_data_list = JSON.parse(JSON.stringify(make_order_result.data.payment_data_list));
      this.commonService.openSnackBar("已建立訂單！");
      setTimeout(() => {
        this.commonService.isLoading = false;
        this.commonService.openCMSPage('/order-detail?order_id=' + this.temp_order_data.id, 'root')
      }, 3000);
    }
  }

  getParkingDataById(parking_id: number) {
    return this.dataService.parking_data_list$.value == null ? null : this.dataService.parking_data_list$.value.find(d => d.id == parking_id);
  }

  selectOrderDetailForDevOnly() {
    this.temp_order_data.pick_up_data.time = `${this.pickup_hour_list[0]}:00`;
    setTimeout(() => {
      this.temp_order_data.return_data.time = `${this.return_hour_list[0]}:00`;
    }, 500);
    this.pickup_selection = 'parking';
    this.return_selection = 'parking';
    this.getOrderPickupLocation()
    this.temp_order_data.return_data.parking_id = this.dataService.parking_data_list$.value.filter(d => d.is_car_rental_point)[0].id
    this.temp_order_data.return_data.address = this.dataService.parking_data_list$.value.filter(d => d.is_car_rental_point)[0].zh_address;

    this.temp_order_data.pick_up_data.district = "";
    this.temp_order_data.return_data.district = "";
    this.temp_order_data.pick_up_data.charge = null;
    this.temp_order_data.return_data.charge = null;

    this.temp_order_data.parking_id = this.dataService.rentable_parking_data_list$.value[0].id;
    this.temp_order_data.parking_data = this.dataService.rentable_parking_data_list$.value[0];
  }

  insurancePlan() {
    this.temp_order_data.insurance_tier = null;

    let insurance_price_tier_one_percentage = null;
    let insurance_price_tier_two_percentage = null;
    if (this.temp_order_data.booking_date_list.length < 7) {
      insurance_price_tier_one_percentage = this.dataService.selected_car_data$.value.insurance_price_tier_one_percentage;
      insurance_price_tier_two_percentage = this.dataService.selected_car_data$.value.insurance_price_tier_two_percentage;
      this.price_per_day = this.dataService.selected_car_data$.value.price_per_day;
    }
    else {
      let valid_offer_plans = this.dataService.selected_car_data$.value.offer_plan_list.filter(d => d.minimum_rental_days <= this.temp_order_data.booking_date_list.length);
      let offer_plan: OfferPlan = valid_offer_plans[valid_offer_plans.length - 1];
      if (offer_plan != null) {
        insurance_price_tier_one_percentage = offer_plan.insurance_price_tier_one_percentage;
        insurance_price_tier_two_percentage = offer_plan.insurance_price_tier_two_percentage;
        this.price_per_day = offer_plan.price_per_day;
      }
    }
    this.insurance_price_tier_one_percentage = insurance_price_tier_one_percentage;
    this.insurance_price_tier_two_percentage = insurance_price_tier_two_percentage;
  }

  selectInsurancePlan(ev) {
    // console.log(ev);
    switch (ev.detail.value) {
      case '1':
        this.temp_order_data.insurance_tier = 1;
        break;
      case '2':
        this.temp_order_data.insurance_tier = 2;
        break;

      default:
        this.temp_order_data.insurance_tier = null;
        break;
    }

  }

}
