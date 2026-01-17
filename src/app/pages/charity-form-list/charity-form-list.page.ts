import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';

@Component({
  selector: 'app-charity-form-list',
  templateUrl: './charity-form-list.page.html',
  styleUrls: ['./charity-form-list.page.scss'],
})
export class CharityFormListPage implements OnInit {
  limit = 10;
  page = 1;
  max = 1;
  used="";

  all_data = [];
  searchControl = new UntypedFormControl();
  selected_data = [];

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
  }


  ngOnInit() {
    this.getOrderDataList();
    this.searchControl.valueChanges
      .pipe(debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(term => {
        console.log(term);
        //   if (this.dataService.table_data_list != null){
        //   this.sorting = null;
        //   this.direction = null;
        //   this.page = 1;
        // }
        // this.key_word = term;
        // this.getSevenCouponDataList();
      });
  }


  typeName(str){
    let txt = "";
    switch(str){
      case "inquiry":
        txt="企業合作";
        break;
        case "sell_car":
          txt="我要放車";
          break;
          case "repair":
            txt="申請為維修中心";
            break;
            case "seller":
              txt="寄賣";
              break;
              case "sponsor":
                txt="贊助";
                break;
    }
    return txt;
  }


  getOrderDataList() {
    this.dataService.resetTableData();

    this.apiService.postFromServer(ApiPath.get_all_form, null, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == 'success') {
        this.all_data = res.data;
        this.selected_data = res.data;
        console.log(this.all_data);
        this.LoadTable();
        this.dataService.table_data_total_number = res.data.length;
        this.dataService.table_data_number_of_page = Math.ceil(res.data.length / this.limit);
      } else {
        this.all_data = [];
        this.selected_data = [];
        this.LoadTable();
        this.dataService.table_data_total_number = 0
        this.dataService.table_data_number_of_page = 0;
        // this.commonService.openErrorSnackBar();
      }
    });

  }

  selectPage(page) {
    if (this.page == page){
      return;
    }
    this.page = page;
    this.LoadTable();
  }

  goPreviousPage() {
    this.page--;
    if(this.page<1){
      this.page = 1;
    }
    this.LoadTable();
  }

  goNextPage() {
    this.page++;
    this.max = Math.ceil(this.selected_data.length/this.limit);
    if(this.page>this.max){
      this.page = this.max;
    }
    this.LoadTable();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.max = Math.ceil(this.selected_data.length/this.limit);
    this.dataService.table_data_total_number = this.selected_data.length;
    this.dataService.table_data_number_of_page = Math.ceil(this.selected_data.length / this.limit);
    this.LoadTable();
  }

  LoadTable(){

    this.dataService.table_data_list = this.selected_data.slice((this.page-1)*this.limit, this.page*this.limit);
  }
  changeFilter(ev){
    console.log(this.all_data);
    console.log(ev);
    // let filter_key = ev.value;
    if(ev.target.value == ""){
      this.selected_data = JSON.parse(JSON.stringify(this.all_data));
    }else{
      this.selected_data = this.all_data.filter(data => data.type == ev.target.value);
    }
    this.page = 1;
    this.max = Math.ceil(this.selected_data.length/this.limit);
    this.dataService.table_data_total_number = this.selected_data.length;
    this.dataService.table_data_number_of_page = Math.ceil(this.selected_data.length / this.limit);
    this.LoadTable();
  }

}
