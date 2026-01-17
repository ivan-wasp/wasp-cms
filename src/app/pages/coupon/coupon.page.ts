import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { AdminData, Authority, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.page.html',
  styleUrls: ['./coupon.page.scss'],
})
export class CouponPage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  key_word = null;

  searchControl = new UntypedFormControl();

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();;

  reusable = null;
  is_generated_by_system = null;
  used = null;
  user_id = null;

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();


  @ViewChild('ionSelectable') ionSelectable: IonicSelectableComponent;
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
      this.sorting = (params && params.sorting ? (params.sorting) : "create_date");
      this.direction = (params && params.direction && params.direction != null ? (params.direction) : "DESC");
      this.key_word = (params && params.key_word ? (params.key_word) : "");

      this.is_generated_by_system = (params && params.is_generated_by_system ? (params.is_generated_by_system == 'true' ? true : false) : false);
      this.reusable = (params && params.reusable ? (params.reusable == 'true' ? true : false) : "");
      this.used = (params && params.used ? (params.used == 'true' ? true : false) : "");
      this.user_id = (params && params.user_id ? (params.user_id) : "");
    });
  }


  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(term => {
          if (this.dataService.table_data_list != null){
          this.sorting = null;
          this.direction = null;
          this.page = 1;
        }
        this.key_word = term;
        this.getCouponDataList();
      });
  }

  getCouponDataList() {
    this.dataService.resetTableData();

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,

      is_generated_by_system: this.is_generated_by_system != null && this.is_generated_by_system != '' ? (this.is_generated_by_system == 'true' ? true : false) : false,
      reusable: this.reusable != null && this.reusable != '' ? (this.reusable == 'true' ? true : false) : '',
      used: this.used != null && this.used != '' ? (this.used == 'true' ? true : false) : '',
      user_id: this.user_id,
      get_number_of_usage: true
    }
    if (this.key_word != null && this.key_word != '') {
      send_data['key_word'] = this.key_word;
    }
    console.log(JSON.stringify(send_data));

    this.apiService.postFromServer(ApiPath.get_coupon_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      let new_path = `/coupon?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&key_word=${this.key_word}&is_generated_by_system=${this.is_generated_by_system||''}&reusable=${this.reusable||''}&used=${this.used||''}&user_id=${this.user_id||''}`;
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
      this.getCouponDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getCouponDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getCouponDataList();
    }
  }

  selectPage(page) {
    if (this.page == page){
      return;
    }
    this.page = page;
    this.getCouponDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getCouponDataList();
  }

  goNextPage() {
    this.page++;
    this.getCouponDataList();
  }

  searchCoupon() {
    setTimeout(() => {
      this.sorting = null;
      this.direction = null;
      this.page = 1;
      this.getCouponDataList();
    }, 300);
  }

  clearSearch(ev) {
    this.key_word = '';
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getCouponDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getCouponDataList();
  }

  onUserChange(event){
    this.resetAndGetData(null);
  }

  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  resetAndGetData(event){
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.key_word = "";
    this.getCouponDataList();
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
