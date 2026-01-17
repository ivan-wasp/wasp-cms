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
import { CarData, FactoryData, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
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
export class AppointmentPage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  key_word = null;

  searchControl = new UntypedFormControl();

  status = null;
  user_id = null;
  car_id = null;
  factory_id = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();
  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_factory_data_list$: Observable<FactoryData[]> = this.dataService.factory_data_list$.pipe();

  appointment_date_start = null;
  appointment_date_end = null;

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

      this.status = (params && params.status ? (params.status) : "");
      this.user_id = (params && params.user_id ? (params.user_id) : "");
      this.car_id = (params && params.car_id ? (params.car_id) : "");
      this.appointment_date_start = (params && params.appointment_date_start ? (params.appointment_date_start) : "");
      this.appointment_date_end = (params && params.appointment_date_end ? (params.appointment_date_end) : "");
    });
  }



  ngOnInit() {
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
        this.getAppointmentDataList();
      });
    if (this.dataService.car_data_list$.value == null) {
      this.dataService.getAllCarData();
    }
    this.dataService.getAllFactoryData();
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData();
    }
  }

  getAppointmentDataList(export_to_excel?: boolean) {
    if (!export_to_excel){
      this.dataService.resetTableData();
    }

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      // filter_vip: '',
      car_id: this.car_id,
      user_id: this.user_id,
      factory_id: this.factory_id,
      status: this.status,
      appointment_date_start: this.appointment_date_start,
      appointment_date_end: this.appointment_date_end,
      export_to_excel: export_to_excel ?? false
    }
    if (this.key_word != null && this.key_word != '') {
      send_data['key_word'] = this.key_word;
    }
    console.log(JSON.stringify(send_data));
    this.apiService.postFromServer(ApiPath.get_appointment_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      if (send_data.export_to_excel){
        if (this.dataService.table_data_list == null || this.dataService.table_data_list.length == 0){
          return this.commonService.openSnackBar("沒有資料");
        }
        else{
          if (res.result == 'success' && res.data != ''){
            return this.commonService.downloadMedia(res.data, true);
          }
          else{
            return this.commonService.openErrorSnackBar();
          }
        }
      }
      
      let new_path = `/appointment?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&key_word=${this.key_word}&user_id=${this.user_id || ''}&car_id=${this.car_id || ''}&factory_id=${this.factory_id || ''}&status=${this.status}&appointment_date_start=${this.appointment_date_start}&appointment_date_end=${this.appointment_date_end}`;
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
      this.getAppointmentDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getAppointmentDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getAppointmentDataList();
    }
  }

  selectPage(page) {
    if (this.page == page) {
      return;
    }
    this.page = page;
    this.getAppointmentDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getAppointmentDataList();
  }

  goNextPage() {
    this.page++;
    this.getAppointmentDataList();
  }


  clearSearch(ev) {
    this.key_word = '';
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getAppointmentDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getAppointmentDataList();
  }

  selectionDateChanged(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value != null && dateRangeStart.value != '' && dateRangeEnd.value != null && dateRangeEnd.value != '') {
      this.appointment_date_start = dateRangeStart.value.substring(0, 10) + "T00:00:00";
      this.appointment_date_end = dateRangeEnd.value.substring(0, 10) + "T23:59:59";
      this.resetAndGetData(null);
    }
  }

  resetAppointmentDate() {
    this.appointment_date_start = '';
    this.appointment_date_end = '';
    this.getAppointmentDataList();
  }

  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  onUserChange(event) {
    this.getAppointmentDataList();
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  onCarChange(event) {
    this.resetAndGetData(null);
  }

  getFactoryDataById(id) {
    return this.dataService.factory_data_list$.value != null ? this.dataService.factory_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  searchFactory(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    event.component.items = this.dataService.factory_data_list$.value.filter(factory => {
      return factory.id.toString().toLowerCase().indexOf(text) !== -1 ||
        factory.zh_name.toLowerCase().indexOf(text) !== -1 ||
        factory.en_name.toLowerCase().indexOf(text) !== -1 ||
        factory.zh_address.toLowerCase().indexOf(text) !== -1 ||
        factory.en_address.toLowerCase().indexOf(text) !== -1;
    });
    event.component.endSearch();
  }


  onFactoryChange(event) {
    this.resetAndGetData(null);
  }


  resetAndGetData(event) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.key_word = "";
    this.getAppointmentDataList();
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
