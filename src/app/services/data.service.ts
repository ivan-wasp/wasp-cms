import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { ApiPath, ApiService, Response } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { AdminData, CampaignData, CarDamage, CarData, CartData, ChargeData, CouponData, DATA_TYPE, EquipmentData, FactoryData, OrderData, OrderStatus, ParkingData, PaymentData, PaymentMethod, ProductData, ReturnVehicleReport, SystemData, UserData, VehicleRentalAgreement } from '../schema';

export interface UnavailableBookingDateListResult {
  user_booked_date_list: string[],
  car_booked_date_list: string[],
  car_blocked_date_list: string[]
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  table_data_list = null;
  table_data_total_number = null;
  table_data_number_of_page = null;

  static_page_url_list = [
    {
      "name": "按金客戶",
      "url": "deposit"
    },
    {
      "name": "全新車預租",
      "url": "car-list?type=prerent"
    },
  ]

  system_data$ = new BehaviorSubject<SystemData>(null);
  parking_data_list$ = new BehaviorSubject<ParkingData[]>(null);
  car_data_list$ = new BehaviorSubject<CarData[]>(null);
  user_data_list$ = new BehaviorSubject<UserData[]>(null);
  factory_data_list$ = new BehaviorSubject<FactoryData[]>(null);

  // booking_start_date$ = new BehaviorSubject<string>(null);
  // booking_end_date$ = new BehaviorSubject<string>(null);
  // booking_date_list$ = new BehaviorSubject<string[]>(null);
  selected_user_data$ = new BehaviorSubject<UserData>(null);
  selected_parking_id$ = new BehaviorSubject<number>(null);
  selected_car_data$ = new BehaviorSubject<CarData>(null);

