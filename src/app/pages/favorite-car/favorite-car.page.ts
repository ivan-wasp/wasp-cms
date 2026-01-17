import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { CarData, UserData } from 'src/app/schema';
import { CalendarComponent } from 'ionic2-calendar';


@Component({
  selector: 'app-favorite-car',
  templateUrl: './favorite-car.page.html',
  styleUrls: ['./favorite-car.page.scss'],
})
export class FavoriteCarPage implements OnInit {

  is_only_this_car: Boolean = true;
  create_date: string = null;
  start_date: string = null;
  end_date: string = null;

  type: 'string';
  dateRange: { from: string; to: string; } = { from: '', to: '' };
  DaysConfig: DayConfig[] = [];
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
    monthFormat: 'YYYY 年 MM 月 ',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    daysConfig: this.DaysConfig,
    color: "secondary",
  };

  car_id = null;
  car_data = null;
  rentable_car_data_list$: Observable<CarData[]> = this.dataService.rentable_car_data_list$.pipe();

  favorited_user_data_list: UserData[] = null;

  stepHour = 1;
  stepMinute = 1;
  enableMeridian = false;
  showSeconds = false;

  @ViewChild('calendar') calendar: CalendarComponent;
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
        if (params && params.car_id) {
          this.car_id = parseInt(params.car_id);
        }
      }
    });
  }

  async ngOnInit() {
    if (this.dataService.rentable_car_data_list$.value == null) {
      await this.dataService.getAllRentableCarData(null, null, ['id', 'data_type', 'disabled', 'sold', 'brand', 'model', 'plate', 'car_cover_img_url', 'applicable_pickup_parking_id_list', 'applicable_return_parking_id_list', 'keyless_type']);
    }
    if (this.car_id != null) {
      this.car_data = this.dataService.rentable_car_data_list$.value.filter(d => d.id == this.car_id)[0];
      this.getAllFavoritedUser();
      this.getUnavailableBookingDateList();
    }
  }


  async getUnavailableBookingDateList() {
    this.DaysConfig = [];
    const newOptions = {
      daysConfig: this.DaysConfig
    };
    this.optionsRange = {
      ...this.optionsRange,
      ...newOptions
    };
    const get_unavailable_booking_date_list = await this.dataService.getUnavailableBookingDateListByCarIdAndUserId(null, this.car_id);
    this.disableUnavailableBookingDateOnCalendar();
  }

  getAllFavoritedUser() {
    let send_data = {
      model: this.car_data.model,
    }
    if (this.is_only_this_car) {
      send_data['car_id'] = this.car_data.id
    }
    if (this.create_date && this.create_date != '') {
      send_data['create_date'] = this.create_date
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_all_favorited_user_by_car_model, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.favorited_user_data_list = res.data;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  carChange(ev) {
    console.log(ev);
    if (ev.value != null) {
      let new_path = `/favorite-car?car_id=${this.car_data.id}`;
      this.car_id = this.car_data.id;
      if (this.location.path() != new_path) {
        this.location.replaceState(new_path);
      }
      this.getAllFavoritedUser();
      this.getUnavailableBookingDateList();

    }
    else {
      this.favorited_user_data_list = null;
    }
  }

  async onDateChange($event) {
    console.log($event);

    this.start_date = this.commonService.ToBackendDateTimeString(new Date(this.dateRange.from)).split('T')[0];
    this.end_date = this.commonService.ToBackendDateTimeString(new Date(this.dateRange.to)).split('T')[0];

    const generate_booking_date_list = await this.commonService.generateAllDateBetweenTwoDate(this.start_date, this.end_date);

    if ((this.dataService.unavailable_booking_date_list$.value.user_booked_date_list && generate_booking_date_list.filter((d: string) => this.dataService.unavailable_booking_date_list$.value.user_booked_date_list.includes(d)).length > 0) || generate_booking_date_list.filter((d: string) => this.dataService.unavailable_booking_date_list$.value.car_booked_date_list.includes(d)).length > 0 || generate_booking_date_list.filter((d: string) => this.dataService.unavailable_booking_date_list$.value.car_blocked_date_list.includes(d)).length > 0) {
      this.dateRange = null;
      this.start_date = null;
      this.end_date = null;
      return this.commonService.openErrorSnackBar('無法租用此時段');
    }

  }



  async disableUnavailableBookingDateOnCalendar() {

    if (this.dataService.unavailable_booking_date_list$.value != null) {
      if (this.dataService.unavailable_booking_date_list$.value.hasOwnProperty('user_booked_date_list')) {
        this.dataService.unavailable_booking_date_list$.value.user_booked_date_list.forEach(date => {
          this.DaysConfig.push({
            date: new Date(date),
            disable: true,
            title: '已被租用',
            // subTitle: '你已租車',
            // cssClass: 'calendar-user-self-booked-date'
          });
        });
      }
      if (this.dataService.unavailable_booking_date_list$.value.hasOwnProperty('car_booked_date_list')) {
        this.dataService.unavailable_booking_date_list$.value.car_booked_date_list.forEach(date => {
          this.DaysConfig.push({
            date: new Date(date),
            disable: true,
            title: '已被租用',
            // subTitle: '你已租車',
            // cssClass: 'calendar-user-self-booked-date'
          });
        });
      }
      if (this.dataService.unavailable_booking_date_list$.value.hasOwnProperty('car_blocked_date_list')) {
        this.dataService.unavailable_booking_date_list$.value.car_blocked_date_list.forEach(date => {
          this.DaysConfig.push({
            date: new Date(date),
            disable: true,
            title: '已被禁租',
            // subTitle: '你已租車',
            // cssClass: 'calendar-user-self-booked-date'
          });
        });
      }
      setTimeout(() => {
        const newOptions = {
          daysConfig: this.DaysConfig
        };
        this.optionsRange = {
          ...this.optionsRange,
          ...newOptions
        };
      }, 500)
      // setTimeout(() => {
      //   // this.optionsRange.daysConfig = this.DaysConfig;
      //   // this.calendar['options'] = this.optionsRange.daysConfig;
      // }, 500);
    }

  }

  sendFavoriteReminder() {
    let send_data = {
      car_data: this.car_data,
      user_id_list: this.favorited_user_data_list.map(d => d.id),
      start_date: this.start_date,
      end_date: this.end_date,
    }

    this.apiService.postFromServer(ApiPath.send_favorite_reminder, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.commonService.openSnackBar("傳送通知");
      } else {
        switch (true) {

          default:
            this.commonService.openErrorSnackBar("未能傳送通知");
            break;
        }

      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  toggleChange($event) {
    // console.log($event);
    // console.log(this.is_model_only);
    this.getAllFavoritedUser();
  }

  createDateChange(e) {
    this.create_date = this.commonService.GetDateTimeMatchBackendFormat(new Date(e.value));
    this.getAllFavoritedUser();
  }
}
