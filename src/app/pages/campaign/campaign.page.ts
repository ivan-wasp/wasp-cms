import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { CarData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.page.html',
  styleUrls: ['./campaign.page.scss'],
})
export class CampaignPage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  car_id = null;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();

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
      this.car_id = (params && params.car_id ? (params.car_id) : "");
    });
  }


  ngOnInit() {
    if (this.dataService.table_data_list != null){
      this.sorting = null;
      this.direction = null;
      this.page = 1;
    }
    this.getCampaignDataList();
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }

  }


  getCampaignDataList() {
    this.dataService.resetTableData();

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,
      car_id: this.car_id
    }
    console.log(JSON.stringify(send_data));

    this.apiService.postFromServer(ApiPath.get_campaign_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {

      let new_path = `/campaign?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&car_id=${this.car_id||''}`;
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
      this.getCampaignDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getCampaignDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getCampaignDataList();
    }
  }

  selectPage(page) {
    if (this.page == page){
      return;
    }
    this.page = page;
    this.getCampaignDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getCampaignDataList();
  }

  goNextPage() {
    this.page++;
    this.getCampaignDataList();
  }

  clearSearch(ev) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getCampaignDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getCampaignDataList();
  }


  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }




  onCarChange(event){
    this.resetAndGetData(null);
  }


  resetAndGetData(event){
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getCampaignDataList();
  }


}
