import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { debounceTime, delay, distinctUntilChanged, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { AdminData, AdminType, Authority, CarData, ParkingData, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
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
export class OrderPage implements OnInit {

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  status = null;
  create_date_start = null;
  create_date_end = null;
  booking_date_start = null;
  booking_date_end = null;
  user_id = null;
  car_id = null;
  parking_id = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();;
  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_parking_data_list$: Observable<ParkingData[]> = this.dataService.parking_data_list$.pipe(
    map((p: ParkingData[]) => {
      return p == null ? null : p.filter(d => d.rentable == true)
    })
  );

  @ViewChild('ionSelectable') ionSelectable: IonicSelectableComponent;
  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }
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
      this.direction = (params && params.direction && params.direction == null ? (params.direction) : "DESC");

      this.status = (params && params.status ? (params.status) : "");
      this.create_date_start = (params && params.create_date_start ? (params.create_date_start) : "");
      this.create_date_end = (params && params.create_date_end ? (params.create_date_end) : "");
      this.booking_date_start = (params && params.booking_date_start ? (params.booking_date_start) : "");
      this.booking_date_end = (params && params.booking_date_end ? (params.booking_date_end) : "");
      this.user_id = (params && params.user_id ? (params.user_id) : "");
      this.car_id = (params && params.car_id ? (params.car_id) : "");
      this.parking_id = (params && params.parking_id ? (params.parking_id) : "");
    });
  }


  async ngOnInit() {
    if (this.dataService.table_data_list != null) {
      this.sorting = null;
      this.direction = null;
      this.page = 1;
    }
    if (this.auth.adminData.value == null) {
      console.log("waiting for admin data");
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(1000);
    }
    this.getOrderDataList();

    // this.getAllUserData();
    if (this.dataService.car_data_list$.value == null) {
      this.dataService.getAllCarData(["id", "data_type", "disabled", "plate", "brand", "model", "car_cover_img_url"]);
    }
    if (this.dataService.user_data_list$.value == null && this.auth.adminData.value.type != AdminType.owner) {
      this.dataService.getAllUserData();
    }
    if (this.dataService.parking_data_list$.value == null) {
      this.dataService.getAllParkingData();
    }
  }

  async getOrderDataList(export_to_excel?: boolean) {
    if (!export_to_excel) {
      this.dataService.resetTableData();
    }

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      get_deposit: true,
      get_order: true,
      status: this.status,
      create_date_start: this.create_date_start,
      create_date_end: this.create_date_end,
      booking_date_start: this.booking_date_start,
      booking_date_end: this.booking_date_end,
      user_id: this.user_id,
      car_id: this.car_id,
      parking_id: this.parking_id,
      export_to_excel: export_to_excel ?? false
    }
    console.log((send_data));
    // this.commonService.isLoading = true;

    if (this.auth.adminData.value.type == AdminType.owner) {
      send_data['car_id_list'] = this.auth.adminData.value.owner_car_id_list;
    }
    this.apiService.postFromServer(ApiPath.get_order_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      if (send_data.export_to_excel) {
        if (this.dataService.table_data_list == null || this.dataService.table_data_list.length == 0) {
          return this.commonService.openSnackBar("沒有資料");
        }
        else {
          if (res.result == 'success' && res.data != '') {
            return this.commonService.downloadMedia(res.data, true);
          }
          else {
            return this.commonService.openErrorSnackBar();
          }
        }
      }

      let new_path = `/order?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&status=${this.status}&create_date_start=${this.create_date_start || ''}&create_date_end=${this.create_date_end || ''}&booking_date_start=${this.booking_date_start || ''}&booking_date_end=${this.booking_date_end || ''}&user_id=${this.user_id || ''}&car_id=${this.car_id || ''}&parking_id=${this.parking_id || ''}`;
      if (this.location.path() != new_path) {
        this.location.replaceState(new_path);
      }
      // this.commonService.isLoading = false;
      console.log(res.data);
      if (res.result == 'success') {
        this.dataService.table_data_list = res.data.item_list.sort((one, two) => (one.status == 'rendering' && two.status != 'rendering' ? -1 : 1));
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
      this.getOrderDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getOrderDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getOrderDataList();
    }
  }

  selectPage(page) {
    if (this.page == page) {
      return;
    }
    this.page = page;
    this.getOrderDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getOrderDataList();
  }

  goNextPage() {
    this.page++;
    this.getOrderDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getOrderDataList();
  }

  selectionCreateDateChanged(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value != null && dateRangeStart.value != '' && dateRangeEnd.value != null && dateRangeEnd.value != '') {
      this.create_date_start = dateRangeStart.value.substring(0, 10) + "T00:00:00";
      this.create_date_end = dateRangeEnd.value.substring(0, 10) + "T23:59:59";
      this.getOrderDataList();
    }
  }

  selectionBookingDateChanged(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value != null && dateRangeStart.value != '' && dateRangeEnd.value != null && dateRangeEnd.value != '') {
      this.booking_date_start = dateRangeStart.value.substring(0, 10) + "T00:00:00";
      this.booking_date_end = dateRangeEnd.value.substring(0, 10) + "T23:59:59";
      this.getOrderDataList();
    }
  }


  resetCreateDate() {
    this.create_date_start = '';
    this.create_date_end = '';
    this.getOrderDataList();
  }

  resetBookingDate() {
    this.booking_date_start = '';
    this.booking_date_end = '';
    this.getOrderDataList();
  }


  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  onUserChange(event) {
    this.resetAndGetData(null);
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
    this.getOrderDataList();
  }

  onOpen(event: { component: IonicSelectableComponent }) {
    if (this.dataService.user_data_list$.value == null) {
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
