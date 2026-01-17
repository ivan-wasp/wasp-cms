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
import { CarData, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rbb',
  templateUrl: './rbb.page.html',
  styleUrls: ['./rbb.page.scss'],
})
export class RbbPage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  key_word = null;

  searchControl = new UntypedFormControl();

  status = null;
  user_id = null;
  car_id = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();
  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();

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
      this.direction = (params && params.direction ? (params.direction) : "DESC");
      this.key_word = (params && params.key_word ? (params.key_word) : "");

      this.status = (params && params.status ? (params.status) : "");
      this.user_id = (params && params.user_id ? (params.user_id) : "");
      this.car_id = (params && params.car_id ? (params.car_id) : "");
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
        this.getRbbDataList();
      });

    if (this.dataService.car_data_list$.value == null) {
      this.dataService.getAllCarData();
    }
  }

  getRbbDataList() {
    this.dataService.resetTableData();

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      status: this.status,
      user_id: this.user_id,
      car_id: this.car_id
    }
    if (this.key_word != null && this.key_word != '') {
      send_data['key_word'] = this.key_word;
    }

    this.apiService.postFromServer(ApiPath.get_rbb_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      let new_path = `/rbb?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&key_word=${this.key_word}&status=${this.status}&user_id=${this.user_id || ''}&car_id=${this.car_id || ''}`;
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
      this.getRbbDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getRbbDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getRbbDataList();
    }
  }

  selectPage(page) {
    if (this.page == page) {
      return;
    }
    this.page = page;
    this.getRbbDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getRbbDataList();
  }

  goNextPage() {
    this.page++;
    this.getRbbDataList();
  }


  clearSearch(ev) {
    this.key_word = '';
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getRbbDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getRbbDataList();
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
    this.key_word = "";
    this.getRbbDataList();
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
