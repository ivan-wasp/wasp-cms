import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarData } from 'src/app/schema';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-supercharge',
  templateUrl: './supercharge.page.html',
  styleUrls: ['./supercharge.page.scss'],
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
export class SuperchargePage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  start_date = null;
  end_date = null;

  all_tesla_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe(
    map((cl: CarData[]) => {
      return cl != null && cl.length > 0 ? cl.filter(d => d.brand.toLowerCase() == 'tesla' && d.vin != '') : [];
    })
  );

  car_id = null;
  
  total_charging_fee: number = null;

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
      // this.page = (params && params.page ? parseInt(params.page) : 1);
      // this.limit = (params && params.limit ? parseInt(params.limit) : 10);
      this.sorting = (params && params.sorting ? (params.sorting) : "startTime");
      this.direction = (params && params.direction && params.direction != null ? (params.direction) : "DESC");

      // this.car_id = (params && params.car_id ? (params.car_id) : "");

    });
  }



  async ngOnInit() {
    if (!environment.production) {
      return;
    }
    if (this.dataService.table_data_list != null) {
      this.sorting = null;
      this.direction = null;
      this.page = 1;
    }
    if (this.dataService.car_data_list$.value == null) {
      await this.dataService.getAllCarData(['id', 'plate', 'model', 'brand', 'vin']);
    }
    if (this.car_id != null && this.car_id != '') {
      this.getSuperchargeHistoryDataList();
    }
  }


  getSuperchargeHistoryDataList(export_to_excel?: boolean) {
    this.total_charging_fee = null;
    if (!environment.production) {
      return;
    }
    if (!export_to_excel) {
      this.dataService.resetTableData();
    }
    if (this.start_date == null || this.start_date == '' || this.end_date == null || this.end_date == '') {
      return this.commonService.openErrorSnackBar("請先選擇日期");
    }
    let send_data = {
      startTime: this.start_date,
      endTime: this.end_date,
      // sorting: this.sorting,
      // direction: this.direction,
      // limit: this.limit,
      // page: this.page,

      export_to_excel: export_to_excel ?? false
    }

    // if (this.sorting != null && this.sorting != 'null'){
    //   send_data['sorting'] = this.sorting
    // }
    // if (this.direction != null && this.direction != 'null'){
    //   send_data['direction'] = this.direction
    // }

    if (this.car_id != null && this.car_id != ''){
      send_data['vin'] = this.dataService.car_data_list$.value.find(d => d.id == this.car_id).vin;
    }

    console.log(JSON.stringify(send_data));
    this.apiService.postFromServer(ApiPath.get_tesla_charging_history, send_data, true).then((res: Response) => {
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

      let new_path = `/supercharge?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&car_id=${this.car_id || ''}`;
      if (this.location.path() != new_path) {
        this.location.replaceState(new_path);
      }
      // this.commonService.isLoading = false;
      console.log(res.data);
      if (res.result == 'success') {
        this.dataService.table_data_list = (res.data != null ? res.data : []);
        if (this.dataService.table_data_list != null && this.dataService.table_data_list.length > 0){
          this.total_charging_fee = this.dataService.table_data_list.map(d => d.fees[0].totalDue).reduce((accumulator, currentValue) => accumulator + currentValue);
          // console.log(this.total_charging_fee);
        }
        // this.dataService.table_data_total_number = res.data.total_number;
        // this.dataService.table_data_number_of_page = Math.ceil(res.data.total_number / this.limit);
      } else {
        this.commonService.openErrorSnackBar();
      }
    });

  }

  switchSorting(sorting) {
    if (this.sorting == sorting && this.direction == 'DESC') {
      this.direction = 'ASC';
      this.page = 1;
      this.getSuperchargeHistoryDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getSuperchargeHistoryDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getSuperchargeHistoryDataList();
    }
  }

  selectPage(page) {
    if (this.page == page) {
      return;
    }
    this.page = page;
    this.getSuperchargeHistoryDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getSuperchargeHistoryDataList();
  }

  goNextPage() {
    this.page++;
    this.getSuperchargeHistoryDataList();
  }


  clearSearch(ev) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getSuperchargeHistoryDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getSuperchargeHistoryDataList();
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  getCarDataByVin(vin) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.vin == vin)[0] : null;
  }

  onCarChange(event) {
    this.resetAndGetData(null);
  }

  resetAndGetData(event) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getSuperchargeHistoryDataList();
  }

  showLoading() {
    this.ionSelectable.showLoading();
  }

  hideLoading() {
    this.ionSelectable.hideLoading();
  }

  resetBookingDate() {
    this.start_date = '';
    this.end_date = '';
  }

  selectionBookingDateChanged(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value != null && dateRangeStart.value != '' && dateRangeEnd.value != null && dateRangeEnd.value != '') {
      if (differenceInDays(new Date(dateRangeStart.value), new Date(dateRangeEnd.value)) > 7){
        return this.commonService.openErrorSnackBar("最多選擇7天");
      }

      this.start_date = dateRangeStart.value.substring(0, 10) + "T00:00:00Z";
      let s = new Date(this.start_date);
      s.setHours(s.getHours() - 8);
      this.start_date = s.toISOString();

      this.end_date = dateRangeEnd.value.substring(0, 10) + "T23:59:59Z";
      let e = new Date(this.end_date);
      e.setHours(e.getHours() - 8);
      this.end_date = e.toISOString();

      function differenceInDays(date1: Date, date2: Date): number {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const diffInTime = date2.getTime() - date1.getTime();
        return Math.round(diffInTime / oneDay);
      }

      this.getSuperchargeHistoryDataList();

      // console.log(this.end_date);
    }
  }

}
