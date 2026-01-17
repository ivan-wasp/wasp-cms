import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { AdminData, Authority } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-outstanding-payment',
  templateUrl: './outstanding-payment.page.html',
  styleUrls: ['./outstanding-payment.page.scss'],
})
export class OutstandingPaymentPage implements OnInit {

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  key_word = null;

  searchControl = new UntypedFormControl();

  status = null;
  expiry_date = null;

  public get authority(): typeof Authority {
    return Authority;
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
      this.sorting = (params && params.sorting ? (params.sorting) : "expiry_date");
      this.direction = (params && params.direction && params.direction != null ? (params.direction) : "DESC");
      this.key_word = (params && params.key_word ? (params.key_word) : "");
      
      this.status = (params && params.status ? (params.status) : "awaiting_payment");
      // this.expiry_date = (params && params.expiry_date ? (params.expiry_date) : this.commonService.ToBackendDateTimeString(new Date()).split('T')[0]);
    });
  }


  ngOnInit() {
    // this.searchControl.valueChanges
    //   .pipe(debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(term => {
    //       if (this.dataService.table_data_list != null){
    //       this.sorting = null;
    //       this.direction = null;
    //       this.page = 1;
    //     }
    //     this.key_word = term;
    //     this.getPaymentDataList();
    //   });
    this.getPaymentDataList();
  }


  getPaymentDataList() {
    this.dataService.resetTableData();

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      status: this.status,
      expiry_date: this.commonService.ToBackendDateTimeString(new Date()).split('T')[0],

      get_car_data: true,
      get_user_data: true
    }
    if (this.key_word != null && this.key_word != '') {
      send_data['key_word'] = this.key_word;
    }
    this.apiService.postFromServer(ApiPath.get_payment_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      let new_path = `/outstanding-payment?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&key_word=${this.key_word}&status=${this.status}`;
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
      this.getPaymentDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getPaymentDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getPaymentDataList();
    }
  }

  selectPage(page) {
    if (this.page == page){
      return;
    }
    this.page = page;
    this.getPaymentDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getPaymentDataList();
  }

  goNextPage() {
    this.page++;
    this.getPaymentDataList();
  }

  clearSearch(ev) {
    this.key_word = '';
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getPaymentDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getPaymentDataList();
  }


  resetAndGetData(event){
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.key_word = "";
    this.getPaymentDataList();
  }


  encodeArray(value){
    return JSON.stringify(value);
  }

}
