import { Component, OnInit } from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-equipment-report',
  templateUrl: './equipment-report.page.html',
  styleUrls: ['./equipment-report.page.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EquipmentReportPage implements OnInit {

  date = new UntypedFormControl(moment());
  selected_year_month = null;
  selected_company = null;
  selected_type = null;


  all_equipment_company_list = null;
  all_product_company_list = null;

  selected_summary = null
  

  constructor(
    public commonService: CommonService,
    public auth: AuthService,
    private apiService: ApiService,
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.getEquipmentSummaryReportList();
    this.getAllEquipmentCompany();
  }

  getAllEquipmentCompany() {
    let send_data = {
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_all_equipment_company_list, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.all_equipment_company_list = res.data;

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }


  getEquipmentSummaryReportList() {
    this.selected_summary = null;
    this.dataService.resetTableData();

    let send_data = {
      // sorting: this.sorting,
      // direction: this.direction,
      // limit: this.limit,
      // page: this.page,
      // get_deposit: true,
      // get_order: true,
      // status: this.status,
      // create_date_start: this.create_date_start,
      // create_date_end: this.create_date_end,
      // booking_date_start: this.booking_date_start,
      // booking_date_end: this.booking_date_end,
      // user_id: this.user_id,
      // car_id: this.car_id
      year_month: this.selected_year_month,
      company: this.selected_company
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_equipment_summary_report, send_data, true).then((res: Response) => {
      // let new_path = `/order?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&key_word=${this.key_word}&status=${this.status}&create_date_start=${this.create_date_start||''}&create_date_end=${this.create_date_end||''}&booking_date_start=${this.booking_date_start||''}&booking_date_end=${this.booking_date_end||''}&user_id=${this.user_id||''}&car_id=${this.car_id||''}`;
      // if (this.location.path() != new_path) {
      //   this.location.replaceState(new_path);
      // }
      // this.commonService.isLoading = false;
      console.log(res.data);
      if (res.result == 'success') {
        this.dataService.table_data_list = res.data;

        //calculate sales quantity
        this.dataService.table_data_list.forEach(element => {
          element['sales_quantity'] = 0;
          element.order_data_list.forEach(element2 => {
            element['sales_quantity'] += element2.equipment_id_list.map( d => element.equipment_id_list.includes(d)).length;
          });
        });

        //calculate sales amount
        this.dataService.table_data_list.forEach(element => {
          element['sales_amount'] = 0;
          element.order_data_list.forEach(element2 => {
            element['sales_amount'] += (element2.equipment_data_list.filter( d => element.equipment_id_list.includes(d.id)).map(d => d.price_per_month).reduce((a, b) => a+b))*(Math.round(element2.booking_date_list.length/30) > 0 ? Math.round(element2.booking_date_list.length/30) : 1);
            // element['sales_amount'] += element2.equipment_id_list.map( d => element.equipment_id_list.includes(d)).length;
          });
        });
        
        // this.dataService.table_data_total_number = res.data.total_number;
        // this.dataService.table_data_number_of_page = Math.ceil(res.data.total_number / this.limit);
      } else {
        this.commonService.openErrorSnackBar();
      }
    });

  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.selected_year_month = (this.date.value.format('YYYY-MM'));
    datepicker.close();

    this.getEquipmentSummaryReportList();
  }

  resetFilterDate(){
    this.selected_year_month = null;
    this.getEquipmentSummaryReportList();
  }

}