  all_admin_data_list$ = new BehaviorSubject<AdminData[]>(null);
  rentable_car_data_list$ = new BehaviorSubject<CarData[]>(null);
  display_rentable_car_data_list$ = new BehaviorSubject<CarData[]>(null);
  unavailable_booking_date_list$ = new BehaviorSubject<UnavailableBookingDateListResult>(null);
  usable_coupon_data_list$ = new BehaviorSubject<CouponData[]>(null);
  available_campaign_data$ = new BehaviorSubject<CampaignData>(null);
  rentable_parking_data_list$ = new BehaviorSubject<ParkingData[]>(null);
  available_equipment_data_list$ = new BehaviorSubject<EquipmentData[]>(null);
  available_product_data_list$ = new BehaviorSubject<ProductData[]>(null);
  awaiting_application_deposit_amount$ = new BehaviorSubject<number>(null);
  awaiting_application_deposit_create_date$ = new BehaviorSubject<string>(null);

  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService
  ) { }

  resetTableData() {
    this.table_data_list = null;
    this.table_data_total_number = null;
    this.table_data_number_of_page = null;
  }

  getStaticPageUrlList() {
    return this.static_page_url_list;
  }

  getSystemData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let send_data = {
      }
      const res: Response = await this.apiService.postFromServer(ApiPath.get_system_data, send_data);
      if (res.result == 'success') {
        this.system_data$.next(res.data);
        resolve(true);
      }
      else{
        reject(false);
      }
    });

  }

  getSingleDataById(id: number, data_type: DATA_TYPE): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        id: id,
        data_type: data_type
      }
      this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data).then(res => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getAllDataByDataTypeAndIdList(data_type: DATA_TYPE, id_list?: number[], field_list?: string[], sorting?: string, direction?: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        data_type: data_type
      }
      if (id_list){
        send_data['id_list'] = id_list;
      }
      if (field_list){
        send_data['field_list'] = field_list;
      }
      if (sorting){
        send_data['sorting'] = sorting;
      }
      if (direction){
        send_data['direction'] = direction;
      }
      this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data).then(res => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getUserDataById(user_id): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        id: user_id,
      }
      this.apiService.postFromServer(ApiPath.get_user_data_by_id, send_data).then(res => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getAllParkingData(field_list?: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        data_type: "parking_data"
      }
      if (field_list){
        send_data['field_list'] = field_list;
      }
      this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data).then(res => {
        this.parking_data_list$.next(res.data);
        console.log("parking_data_list: ", this.parking_data_list$.value);
        resolve(true);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getAllCarData(field_list?): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        data_type: "car_data",
      }
      if (field_list){
        send_data['field_list'] = field_list;
      }
      if (this.auth.adminData.value != null && this.auth.adminData.value.type == 'owner'){
        send_data['id_list'] = this.auth.adminData.value.owner_car_id_list;
      }
      this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data).then(res => {
        this.car_data_list$.next(res.data);
        console.log("car_data_list: ", this.car_data_list$.value);
        resolve(true);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getAllUserData(field_list?): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        data_type: "user_data",
        field_list: field_list ? field_list : ["id","phone", "email", "username", "zh_full_name", "en_full_name", "notification_id"]
      }
      this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data).then(res => {
        this.user_data_list$.next(res.data);
        console.log("user_data_list: ", this.user_data_list$.value);
        resolve(true);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getAllFactoryData(): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        data_type: "factory_data"
      }
      this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data).then(res => {
        this.factory_data_list$.next(res.data);
        console.log("factory_data_list: ", this.factory_data_list$.value);
        resolve(true);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }


  getAllRentableCarData(booking_start_date?: string, booking_end_date?: string, field_list?): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(this.selected_user_data$.value);
      let send_data = {
      }
      if (booking_start_date) send_data['start_date'] = booking_start_date;
      if (booking_end_date) send_data['end_date'] = booking_end_date;
      if (this.selected_user_data$.value) send_data['user_id'] = this.selected_user_data$.value.id;
      if (field_list) send_data['field_list'] = field_list;
      console.log(send_data);
      this.apiService.postFromServer(ApiPath.get_all_rentable_car_data, send_data).then(async (res: Response) => {
        if (res.result == 'success'){
          let car_data_list: CarData[] = res.data;
  
          this.rentable_car_data_list$.next(car_data_list);

          //REMARK filter car by parking location
          if (this.selected_parking_id$.value != null) {
            this.display_rentable_car_data_list$.next(car_data_list.filter((d: CarData) => d.last_return_parking_id == this.selected_parking_id$.value));
          }
          else {
            this.display_rentable_car_data_list$.next(car_data_list);
          }
          console.log("rentable_car_data_list: ", this.rentable_car_data_list$.value);
          resolve(true);
        }

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });

  }

  getAllAdminData(): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        data_type: "admin_data",
        disabled: false
      }
      this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {
        console.log("all_admin_data_list: ", res.data);
        if (res.result == 'success') {
          this.all_admin_data_list$.next(res.data);
          resolve(res);
        }
        else {
          resolve(null);
        }

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getUsableCouponDataList(booking_days: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        user_id: this.selected_user_data$.value.id,
        car_id: this.selected_car_data$.value.id,
        booking_days: booking_days
      }
      this.apiService.postFromServer(ApiPath.get_all_usable_coupon_data_by_user_id_and_car_id, send_data, true).then((res: Response) => {
        console.log("usable_coupon_data_list: ", res.data);
        if (res.result == 'success') {
          this.usable_coupon_data_list$.next(res.data);
          resolve(res);
        }
        else {
          resolve(null);
        }

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getUnavailableBookingDateListByCarIdAndUserId(user_id?, car_id?): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        user_id: !user_id && this.selected_user_data$.value ? this.selected_user_data$.value.id : (user_id || null),
        car_id: !car_id && this.selected_car_data$.value ? this.selected_car_data$.value.id : (car_id || null)
      }
      console.log(send_data);
      this.apiService.postFromServer(ApiPath.get_unavailable_booking_date_list_by_car_id_and_user_id, send_data).then(res => {
        this.unavailable_booking_date_list$.next(res.data);
        console.log("unavailable_booking_date_list: ", this.unavailable_booking_date_list$.value);
        resolve(true);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });

  }

  getAvailableCampaignByUserIdAndCarid(): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        user_id: this.selected_user_data$.value.id,
        car_id: this.selected_car_data$.value.id
      }
      this.apiService.postFromServer(ApiPath.get_available_campaign_by_user_id_and_car_id, send_data).then(res => {
        this.available_campaign_data$.next(res.data);
        console.log("available_campaign_data: ", this.available_campaign_data$.value);
        resolve(true);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getRentableParkingDataList(): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        car_id: this.selected_car_data$.value.id
      }
      this.apiService.postFromServer(ApiPath.get_rentable_parking_data_list_by_car_id, send_data).then(res => {
        this.rentable_parking_data_list$.next(res.data);
        console.log("rentable_parking_data_list: ", this.rentable_parking_data_list$.value);
        resolve(true);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getAvailableEquipmentDataList(booking_date_list: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        car_id: this.selected_car_data$.value.id,
        booking_date_list: booking_date_list || []
      }
      if (booking_date_list.length < 30) {
        this.available_equipment_data_list$.next(null);
        resolve(true);
      }
      else{
        this.apiService.postFromServer(ApiPath.get_available_equipment_by_booking_date_list_and_car_id_group_by_category, send_data).then(res => {
          console.log("available_equipment_data_list: ", this.available_equipment_data_list$.value);
          this.available_equipment_data_list$.next(res.data);

          resolve(true);
        }).catch(err => {
          console.error(err);
          reject(err);
        })
      }

    });
  }

  getAvailableProductDataList(booking_days: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        car_id: this.selected_car_data$.value.id,
        booking_days: booking_days
      }
      this.apiService.postFromServer(ApiPath.get_available_product_data_list_by_car_id_and_booking_days, send_data).then(res => {
        this.available_product_data_list$.next(res.data);
        console.log("available_product_data_list: ", this.available_product_data_list$.value);
        resolve(true);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });

  }

  async getPickUpAndReturnHourList(car_id: number, start_date: string, end_date: string): Promise<any> {
    let send_data = {
      car_id: car_id,
      start_date: start_date,
      end_date: end_date
    }
    return new Promise(async (resolve, reject) => {
      const res = await this.apiService.postFromServer(ApiPath.get_return_data_and_pick_up_data_limit_by_car_id_and_start_date_and_end_date, send_data);
      if (res.result == 'success') {
        console.log("get_return_data_and_pick_up_data_limit_by_car_id_and_start_date_and_end_date: ", res.data);
        console.log("get_return_data_and_pick_up_data_limit_by_car_id_and_start_date_and_end_date: ", res.data.return_datetime, res.data.pick_up_datetime);
        let return_datetime = res.data.return_datetime;
        let pick_up_datetime = res.data.pick_up_datetime;

        let return_hour_of_previous_order = null;
        let return_date_of_previous_order = null;
        let pickup_hour_of_next_order = null;
        let pickup_date_of_next_order = null;
        if (return_datetime != null && return_datetime != '') {
          return_date_of_previous_order = return_datetime.split('T')[0];
          return_hour_of_previous_order = parseInt(return_datetime.split('T')[1].split(':')[0]);
          console.log(return_date_of_previous_order);
          console.log(return_hour_of_previous_order);
        }
        if (pick_up_datetime != null && pick_up_datetime != '') {
          pickup_date_of_next_order = pick_up_datetime.split('T')[0];
          pickup_hour_of_next_order = parseInt(pick_up_datetime.split('T')[1].split(':')[0]);
          // pickup_hour_of_next_order = parseInt(pick_up_data.time.split(':')[0]);
          console.log(pickup_hour_of_next_order);
          console.log(pickup_hour_of_next_order);
        }

        if (this.system_data$.value == null) {
          await this.getSystemData();
        }

        const pickup_and_return_hour_list = this.generateReturnAndPickUpHourList(start_date, return_date_of_previous_order, return_hour_of_previous_order, end_date, pickup_date_of_next_order, pickup_hour_of_next_order);

        resolve(pickup_and_return_hour_list);
      }
      else {
        this.commonService.openErrorSnackBar();
        reject(res);
      }
    });

  }

  private generateReturnAndPickUpHourList(start_date: string, return_date_of_previous_order: string, return_hour_of_previous_order: number, end_date: string, pickup_date_of_next_order: string, pickup_hour_of_next_order: number) {
    const minimun_hour_interval_between_pickup_return = this.selected_car_data$.value.minimun_hour_interval_between_pickup_return != null ? this.selected_car_data$.value.minimun_hour_interval_between_pickup_return : (this.system_data$.value.minimun_hour_interval_between_pickup_return || 0);
    const starting_hour_to_allow_pickup = this.selected_car_data$.value.starting_hour_to_allow_pickup != null ? this.selected_car_data$.value.starting_hour_to_allow_pickup : this.system_data$.value.starting_hour_to_allow_pickup;
    const ending_hour_to_allow_return = this.selected_car_data$.value.ending_hour_to_allow_return != null ? this.selected_car_data$.value.ending_hour_to_allow_return : this.system_data$.value.ending_hour_to_allow_return;
    let pickup_hour_list = [];

    // console.log("start_date: ", start_date);
    // let init_pickup_hour = (return_hour_of_previous_order != null ? (return_hour_of_previous_order + minimun_hour_interval_between_pickup_return) : starting_hour_to_allow_pickup);
    let init_pickup_hour = null;
    if (return_date_of_previous_order != null){
      if (new Date(return_date_of_previous_order) < new Date(start_date)){
        init_pickup_hour = (return_hour_of_previous_order + minimun_hour_interval_between_pickup_return) >= 24 ? (return_hour_of_previous_order + minimun_hour_interval_between_pickup_return - 24) : starting_hour_to_allow_pickup;
      }else{
        init_pickup_hour = Math.max((return_hour_of_previous_order + minimun_hour_interval_between_pickup_return), starting_hour_to_allow_pickup);
      }
    }
    else{
      init_pickup_hour = starting_hour_to_allow_pickup;
    }
    // console.log("init_pickup_hour: ", init_pickup_hour);
    for (let index = init_pickup_hour; index <= ending_hour_to_allow_return; index++) {
      pickup_hour_list.push(index);
    }

    let return_hour_list = [];
    let final_ending_hour_to_allow_return = null;
    // console.log("pickup_date_of_next_order: ", end_date);
    // console.log("end_date: ", end_date);
    // console.log("ending_hour_to_allow_return: ", ending_hour_to_allow_return);
    if (pickup_date_of_next_order != null){
      if (new Date(pickup_date_of_next_order) > new Date(end_date)){
        final_ending_hour_to_allow_return = (pickup_hour_of_next_order - minimun_hour_interval_between_pickup_return) < 0 ? (pickup_hour_of_next_order - minimun_hour_interval_between_pickup_return + 24) : ending_hour_to_allow_return;
      }else{
        final_ending_hour_to_allow_return = Math.min((pickup_hour_of_next_order - minimun_hour_interval_between_pickup_return), ending_hour_to_allow_return);
      }
    }
    else{
      final_ending_hour_to_allow_return = ending_hour_to_allow_return;
    }

    for (let index = starting_hour_to_allow_pickup; index <= final_ending_hour_to_allow_return; index++) {
      return_hour_list.push(index);
    }
    return { pickup_hour_list: pickup_hour_list, return_hour_list: return_hour_list };
  }


  getCarParkingDataForPickUp(car_data: CarData, date): Promise<ParkingData> {
    return new Promise(async (resolve, reject) => {
      let parking_data: ParkingData = null;
      console.log(car_data);
      if (car_data.applicable_pickup_parking_id_list.length > 0) {
        let pd: ParkingData = this.parking_data_list$.value.find(d => d.id == car_data.applicable_pickup_parking_id_list[0]);
        console.log(pd);
        parking_data = pd ? pd : null;
      }
      if (parking_data == null) {
        const get_most_recent_order_drop_off_parking_data: Response = await this.getMostRecentPreviousOrderDropOffParkingDataByCarIdList([car_data.id], date);
        if (get_most_recent_order_drop_off_parking_data.result == 'success') {
          console.log(get_most_recent_order_drop_off_parking_data);
          if (get_most_recent_order_drop_off_parking_data.data != null && get_most_recent_order_drop_off_parking_data.data.find(d => d.car_id == car_data.id) != null) {
            car_data.last_return_parking_id = get_most_recent_order_drop_off_parking_data.data.find(d => d.car_id == car_data.id).parking_id;
          }
        }
        if (car_data.last_return_parking_id == null) {
          parking_data = this.parking_data_list$.value.filter((p: ParkingData) => p.is_car_rental_point)[0];
        }
        else {
          if (this.parking_data_list$.value != null && this.parking_data_list$.value.findIndex(d => d.id == car_data.last_return_parking_id) != -1) {
            parking_data = this.parking_data_list$.value.find(d => d.id == car_data.last_return_parking_id);
          }
        }
      }
      resolve(parking_data);
    })
  }

  getMostRecentPreviousOrderDropOffParkingDataByCarIdList(car_id_list: number[], date: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        car_id_list: car_id_list,
        date: date
      }
      this.apiService.postFromServer(ApiPath.get_most_recent_previous_order_drop_off_parking_data_by_car_id_list_and_date, send_data, true).then(res => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }


  applyCouponToPayment(discount_type: 'coupon' | 'deposit_discount' | 'reset', payment_data: PaymentData, coupon_code?): Promise<PaymentData> {
    return new Promise((resolve, reject) => {
      if (payment_data.joined_campaign) {
        this.commonService.openErrorSnackBar("優惠券不能與推廣活動同時使用");
        reject(null);
      }
      if (discount_type == 'coupon' && !coupon_code) {
        this.commonService.openErrorSnackBar("必須輸入優惠碼");
        reject(null);
      }
      let send_data = {
        discount_type: discount_type,
        payment_data: payment_data
      }
      if (discount_type == 'coupon') {
        send_data['coupon_code'] = coupon_code
      }
      this.apiService.postFromServer(ApiPath.apply_discount_to_payment, send_data, true).then((res: Response) => {
        console.log(res);
        this.commonService.isLoading = false;
        if (res.result == "success") {
          resolve(res.data)
        }
        else {
          // this.removeCoupon();
          switch (res.data) {

            case "coupon cannot be used with campaign":
              this.commonService.openErrorSnackBar("優惠券不能與推廣活動同時使用");
              break;
            case "coupon not found":
              this.commonService.openErrorSnackBar("優惠碼不正確");
              break;
            case "coupon used":
              this.commonService.openErrorSnackBar("優惠碼已使用");
              break;
            case "coupon not started":
              this.commonService.openErrorSnackBar("優惠碼未能使用");
              break;
            case "coupon expired":
              this.commonService.openErrorSnackBar("優惠碼已過期");
              break;
            case "not valid user":
              this.commonService.openErrorSnackBar("優惠碼不能使用");
              break;
            case "not valid car":
              this.commonService.openErrorSnackBar("優惠碼不能使用");
              break;
            case "payment not usable":
              this.commonService.openErrorSnackBar("優惠碼未能使用");
              break;
            case "invalid minimum booking days":
              this.commonService.openErrorSnackBar("優惠碼未能使用");
              break;
            case "invalid maximum booking days":
              this.commonService.openErrorSnackBar("優惠碼未能使用");
              break;
            case "not first order":
              this.commonService.openErrorSnackBar("優惠碼不能使用");
              break;
            case "invalid deposit amount":
              this.commonService.openErrorSnackBar("按金優惠不能使用");
              break;
            case "discount not allowed":
              this.commonService.openErrorSnackBar("不可使用折扣優惠");
              break;


            default:
              this.commonService.openErrorSnackBar("出現錯誤");
              break;
          }
          reject(null);
        }
      });
    });

  }


  calculatePaymentDataAmount(payment_data: PaymentData): Promise<PaymentData> {
    return new Promise((resolve, reject) => {
      let send_data = payment_data;
      this.apiService.postFromServer(ApiPath.calculate_payment_data_amount, send_data, true).then((res: Response) => {
        console.log("calculate_payment_data_amount: ", res.data);
        if (res.result == 'success') {
          resolve(res.data);
        }
        else {
          this.commonService.openErrorSnackBar("帳單計算錯誤");
          resolve(null);
        }

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getAwaitingApplicationDepositAmountAndCreateDateByUserId(user_id?): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        user_id: user_id != undefined ? user_id : this.selected_user_data$.value.id
      }
      this.apiService.postFromServer(ApiPath.get_awaiting_application_deposit_amount_and_create_date_by_user_id, send_data, true).then((res: Response) => {
        console.log("awaiting_application_deposit_amount: ", res.data);
        if (res.result == 'success') {
          this.awaiting_application_deposit_amount$.next(res.data.amount);
          this.awaiting_application_deposit_create_date$.next(res.data.create_date);
          resolve(res);
        }
        else {
          resolve(null);
        }

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  makeOrder(order_data: OrderData, payment_data_list: PaymentData[]): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        order_data: order_data,
        payment_data_list: payment_data_list
      }
      console.log("make order send data: ", send_data);
      this.apiService.postFromServer(ApiPath.make_order, send_data, true).then((res: Response) => {
        console.log(res);
        if (res.result == "success") {
          resolve(res)
        }
        else {
          // this.removeCoupon();
          switch (true) {
            case (res.data == 'car is disabled' || res.data == 'invalid car'):
              this.commonService.openErrorSnackBar('此汽車暫不可租用！');
              break;
            case (res.data == 'booking date not available'):
              this.commonService.openErrorSnackBar('預約日期已滿，請重新選擇！');
              break;
            case (res.data == 'parking is disabled' || res.data == 'parking is not rentable'):
              this.commonService.openErrorSnackBar('停車場暫不可租用！');
              break;
            case (res.data == 'equipment is disabled' || res.data == 'equipment not available'):
              this.commonService.openErrorSnackBar('有些設備暫不可租用，請重新選擇！');
              break;
            case (res.data == 'product not available'):
              this.commonService.openErrorSnackBar('有些加購品已缺貨，請重新選擇！');
              break;
            case (res.data.includes('amount not match')):
              this.commonService.openErrorSnackBar('預約逾時！');
              break;


            default:
              this.commonService.openErrorSnackBar('預約失敗！');
              // setTimeout(() => {
              //   this.navigationService.navigate('back', 'car-list', { queryParams: { type: 'all' } });
              // }, 3000);
              break;
          }
          reject(null);
        }
      });
    });
  }


  makeExtendOrder(order_id: number, extend_days: number): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        order_id: order_id,
        extend_days: extend_days
      }
      console.log("make extend order send data: ", send_data);
      this.apiService.postFromServer(ApiPath.make_extend_order, send_data, true).then((res: Response) => {
        console.log(res);
        if (res.result == "success") {
          this.commonService.openSnackBar('續約完成，請於到期日前繳付帳單');
          resolve(res)
        }
        else {
          switch (true) {
            case (res.data == 'booking date not available'):
              this.commonService.openErrorSnackBar('續約失敗，相關時期已被租用！');
              break;
            case (res.data == 'order cannot be extended'):
              this.commonService.openErrorSnackBar('續約失敗，此訂單不可續約！');
              break;

            default:
              this.commonService.openErrorSnackBar('續約失敗，如有需要請聯絡我們！');
              break;
          }
          reject(null);
        }
      });
    });
  }


  getTempOrderDataByUserId(): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        user_id: this.selected_user_data$.value.id,
      }
      this.apiService.postFromServer(ApiPath.get_temp_order_data_by_user_id, send_data).then(res => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });

  }

  updateTempOrder(temp_order_data): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.update_temp_order, temp_order_data, true).then(res => {
        console.log("update_temp_order_data: ", res.data);
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  updateCarData(car_data): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.update_car, car_data, false).then(res => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  newVehicleRentalAgreement(vehicle_rental_agreement: VehicleRentalAgreement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.new_vehicle_rental_agreement, vehicle_rental_agreement, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  updateVehicleRentalAgreement(vehicle_rental_agreement: VehicleRentalAgreement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.update_vehicle_rental_agreement, vehicle_rental_agreement, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  updateReturnVehicleReport(return_vehicle_report: ReturnVehicleReport): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.update_return_vehicle_report, return_vehicle_report, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getVehicleRentalAgreementByOrderId(order_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        order_id: order_id
      }
      this.apiService.postFromServer(ApiPath.get_vehicle_rental_agreement_by_order_id, send_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getReturnVehicleReportByOrderId(order_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        order_id: order_id
      }
      this.apiService.postFromServer(ApiPath.get_return_vehicle_report_by_order_id, send_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getOrderDataWithAllOtherDataByOrderId(order_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        order_id: order_id
      }
      this.apiService.postFromServer(ApiPath.get_order_data_with_all_other_data_by_order_id, send_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }


  generateVehicleRentalAgreementPdfByVraData(vehicle_rental_agreement_data: VehicleRentalAgreement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.generate_vehicle_rental_agreement_pdf_by_vra_data, vehicle_rental_agreement_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  generateReturnVehicleReportPdfByRvrData(return_vehicle_report_data: ReturnVehicleReport): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.generate_return_vehicle_report_pdf_by_rvr_data, return_vehicle_report_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  addCarDamageToCarByCarId(car_id: number, car_damage: CarDamage): Promise<any> {
    let send_data = {
      car_id: car_id,
      car_damage: car_damage
    }
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.add_car_damage_to_car_by_car_id, send_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }


  applyReturnDepositByUserId(send_data): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.apply_return_deposit_by_user_id, send_data, true).then((res: Response) => {
        console.log(res);
        if (res.result == "success") {
          this.commonService.openSnackBar("成功申請退還按金");
        }
        else {
          if (Array.isArray(res.data)){
            let data = res.data[0];
            if(data.data_type == DATA_TYPE.ORDER_DATA){
                if (data.status != OrderStatus.completed && data.status != OrderStatus.cancelled){
                  this.commonService.openErrorSnackBar("無法退還按金，您尚有有效訂單進行中！");
                }
                else{
                  this.commonService.openErrorSnackBar(`無法退還按金，請於上一張訂單完結日(${data.end_date})30日後退還！`);
                }
            }
            else if(data.data_type == DATA_TYPE.VIOLATION_DATA){
              this.commonService.openErrorSnackBar("無法退還按金，尚有違例告票未處理完成！");
            }
            else if(data.data_type == DATA_TYPE.COMPENSATION_PAYMENT_DATA){
              this.commonService.openErrorSnackBar("無法退還按金，尚有車輛賠償未處理完成！");
            }
            else{
              this.commonService.openErrorSnackBar("無法退還按金，如有需要請聯絡我們！");
            }
          }
          else{
            if (res.data == 'no deposit to apply'){
              this.commonService.openErrorSnackBar("沒有按金可以退還！");
            }
            else if (res.data.hasOwnProperty('code') && res.data.code == 'validation_failed') {
              this.commonService.openErrorSnackBar("未能申請退按金，請重新檢查銀行代碼／銀行賬號，如有需要請聯絡我們！");
            }
            else if (res.data == 'invalid refund amount'){
              this.commonService.openErrorSnackBar("申請金額高於總按金數！");
            }
            else{
              this.commonService.openErrorSnackBar("無法退還按金，如有需要請聯絡我們！");
            }
          }

        }
        resolve(res);
      });
    });

  }

  getNumberOfAppointmentDataByFactoryIdAndAppointmentDate(factory_id: number, date: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        factory_id: factory_id,
        date: date
      }
      this.apiService.postFromServer(ApiPath.get_number_of_acceted_appointment_data_by_factory_id_and_appointment_date, send_data, true).then(res => {
        resolve(res);

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getUnpaidChargeDataRanking(): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        limit: 20
      }
      this.apiService.postFromServer(ApiPath.get_unpaid_charge_data_ranking, send_data, true).then(res => {
        resolve(res);

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getUnpaidViolationDataRanking(): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        limit: 10
      }
      this.apiService.postFromServer(ApiPath.get_unpaid_violation_data_ranking, send_data, true).then(res => {
        resolve(res);

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getVacantCarDataListForComingNDaysForCms(): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
      }
      this.apiService.postFromServer(ApiPath.get_vacant_car_data_list_for_coming_n_days_for_cms, send_data, true).then(res => {
        resolve(res);

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getAllRenderingOrderData(): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        field_list: ["reference_number", "start_date", "end_date", "user_id", "car_id"]
      }
  
      this.apiService.postFromServer(ApiPath.get_all_rendering_order_data_excluding_disabled, send_data, true).then((res: Response) => {

        resolve(res);

      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  updatePaymentHandler(payment_data): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.update_payment_handler, payment_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  secondDriverValidation(phone, second_driver_phone): Promise<any> {
    return new Promise((resolve, reject) => {
      let send_data = {
        phone: phone,
        second_driver_phone: second_driver_phone
      }

      this.apiService.postFromServer(ApiPath.second_driver_validation, send_data, true).then((res: Response) => {
        console.log(res);
        if (res.result == "success") {
          resolve(res)
        }
        else {
          switch (res.data) {
            case "invalid phone number":
              this.commonService.openSnackBar("電話號碼不正確");
              break;
            case "phone not registered":
              this.commonService.openSnackBar("電話號碼尚未註冊");
              break;
            case "missing identity card":
              this.commonService.openSnackBar("副駕駛人尚未完成身份證認證");
              break;
            case "missing driving license":
              this.commonService.openSnackBar("副駕駛人尚未完成駕駛執照認證");
              break;
            case "missing address proof":
              this.commonService.openSnackBar("副駕駛人尚未上載住址證明");
              break;
            default:
              break;
          }
        }
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }


  payChargeData(charge_data_list: ChargeData[], bank_transfer_img_url: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      let send_data = {
        "charge_data_list": charge_data_list,
        'bank_transfer_img_url': bank_transfer_img_url
      }
      console.log("pay: ", (send_data));
      // console.log("pay: ", JSON.stringify(send_data));
      this.apiService.postFromServer(ApiPath.pay_charge_data, send_data, true).then((res: Response) => {
        console.log(res);
        if (res.result == "success") {
          resolve(res);
        }
        else {
          switch (true) {
            case res.data == "not valid user":
              this.commonService.openSnackBar("優惠碼不能使用");
              break;
            case res.data == "not valid car":
              this.commonService.openSnackBar("優惠碼不能使用");
              break;
            case res.data == "payment not usable":
              this.commonService.openSnackBar("優惠碼未能使用");
              break;
            case res.data == 'invalid payment':
              this.commonService.openSnackBar('此賬單已經付款');
              break;
            case res.data == 'invalid payment method':
              this.commonService.openSnackBar('付款失敗');
              break;
            case res.data == 'missing payment intent':
              this.commonService.openSnackBar('付款失敗');
              break;
            case res.data == 'payment intent not found':
              this.commonService.openSnackBar('付款失敗');
              break;
            case res.data == 'missing bank transfer information':
              this.commonService.openSnackBar('付款失敗');
              break;
            case res.data == 'calculate total amount fail':
              this.commonService.openSnackBar('付款失敗');
              break;
            case res.data == 'total amount not match':
              this.commonService.openSnackBar('賬單已更新，請重新檢查');
              break;
            case res.data == 'not allow to pay by credit card':
              this.commonService.openSnackBar('不能以信用卡付款');
              break;
            case res.data == 'credit card payment fail':
              this.commonService.openSnackBar('付款失敗');
              break;

            default:
              break;
          }
          resolve(res);
        }
      });
    });

  }

  //Type=1 real-time video, Type=2 Historical video
  //Voice 0 is disable; 1 is enable
  getJimiDeviceStreamingLive(car_id: number, type: 0 | 1, voice: 0 | 1): Promise<Response> {
    let send_data = {
      car_id: car_id,
      type: type,
      voice: voice
    }
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.get_jimi_device_streaming_live, send_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getJimiDeviceLiveMap(car_id: number): Promise<Response> {
    let send_data = {
      car_id: car_id
    }
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.get_jimi_device_live_map, send_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getJimiDeviceLocation(car_id: number): Promise<Response> {
    let send_data = {
      car_id_list: [car_id]
    }
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.get_jimi_device_location, send_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  getJimiUserDeviceLocationList(): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.get_jimi_user_device_location_list, null, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  lockUnlockObdByDeviceId(obd_device_id: string, action: 'lock' | 'unlock'): Promise<Response> {
    let send_data = {
      obd_device_id: obd_device_id,
      action: action
    }
    return new Promise((resolve, reject) => {
      this.apiService.postFromServer(ApiPath.lock_unlock_obd_by_device_id, send_data, true).then((res: Response) => {
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

}
