import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CarData, CompensationPaymentStatus, UserData } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-compensation-payment',
  templateUrl: './compensation-payment.page.html',
  styleUrls: ['./compensation-payment.page.scss'],
})
export class CompensationPaymentPage implements OnInit {
  sorting = null;
  direction = null;
  limit = null;
  page = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();;
  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();

  status = null;
  user_id = null;
  car_id = null;

  @ViewChild('ionSelectable') ionSelectable: IonicSelectableComponent;
  @ViewChild('ionSelectable2') ionSelectable2: IonicSelectableComponent;

  public get compensationPaymentStatus(): typeof CompensationPaymentStatus {
    return CompensationPaymentStatus;
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

      this.status = (params && params.status ? (params.status) : "");
      this.user_id = (params && params.user_id ? (params.user_id) : "");
      this.car_id = (params && params.car_id ? (params.car_id) : "");
    });
  }


  ngOnInit() {
    if (this.dataService.table_data_list != null){
      this.sorting = null;
      this.direction = null;
      this.page = 1;
    }
    this.getCompensationPaymentDataList();
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData();
    }
  }

  getCompensationPaymentDataList(export_to_excel?: boolean) {
    if (!export_to_excel){
      this.dataService.resetTableData();
    }

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,

      status: this.status,
      user_id: this.user_id,
      car_id: this.car_id,
      export_to_excel: export_to_excel ?? false
    }
    console.log(JSON.stringify(send_data));
    // this.commonService.isLoading = true;

    this.apiService.postFromServer(ApiPath.get_compensation_payment_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
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

      let new_path = `/compensation-payment?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&status=${this.status}&user_id=${this.user_id||''}&car_id=${this.car_id||''}`;
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
      this.getCompensationPaymentDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getCompensationPaymentDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getCompensationPaymentDataList();
    }
  }

  selectPage(page) {
    if (this.page == page){
      return;
    }
    this.page = page;
    this.getCompensationPaymentDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getCompensationPaymentDataList();
  }

  goNextPage() {
    this.page++;
    this.getCompensationPaymentDataList();
  }

  clearSearch(ev) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getCompensationPaymentDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getCompensationPaymentDataList();
  }


  onUserChange(event){
    this.getCompensationPaymentDataList();
  }


  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  resetAndGetData(event){
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getCompensationPaymentDataList();
  }


  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  onCarChange(event){
    this.resetAndGetData(null);
  }

  onUserOpen(event: { component: IonicSelectableComponent }) {
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData();
    }
  }

  onCarOpen(event: { component: IonicSelectableComponent }) {
    if (this.dataService.car_data_list$.value.length == 0){
      this.showCarLoading();
      this.dataService.getAllCarData();
      this.hideCarLoading();
    }
  }

  showUserLoading() {
    this.ionSelectable.showLoading();
  }

  hideUserLoading() {
    this.ionSelectable.hideLoading();
  }

  showCarLoading() {
    this.ionSelectable2.showLoading();
  }

  hideCarLoading() {
    this.ionSelectable2.hideLoading();
  }

}
