import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { AdminData, AdminType, Authority, CarData, Engine, KeylessType, ParkingData } from 'src/app/schema';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Observable } from 'rxjs';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CarPage implements OnInit {
  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  // date = new UntypedFormControl(moment());
  sorting = null;
  direction = null;
  limit = null;
  page = null;

  hovered_car_id = null;

  all_brand_list = null;

  keyless_type: KeylessType = null;
  brand = null;
  target_start_day = null;
  target_end_day = null;
  current_location = null;

  status = null;

  original_table_data_list = null;
  system_data = null;

  searchControl = new UntypedFormControl();

  index_mode: boolean = false;
  hybrid_car_data_list: CarData[] = null;
  electric_car_data_list: CarData[] = null;

  all_parking_data_list$: Observable<ParkingData[]> = this.dataService.parking_data_list$.pipe(
    map((p: ParkingData[]) => {
      return p == null ? null : p.filter(d => d.rentable == true)
    })
  );

  public get adminType(): typeof AdminType {
    return AdminType;
  }
  public get keylessType(): typeof KeylessType {
    return KeylessType;
  }
  public get authority(): typeof Authority {
    return Authority;
  }
  constructor(
    private router: Router,
    public commonService: CommonService,
    public auth: AuthService,
    public apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    public dataService: DataService
  ) {
    this.dataService.table_data_list = null;

    this.route.queryParams.subscribe(params => {
      this.page = (params && params.page ? parseInt(params.page) : 1);
      this.limit = (params && params.limit ? (params.limit) : 500);
      this.sorting = (params && params.sorting ? (params.sorting) : "create_date");
      this.direction = (params && params.direction && params.direction != null ? (params.direction) : "DESC");
    });
  }

  ngOnInit() {
    if (this.dataService.table_data_list != null) {
      this.sorting = null;
      this.direction = null;
      this.page = 1;
    }
    setTimeout(() => {
      this.getCarDataList();
      this.getAllCarBrand();
      this.dataService.getSystemData();
      if (this.dataService.parking_data_list$.value == null) {
        let field_list = ['id', 'zh_name', 'en_name', 'zh_address', 'location', 'rentable'];
        this.dataService.getAllParkingData(field_list);
      }
    }, 1000);
  }

  getCarDataList(export_to_excel?: boolean) {
    if (!export_to_excel) {
      this.dataService.resetTableData();
    }

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      // filter_vip: '',
      brand: this.brand,
      keyless_type: this.keyless_type,
      today_status: true,
      target_date_list: this.target_start_day != null ? this.commonService.getDatesInRange(new Date(this.target_start_day), new Date(this.target_end_day)).map(d => d.split('T')[0]) : [],
      get_coming_order: true,
      export_to_excel: export_to_excel ?? false
    }
    if (this.current_location && this.current_location != '') {
      send_data['current_location'] = this.current_location;
    }
    if (this.auth.adminData.value?.type == AdminType.owner) {
      send_data['car_id_list'] = this.auth.adminData.value.owner_car_id_list;
    }
    console.log(JSON.stringify(send_data));
    // this.commonService.isLoading = true;

    this.apiService.postFromServer(ApiPath.get_car_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      console.log(res);
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

      let new_path = `/car?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&brand=${this.brand}&keyless_type=${this.keyless_type}&current_location=${this.current_location}`;
      if (this.location.path() != new_path) {
        this.location.replaceState(new_path);
      }
      // this.commonService.isLoading = false;
      // console.log(JSON.stringify(res.data));
      // console.log(res.data.item_list.map(d => d.coming_order_data_list));
      if (res.result == 'success') {
        // console.log(this.auth.adminData.value);

        switch (this.auth.adminData.value.type) {
          case AdminType.buyer:
            this.dataService.table_data_list = res.data.item_list.filter(d => d.for_sale == true);
            break;
          case AdminType.owner:
            this.dataService.table_data_list = res.data.item_list.filter(d => this.auth.adminData.value.owner_car_id_list.includes(d.id));
            break;

          default:
            this.dataService.table_data_list = res.data.item_list.filter(d => d.sold == false);
            break;
        }

        this.original_table_data_list = JSON.parse(JSON.stringify(res.data.item_list));

        this.dataService.table_data_total_number = res.data.total_number;
        this.dataService.table_data_number_of_page = Math.ceil(res.data.total_number / this.limit);

        if (this.dataService.table_data_list.length > 0) {
          this.getJimiUserDeviceLocationList();
        }
      } else {
        this.commonService.openErrorSnackBar();
      }
    });

  }

  resetFilterDate() {
    this.getCarDataList();
  }


  getAllCarBrand() {
    let send_data = {
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_all_car_brand_list, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.all_brand_list = res.data;

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  switchSorting(sorting) {
    if (this.sorting == sorting && this.direction == 'DESC') {
      this.direction = 'ASC';
      this.page = 1;
      this.getCarDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getCarDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getCarDataList();
    }
  }

  selectPage(page) {
    if (this.page == page) {
      return;
    }
    this.page = page;
    this.getCarDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getCarDataList();
  }

  goNextPage() {
    this.page++;
    this.getCarDataList();
  }

  searchUser() {
    setTimeout(() => {
      this.sorting = null;
      this.direction = null;
      this.page = 1;
      this.getCarDataList();
    }, 300);
  }

  clearSearch(ev) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getCarDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getCarDataList();
  }

  resetAndGetData(event) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getCarDataList();
  }

  filterStatus(today_status) {
    if (today_status == 'all') {
      this.dataService.table_data_list = this.original_table_data_list;
    }
    else if (today_status != 'all') {
      this.dataService.table_data_list = this.original_table_data_list.filter(d => d.today_status == today_status);
    }
  }

  filterJimiDeviceStatus(status?: '0' | '1', accStatus?: '0' | '1', speed?: string) {
    if (!status && !accStatus) {
      this.dataService.table_data_list = this.original_table_data_list;
    }
    else if (speed == undefined) {
      this.dataService.table_data_list = this.original_table_data_list.filter(d => d.jimi_device_location != null && d.jimi_device_location.status == status);
    }
    else {
      if (speed == 'null') {
        this.dataService.table_data_list = this.original_table_data_list.filter(d => d.jimi_device_location != null && d.jimi_device_location.status == status && d.jimi_device_location.accStatus == accStatus && d.jimi_device_location.speed == null);
      }
      else {
        this.dataService.table_data_list = this.original_table_data_list.filter(d => d.jimi_device_location != null && d.jimi_device_location.status == status && d.jimi_device_location.accStatus == accStatus && d.jimi_device_location.speed != null);
      }
    }
  }

  filterKeyword(event) {
    let key_word = event.target.value;
    if (key_word && key_word.trim() != '') {
      this.dataService.table_data_list = this.original_table_data_list.filter((d) => {
        return (
          d.brand.toLowerCase().indexOf(key_word.toLowerCase()) > -1 ||
          d.model.toLowerCase().indexOf(key_word.toLowerCase()) > -1 ||
          d.plate.toLowerCase().indexOf(key_word.toLowerCase()) > -1
        );
      })
    }
    else {
      this.dataService.table_data_list = this.original_table_data_list;
    }
  }

  // chosenHandler(ev){//normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   // console.log(ev);
  //   const ctrlValue = this.date.value;
  //   // ctrlValue.month(normalizedMonth.month());
  //   this.date.setValue(ctrlValue);
  //   this.target_day = (this.date.value.format('YYYY-MM-DD'));
  //   console.log(this.target_day);
  //   this.getCarDataList();
  //   // datepicker.close();

  // }

  selectionBookingDateChanged(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value != null && dateRangeStart.value != '' && dateRangeEnd.value != null && dateRangeEnd.value != '') {
      this.target_start_day = dateRangeStart.value.substring(0, 10) + "T00:00:00";
      this.target_end_day = dateRangeEnd.value.substring(0, 10) + "T23:59:59";
      this.getCarDataList();
    }
  }

  resetTargetDate() {
    this.target_start_day = null;
    this.target_end_day = null;
    this.getCarDataList();
  }


  async indexMode() {
    await this.dataService.getAllRentableCarData(null, null, ['id', 'data_type', 'disabled', 'sold', 'brand', 'keyless_type', 'model', 'plate', 'car_cover_img_url', 'applicable_pickup_parking_id_list', 'applicable_return_parking_id_list', 'keyless_type']);
    this.hybrid_car_data_list = this.dataService.display_rentable_car_data_list$.value.filter((c: CarData) => c.engine == Engine.hybrid);
    this.electric_car_data_list = this.dataService.display_rentable_car_data_list$.value.filter((c: CarData) => c.engine == Engine.electric);
    this.index_mode = true;
  }

  saveIndexModeChange() {
    this.commonService.isLoading = true;
    this.hybrid_car_data_list.forEach(async (cd: CarData, i) => {
      let index = i + 1;
      if (cd.index != index) {
        let send_data = {
          id: cd.id,
          index: index
        }
        const update_car_date: Response = await this.dataService.updateCarData(send_data);
      }
    });
    this.electric_car_data_list.forEach(async (cd: CarData, i) => {
      let index = i + 1;
      if (cd.index != index) {
        let send_data = {
          id: cd.id,
          index: index
        }
        const update_car_date: Response = await this.dataService.updateCarData(send_data);
      }
    });
    setTimeout(() => {
      this.commonService.isLoading = false;
      this.commonService.openSnackBar("已更新");
      this.indexMode();
    }, 1500);
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>, type) {
    if (type == Engine.hybrid) {
      this.hybrid_car_data_list = ev.detail.complete(this.hybrid_car_data_list);
    }
    if (type == Engine.electric) {
      this.electric_car_data_list = ev.detail.complete(this.electric_car_data_list);
    }
    ev.detail.complete();
  }

  async getJimiUserDeviceLocationList() {
    const get_jimi_user_device_location_list_result: Response = await this.dataService.getJimiUserDeviceLocationList();
    console.log(get_jimi_user_device_location_list_result);
    if (get_jimi_user_device_location_list_result.result == 'success') {
      for (let index = 0; index < this.dataService.table_data_list.length; index++) {
        this.dataService.table_data_list[index]['jimi_device_location'] = get_jimi_user_device_location_list_result.data.find(d => d.imei == this.dataService.table_data_list[index]['dashcam_imei'])
      }
      for (let index = 0; index < this.original_table_data_list.length; index++) {
        this.original_table_data_list[index]['jimi_device_location'] = get_jimi_user_device_location_list_result.data.find(d => d.imei == this.original_table_data_list[index]['dashcam_imei'])
      }
    }
  }

  // async obdUnlockToggleChange($event, obd_device_id) {
  //   console.log($event);
  //   if (obd_device_id == null || obd_device_id == '') {
  //     this.commonService.openSnackBar("此車輛未有OBD裝置");
  //     return;
  //   }
  //   if ($event.detail.checked) {
  //     const unlock_obd_by_device_id_result: Response = await this.dataService.lockUnlockObdByDeviceId(obd_device_id, 'unlock');
  //     console.log(unlock_obd_by_device_id_result);
  //     if (unlock_obd_by_device_id_result.result != 'success') {
  //       $event.target.checked = false;
  //       this.commonService.openSnackBar("4G解鎖失敗，請稍後再試");
  //       return;
  //     }
  //     this.commonService.openSnackBar("已使用4G解鎖");
  //   }
  //   else {

  //     const unlock_obd_by_device_id_result: Response = await this.dataService.lockUnlockObdByDeviceId(obd_device_id, 'lock');
  //     console.log(unlock_obd_by_device_id_result);
  //     if (unlock_obd_by_device_id_result.result != 'success') {
  //       $event.target.checked = false;
  //       this.commonService.openSnackBar("4G上鎖失敗，請稍後再試");
  //       return;
  //     }
  //     this.commonService.openSnackBar("已使用4G上鎖");
  //   }
  // }

  obd_control_last_action = null;

  async obdRangeChange($event, obd_device_id) {
    console.log($event);
    if (obd_device_id == null || obd_device_id == '') {
      this.commonService.openSnackBar("此車輛未有OBD裝置");
      return;
    }
    if ($event.detail.value == 2) {
      this.obd_control_last_action = 'unlock';
      const unlock_obd_by_device_id_result: Response = await this.dataService.lockUnlockObdByDeviceId(obd_device_id, 'unlock');
      console.log(unlock_obd_by_device_id_result);
      if (unlock_obd_by_device_id_result.result != 'success') {
        $event.target.value = 1;
        this.commonService.openSnackBar("4G解鎖失敗，請稍後再試");
        return;
      }
      this.commonService.openSnackBar("已使用4G解鎖");
    }
    else if ($event.detail.value == 0) {
      this.obd_control_last_action = 'lock';
      const unlock_obd_by_device_id_result: Response = await this.dataService.lockUnlockObdByDeviceId(obd_device_id, 'lock');
      console.log(unlock_obd_by_device_id_result);
      if (unlock_obd_by_device_id_result.result != 'success') {
        $event.target.value = 1;
        this.commonService.openSnackBar("4G上鎖失敗，請稍後再試");
        return;
      }
      this.commonService.openSnackBar("已使用4G上鎖");
    }
    else{
      this.obd_control_last_action = null;
    }
  }

}
