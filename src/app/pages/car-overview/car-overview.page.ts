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
  selector: 'app-car-overview',
  templateUrl: './car-overview.page.html',
  styleUrls: ['./car-overview.page.scss'],
})
export class CarOverviewPage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  key_word = null;

  searchControl = new UntypedFormControl();

  original_table_data_list = null;


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
      this.limit = (params && params.limit ? (params.limit) : 25);
      this.sorting = (params && params.sorting ? (params.sorting) : "create_date");
      this.direction = (params && params.direction && params.direction != null ? (params.direction) : "DESC");
      this.key_word = (params && params.key_word ? (params.key_word) : "");
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
    //     this.getCarDataList();
    //   });
    this.getCarDataList();
  }

  getCarDataList() {
    this.dataService.resetTableData();

    let fix_page = 0;
    let fix_limit = 1000;

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      // limit: this.limit,
      limit: fix_limit,
      // page: this.page,
      page: fix_page,
      // filter_vip: '',
      // brand: this.brand,
      today_status: true,
      has_campaign: true,
      get_paid_payment_amount: true,
      get_maintenance_cost_amount: true
    }
    if (this.key_word != null && this.key_word != '') {
      send_data['key_word'] = this.key_word;
    }
    // console.log(JSON.stringify(send_data));
    // this.commonService.isLoading = true;

    this.apiService.postFromServer(ApiPath.get_car_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      let new_path = `/car-overview?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&key_word=${this.key_word}`;
      if(this.location.path() != new_path){
        this.location.replaceState(new_path);
      }
      // this.commonService.isLoading = false;
      console.log(res.data);
      if (res.result == 'success') {
        let raw_data = res.data.item_list;
        if(this.sorting == "today_status"){
          if(this.direction =="ASC"){
            raw_data.sort(function(a, b){
              if(a.today_status < b.today_status) { return -1; }
              if(a.today_status > b.today_status) { return 1; }
              return 0;
          })
          }else{
            raw_data.sort(function(a, b){
              if(a.today_status < b.today_status) { return 1; }
              if(a.today_status > b.today_status) { return -1; }
              return 0;
          })
          }
        }
        console.log(raw_data);
        this.dataService.table_data_list = raw_data.slice((this.page-1)*this.limit, ((this.page-1)*this.limit)+this.limit);
        console.log(this.dataService.table_data_list);

        this.original_table_data_list = JSON.parse(JSON.stringify(this.dataService.table_data_list ));

        this.dataService.table_data_total_number = res.data.total_number;
        this.dataService.table_data_number_of_page = Math.ceil(res.data.total_number / this.limit);
      } else {
        this.commonService.openErrorSnackBar();
      }
    });

  }


  onSearchCancel(ev){
    this.key_word = "";
    this.getCarDataList();
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
    if (this.page == page){
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

  clearSearch(ev){
    this.key_word = '';
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getCarDataList();
  }

  limitChange(ev){
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getCarDataList();
  }

  resetAndGetData(event){
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.key_word = "";
    this.getCarDataList();
  }

  filterStatus(today_status){
    if (today_status == 'all'){
      this.dataService.table_data_list = this.original_table_data_list;
    }
    else{
      this.dataService.table_data_list = this.original_table_data_list.filter(d => d.today_status == today_status);
    }

  }

  
}
