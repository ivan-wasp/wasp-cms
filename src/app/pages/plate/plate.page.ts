import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';

@Component({
  selector: 'app-plate',
  templateUrl: './plate.page.html',
  styleUrls: ['./plate.page.scss'],
})
export class PlatePage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

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
    });
  }



  ngOnInit() {
    if (this.dataService.table_data_list != null){
      this.sorting = null;
      this.direction = null;
      this.page = 1;
    }
    this.getPlateDataList();
  }

  getPlateDataList() {
    this.dataService.resetTableData();

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      // filter_vip: '',
    }

    this.apiService.postFromServer(ApiPath.get_plate_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      let new_path = `/plate?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}`;
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
      this.getPlateDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getPlateDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getPlateDataList();
    }
  }

  selectPage(page) {
    if (this.page == page){
      return;
    }
    this.page = page;
    this.getPlateDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getPlateDataList();
  }

  goNextPage() {
    this.page++;
    this.getPlateDataList();
  }


  clearSearch(ev) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getPlateDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getPlateDataList();
  }


}
