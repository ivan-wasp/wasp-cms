import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Area } from 'src/app/schema';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  key_word = null;

  searchControl = new UntypedFormControl();

  deposit = null;
  order = null;

  public get area(): typeof Area {
    return Area;
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

      this.deposit = (params && params.deposit ? (params.deposit) : "");
      this.order = (params && params.order ? (params.order) : "");
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
        this.getUserDataList();
      });
  }

  getUserDataList(export_to_excel?: boolean) {
    if (!export_to_excel){
      this.dataService.resetTableData();
    }

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      get_deposit: true,
      get_order: true,
      deposit: this.deposit,
      order: this.order,
      export_to_excel: export_to_excel ?? false
    }
    if (this.key_word != null && this.key_word != '') {
      send_data['key_word'] = this.key_word;
    }
    console.log(JSON.stringify(send_data));
    // this.commonService.isLoading = true;

    this.apiService.postFromServer(ApiPath.get_user_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {

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

      let new_path = `/user?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&key_word=${this.key_word}&deposit=${this.deposit}&order=${this.order}`;
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
      this.getUserDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getUserDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getUserDataList();
    }
  }

  selectPage(page) {
    if (this.page == page){
      return;
    }
    this.page = page;
    this.getUserDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getUserDataList();
  }

  goNextPage() {
    this.page++;
    this.getUserDataList();
  }

  clearSearch(ev) {
    this.key_word = '';
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getUserDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getUserDataList();
  }


  resetAndGetData(event){
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.key_word = "";
    this.getUserDataList();
  }


}
