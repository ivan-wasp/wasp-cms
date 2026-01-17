import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { CarData, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-notification',
  templateUrl: './admin-notification.page.html',
  styleUrls: ['./admin-notification.page.scss'],
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
export class AdminNotificationPage implements OnInit {


  sorting = null;
  direction = null;
  limit = null;
  page = null;

  key_word = null;

  searchControl = new UntypedFormControl();

  user_id = null;
  car_id = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();
  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();

  create_date_start = null;
  create_date_end = null;

  @ViewChild('ionSelectable') ionSelectable: IonicSelectableComponent;
  constructor(
    private router: Router,
    public commonService: CommonService,
    public auth: AuthService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    public dataService: DataService
  ) {
    this.dataService.table_data_list = null;

    this.route.queryParams.subscribe(params => {
      this.page = (params && params.page ? parseInt(params.page) : 1);
      this.limit = (params && params.limit ? (params.limit) : 10);
      this.sorting = (params && params.sorting ? (params.sorting) : "create_date");
      this.direction = (params && params.direction && params.direction != null ? (params.direction) : "DESC");
      this.key_word = (params && params.key_word ? (params.key_word) : "");

      this.user_id = (params && params.user_id ? (params.user_id) : "");
      this.car_id = (params && params.car_id ? (params.car_id) : "");
      this.car_id = (params && params.car_id ? (params.car_id) : "");
      this.create_date_start = (params && params.create_date_start ? (params.create_date_start) : "");
      this.create_date_end = (params && params.create_date_end ? (params.create_date_end) : "");
    });
  }



  async ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(term => {
        if (this.dataService.table_data_list != null) {
          this.sorting = null;
          this.direction = null;
          this.page = 1;
        }
        this.key_word = term;
        this.getAdminNotificationDataList();
      });
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
    if (this.dataService.user_data_list$.value == null){
      this.dataService.getAllUserData();
    }
  }

  getAdminNotificationDataList() {
    this.dataService.resetTableData();

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      // filter_vip: '',
      car_id: this.car_id,
      user_id: this.user_id,
      create_date_start: this.create_date_start,
      create_date_end: this.create_date_end
    }
    if (this.key_word != null && this.key_word != '') {
      send_data['key_word'] = this.key_word;
    }
    console.log(JSON.stringify(send_data));
    // this.commonService.isLoading = true;

    this.apiService.postFromServer(ApiPath.get_admin_notification_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      let new_path = `/admin-notification?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&key_word=${this.key_word}&user_id=${this.user_id || ''}&car_id=${this.car_id || ''}&create_date_start=${this.create_date_start}&create_date_end=${this.create_date_end}`;
      if (this.location.path() != new_path) {
        this.location.replaceState(new_path);
      }
      // this.commonService.isLoading = false;
      console.log(res.data);
      if (res.result == 'success') {
        this.dataService.table_data_list = res.data.item_list;
        this.dataService.table_data_total_number = res.data.total_number;
        this.dataService.table_data_number_of_page = Math.ceil(res.data.total_number / this.limit);
      } else {
        this.commonService.openErrorSnackBar();
      }
    });

  }


  switchSorting(sorting) {
    if (this.sorting == sorting && this.direction == 'DESC') {
      this.direction = 'ASC';
      this.page = 1;
      this.getAdminNotificationDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getAdminNotificationDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getAdminNotificationDataList();
    }
  }

  selectPage(page) {
    if (this.page == page) {
      return;
    }
    this.page = page;
    this.getAdminNotificationDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getAdminNotificationDataList();
  }

  goNextPage() {
    this.page++;
    this.getAdminNotificationDataList();
  }


  clearSearch(ev) {
    this.key_word = '';
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getAdminNotificationDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getAdminNotificationDataList();
  }

  selectionDateChanged(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value != null && dateRangeStart.value != '' && dateRangeEnd.value != null && dateRangeEnd.value != '') {
      this.create_date_start = dateRangeStart.value.substring(0, 10) + "T00:00:00";
      this.create_date_end = dateRangeEnd.value.substring(0, 10) + "T23:59:59";
      this.resetAndGetData(null);
    }
  }

  resetCreateDate() {
    this.create_date_start = '';
    this.create_date_end = '';
    this.getAdminNotificationDataList();
  }

  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  onUserChange(event) {
    this.getAdminNotificationDataList();
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  onCarChange(event) {
    this.resetAndGetData(null);
  }

  resetAndGetData(event) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.key_word = "";
    this.getAdminNotificationDataList();
  }

  goPage(admin_notification_data) {
    if (admin_notification_data.read == false) {
      this.UpdateAdminNotification(admin_notification_data);
    }
    else {
      this.directPage(admin_notification_data);
    }

  }

  directPage(admin_notification_data) {
    switch (admin_notification_data.category) {
      // 預約維修／取車還車／先租後買／訂單付款／交通違例／緊急支援／退還按金／文件到期
      case "預約維修":
        this.commonService.openCMSPage('/appointment-detail?appointment_id=' + admin_notification_data.appointment_id, 'root');
        break;
      case "取車還車":
        this.commonService.openCMSPage('/order-detail?order_id=' + admin_notification_data.order_id, 'root');
        break;
      case "先租後買":
        this.commonService.openCMSPage('/rbb-detail?rbb_id=' + admin_notification_data.rbb_id, 'root');
        break;
      case "訂單付款":
        this.commonService.openCMSPage('/order-detail?order_id=' + admin_notification_data.order_id, 'root');
        break;
      case "交通違例":
        this.commonService.openCMSPage('/violation-detail?violation_id=' + admin_notification_data.violation_id, 'root');
        break;
      case "緊急支援":
        this.commonService.openCMSPage('/emergency-detail?emergency_id=' + admin_notification_data.emergency_id, 'root');
        break;
      case "退還按金":
        this.commonService.openCMSPage('/deposit-detail?deposit_id=' + admin_notification_data.deposit_id, 'root');
        break;
      case "文件到期":
        this.commonService.openCMSPage('/car-detail?car_id=' + admin_notification_data.car_id, 'root');
        break;

      default:
        break;
    }
  }

  UpdateAdminNotification(admin_notification_data) {
    let send_data = {
      id: admin_notification_data.id,
      read: true
    }
    this.apiService.postFromServer(ApiPath.update_admin_notification, send_data, true).then((res: Response) => {
      this.commonService.isLoading = false;
      if (res.result == "success") {
        this.directPage(admin_notification_data);
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


  onOpen(event: { component: IonicSelectableComponent }) {
    if (this.dataService.user_data_list$.value == null || this.dataService.user_data_list$.value.length == 0){
      this.dataService.getAllUserData();
    }
  }

  showLoading() {
    this.ionSelectable.showLoading();
  }

  hideLoading() {
    this.ionSelectable.hideLoading();
  }

}
