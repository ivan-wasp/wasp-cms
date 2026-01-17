import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { curveBasis, curveNatural } from 'd3-shape';
import { UntypedFormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { CalendarComponent } from 'ionic2-calendar';
import { AdminData, AdminType, DATA_TYPE } from 'src/app/schema';
import { Observable } from 'rxjs';

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
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HomePage implements OnInit {

  onTimeSelectedFirst = false;
  occupancy_rate = null;

  temp_cms_data = null;

  year_month: string = "";

  this_month_paid_rental_revenue = null;
  this_month_rental_revenue_account_receviable = null;
  next_month_rental_revenue_account_receviable = null;
  total_unpaid_rental_revenue = null;
  total_unpaid_violation = null;
  total_unpaid_hketoll = null;
  total_unpaid_hketoll_without_penalty = null;
  total_unpaid_compensation_payment = null;
  total_deposit = null;
  this_month_deposit = null;
  awaiting_execution_deposit = null;
  total_deposit_valid_to_refund = null;
  paid_rental_revenue_group_by_rental_plan = null;
  six_plus_one_paid_number_of_order = null;
  rent_with_park_paid_number_of_order = null;
  total_maintenane_cost = null;
  total_compensation_amount = null;
  this_month_occupancy_rate = null;
  rentable_car_list = null;
  booked_car_list = null;
  blocked_car_list = null;
  blocked_maintaining_car_list = null;
  available_car_list = null;


  current_year_month = null;

  year_month_list = [];

  user_data_list = null;

  vacancy_list = null;

  selected_date = null;
  selected_date_event_list = null;

  eventSource;
  viewTitle;

  showEventDetail = false;

  isToday: boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function (date: Date) {
        return 'MonMH';
      },
      formatMonthViewTitle: function (date: Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function (date: Date) {
        return 'MonWH';
      },
      formatWeekViewTitle: function (date: Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function (date: Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function (date: Date) {
        return 'testDH';
      },
      formatDayViewTitle: function (date: Date) {
        return 'testDT';
      }
    }
  };

  original_car_data_list = null;
  display_car_data_list = null;

  pie_data_list: any[];
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';
  arcWidth = "0.5";
  colorScheme = {
    domain: ['#F2C828', '#43A5D1', '#F7688F']
  };


  this_month_date_list = [];
  line_data_list = null;
  legend: boolean = false;
  // showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = "Date";
  yAxisLabel: string = "HKD";
  timeline: boolean = true;
  curve: any = curveNatural;

  date = new UntypedFormControl(moment());

  admin_data$: Observable<AdminData> = this.authService.adminData.pipe();


  public get adminType(): typeof AdminType {
    return AdminType;
  }
  @ViewChild(CalendarComponent, { static: false }) myCalendar: CalendarComponent;
  constructor(
    private router: Router,
    public commonService: CommonService,
    public authService: AuthService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    public dataService: DataService,
    private cdf: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.genYearMonthList();

    if (this.authService.getParsedAdminToken().type == AdminType.admin || this.authService.getParsedAdminToken().type == AdminType.sales) {
      this.getKpiTemp();
    }

    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m, 1)).split('T')[0];
    let lastDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m + 1, 0)).split('T')[0];
    this.getDataForCalendar(firstDay, lastDay, false);

    this.getCarDataList();

    // this.getLineChartData();

    const generate_booking_date_list = await this.generateAllBookingDateToList(firstDay, lastDay);
    // console.log(this.this_month_date_list);
  }

  generateAllBookingDateToList(firstDay, lastDay): Promise<any> {
    return new Promise((resolve, reject) => {
      this.this_month_date_list = [];
      let day = 1000 * 60 * 60 * 24;
      let diff = (new Date(lastDay).getTime() - new Date(firstDay).getTime()) / day;
      // console.log(diff);
      for (let i = 0; i < diff; i++) {
        let xx = new Date(firstDay).getTime() + day * i;
        let yy = new Date(xx);
        let date = yy.getFullYear() + "-" + ('0' + (yy.getMonth() + 1)).slice(-2) + "-" + ('0' + (yy.getDate())).slice(-2);
        this.this_month_date_list.push(date);
      }
      resolve('completed');
    });
  }

  genYearMonthList() {
    function addMonths(date, months) {
      date.setMonth(date.getMonth() + months);
      return date;
    }
    let first_day_of_month = this.commonService.ToBackendDateTimeString(new Date()).split('T')[0].slice(0, -2) + '01';
    console.log(first_day_of_month);
    for (let index = 2; index > -20; index--) {
      const result = addMonths(new Date(first_day_of_month), index);
      this.year_month_list.push(`${new Date(result).getFullYear()}-${(new Date(result).getMonth() + 1).toString().padStart(2, '0')}`);
    }
  }

  getKpiTemp() {
    let send_data = {

    }
    // console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_kpi_temp, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.this_month_paid_rental_revenue = res.data.this_month_paid_rental_revenue;
        this.this_month_rental_revenue_account_receviable = res.data.this_month_rental_revenue_account_receviable;
        this.next_month_rental_revenue_account_receviable = res.data.next_month_rental_revenue_account_receviable;
        this.total_unpaid_rental_revenue = res.data.total_unpaid_rental_revenue;
        this.total_unpaid_violation = res.data.total_unpaid_violation;
        this.total_unpaid_hketoll = res.data.total_unpaid_hketoll;
        this.total_unpaid_hketoll_without_penalty = res.data.total_unpaid_hketoll_without_penalty;
        this.total_unpaid_compensation_payment = res.data.total_unpaid_compensation_payment;
        this.total_deposit = res.data.total_deposit;
        this.this_month_deposit = res.data.this_month_deposit;
        this.awaiting_execution_deposit = res.data.awaiting_execution_deposit;
        this.total_deposit_valid_to_refund = res.data.total_deposit_valid_to_refund;
        this.paid_rental_revenue_group_by_rental_plan = res.data.paid_rental_revenue_group_by_rental_plan;
        this.six_plus_one_paid_number_of_order = res.data.six_plus_one_paid_number_of_order;
        this.rent_with_park_paid_number_of_order = res.data.rent_with_park_paid_number_of_order;
        this.total_maintenane_cost = res.data.total_maintenane_cost;
        this.total_compensation_amount = res.data.total_compensation_amount;
        this.this_month_occupancy_rate = res.data.this_month_occupancy_rate;
        this.occupancy_rate = res.data.occupancy_rate;
        this.rentable_car_list = res.data.rentable_car_list;
        this.booked_car_list = res.data.booked_car_list;
        this.blocked_car_list = res.data.blocked_car_list;
        this.blocked_maintaining_car_list = res.data.blocked_maintaining_car_list;
        this.available_car_list = res.data.available_car_list;


        this.initPieChart();
      } else {
        // this.commonService.openErrorSnackBar();
        this.getRefresh();
      }
    }, err => {
      console.log(err);
      // this.commonService.openErrorSnackBar();
      this.getRefresh();
    });
  }

  getRefresh() {
    let send_data = {

    }
    if (this.year_month != '') {
      send_data['year'] = this.year_month.split('-')[0];
      send_data['month'] = this.year_month.split('-')[1];
    }
    // console.log(send_data);
    this.apiService.postFromServer(ApiPath.calculate_kpi, send_data, true).then((res: Response) => {
      console.log("KPI result: ", res.data);
      if (res.result == "success") {
        this.this_month_paid_rental_revenue = res.data.this_month_paid_rental_revenue;
        this.this_month_rental_revenue_account_receviable = res.data.this_month_rental_revenue_account_receviable;
        this.next_month_rental_revenue_account_receviable = res.data.next_month_rental_revenue_account_receviable;
        this.total_unpaid_rental_revenue = res.data.total_unpaid_rental_revenue;
        this.total_unpaid_violation = res.data.total_unpaid_violation;
        this.total_unpaid_hketoll = res.data.total_unpaid_hketoll;
        this.total_unpaid_hketoll_without_penalty = res.data.total_unpaid_hketoll_without_penalty;
        this.total_unpaid_compensation_payment = res.data.total_unpaid_compensation_payment;
        this.total_deposit = res.data.total_deposit;
        this.this_month_deposit = res.data.this_month_deposit;
        this.awaiting_execution_deposit = res.data.awaiting_execution_deposit;
        this.total_deposit_valid_to_refund = res.data.total_deposit_valid_to_refund;
        this.paid_rental_revenue_group_by_rental_plan = res.data.paid_rental_revenue_group_by_rental_plan;
        this.six_plus_one_paid_number_of_order = res.data.six_plus_one_paid_number_of_order;
        this.rent_with_park_paid_number_of_order = res.data.rent_with_park_paid_number_of_order;
        this.total_maintenane_cost = res.data.total_maintenane_cost;
        this.total_compensation_amount = res.data.total_compensation_amount;
        this.this_month_occupancy_rate = res.data.this_month_occupancy_rate;
        this.occupancy_rate = res.data.occupancy_rate;
        this.rentable_car_list = res.data.rentable_car_list;
        this.booked_car_list = res.data.booked_car_list;
        this.blocked_car_list = res.data.blocked_car_list;
        this.blocked_maintaining_car_list = res.data.blocked_maintaining_car_list;
        this.available_car_list = res.data.available_car_list;

        this.temp_cms_data = res.data;

        if (this.year_month == "") {
          const update_kpi_temp = this.apiService.postFromServer(ApiPath.update_kpi_temp, this.temp_cms_data);
        }


        this.initPieChart();
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  initPieChart() {
    this.pie_data_list = [
      {
        "name": "已出租",
        "value": this.booked_car_list.length
      },
      {
        "name": "待出租",
        "value": this.available_car_list.length
      },
      {
        "name": "已預留",
        "value": this.blocked_maintaining_car_list.length
      },
      {
        "name": "已預留(維修)",
        "value": this.blocked_car_list.length
      }
    ];
  }

  getDataForCalendar(start_date, end_date, get_vacancy: boolean) {
    let send_data = {
      start_date: start_date,
      end_date: end_date,
      admin_id: this.authService.getParsedAdminToken().id,
      admin_type: this.authService.getParsedAdminToken().type
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_car_data_and_order_data_for_cms_home_calendar, send_data, true).then(async (res: Response) => {
      console.log(res);
      if (res.result == "success") {

        let calendar_data_list = res.data;//.filter(data => (data.disabled ==false && data.status != undefined && data.status != "refunded"));

        let user_id_list = calendar_data_list.filter(d => d.hasOwnProperty('user_id')).map(d => d.user_id);

        const get_user_data_list: Response = await this.dataService.getAllDataByDataTypeAndIdList(DATA_TYPE.USER_DATA, user_id_list);
        if (get_user_data_list.result == 'success') {
          for (let index = 0; index < calendar_data_list.length; index++) {
            if (calendar_data_list[index].hasOwnProperty('user_id')) {
              calendar_data_list[index]['user_data'] = get_user_data_list.data.find(d => d.id == calendar_data_list[index].user_id);
            }
          }
        }
        // console.log("calendar_data_list: ", calendar_data_list);

        if (get_vacancy) {
          const get_vacant_car_data_list_for_coming_n_days_for_cms: Response = await this.dataService.getVacantCarDataListForComingNDaysForCms();
          console.log(get_vacant_car_data_list_for_coming_n_days_for_cms);
          if (get_vacant_car_data_list_for_coming_n_days_for_cms.result == 'success') {
            this.vacancy_list = get_vacant_car_data_list_for_coming_n_days_for_cms.data;
          }
        }

        this.eventSource = this.AddEventToCalendar(calendar_data_list);
        this.commonService.isLoading = false;
      } else {
        this.commonService.openErrorSnackBar();
        this.commonService.isLoading = false;
      }
    }, err => {
      this.commonService.openErrorSnackBar();
      this.commonService.isLoading = false;
    });
  }

  getVacancyCarDataList() {

    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m, 1)).split('T')[0];
    let lastDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m + 1, 0)).split('T')[0];
    this.getDataForCalendar(firstDay, lastDay, true);

  }

  AddEventToCalendar(calendar_data_list) {
    let events = [];
    // console.log(this.calendar_data_list.map(d => d.data_type));
    calendar_data_list.forEach(element => {
      // console.log("calendar_data: ", element);
      switch (element.data_type) {
        case 'order_data': {
          events.push({
            title: '取車',
            startTime: new Date(`${element.start_date}T${element.pick_up_data.time}:00`),
            endTime: new Date(`${element.start_date}T${element.pick_up_data.time}:00`),
            allDay: false,
            color: "#F2C828",
            car_id: element?.car_data?.id,
            car_model: element?.car_data?.model,
            car_plate: element?.car_data?.plate,
            car_cover_img_url: element?.car_data?.cover_img_url_list[0],
            order_id: element.id,
            zh_full_name: element?.user_data?.zh_full_name,
            time: element.pick_up_data.time,
            address: element.pick_up_data.address
          });
          // console.log("Element",element);
          events.push({
            title: '還車',
            startTime: new Date(`${element.end_date}T${element.return_data.time}:00`),
            endTime: new Date(`${element.end_date}T${element.return_data.time}:00`),
            allDay: false,
            color: "#43A5D1",
            car_id: element?.car_data?.id,
            car_model: element?.car_data?.model,
            car_plate: element?.car_data?.plate,
            car_cover_img_url: element?.car_data?.cover_img_url_list[0],
            order_id: element.id,
            zh_full_name: element?.user_data?.zh_full_name,
            time: element.return_data.time,
            address: element.return_data.address
          });
          break;
        }
        case 'car_data': {
          events.push({
            title: '文件到期(保險)',
            startTime: new Date(`${element.insurance_expiry_date.split('T')[0]}T00:00:00`),
            endTime: new Date(`${element.insurance_expiry_date.split('T')[0]}T00:00:00`),
            allDay: false,
            color: "#F7688F",
            car_id: element.id,
            car_model: element?.model,
            car_plate: element?.plate,
            car_cover_img_url: element?.cover_img_url_list[0],
          });
          events.push({
            title: '文件到期(車牌)',
            startTime: new Date(`${element.car_licence_expiry_date.split('T')[0]}T00:00:00`),
            endTime: new Date(`${element.car_licence_expiry_date.split('T')[0]}T00:00:00`),
            allDay: false,
            color: "#F7688F",
            car_id: element.id,
            car_model: element?.model,
            car_plate: element?.plate,
            car_cover_img_url: element?.cover_img_url_list[0],
          });
          break;
        }

        case 'deposit_data': {
          events.push({
            title: '估計按金退還日',
            startTime: new Date(`${element.estimated_refund_date.split('T')[0]}T00:00:00`),
            endTime: new Date(`${element.estimated_refund_date.split('T')[0]}T00:00:00`),
            allDay: false,
            color: "#74D143",
            deposit_id: element.id,
            user_data: element?.user_data,
            amount: element.amount
          });
          break;
        }

        case 'payment_data': {
          events.push({
            title: '待繳租金到期日',
            startTime: new Date(`${element.expiry_date.split('T')[0]}T00:00:00`),
            endTime: new Date(`${element.expiry_date.split('T')[0]}T00:00:00`),
            allDay: false,
            color: "#95601f",
            car_id: element?.car_data?.id,
            car_model: element?.car_data?.model,
            car_plate: element?.car_data?.plate,
            car_cover_img_url: element?.car_data?.cover_img_url_list[0],
            order_id: element?.order_id,
            total_amount: element?.total_amount
          });
          break;
        }

        case 'car_viewing_data': {
          events.push({
            title: '預約睇車',
            startTime: new Date(`${element.appointment_datetime}`),
            endTime: new Date(`${element.appointment_datetime}`),
            allDay: false,
            color: "#7000a4",
            car_viewing_id: element.id,
            car_model: element?.car_data?.model,
            car_plate: element?.car_data?.plate,
            car_cover_img_url: element?.car_data?.cover_img_url_list[0],
            user_data: element?.user_data,
            appointment_datetime: element?.appointment_datetime,
          });
          break;
        }

        default:
          break;
      }
    });

    if (this.vacancy_list != null) {
      this.vacancy_list.forEach(element => {
        // element['vacant_car_data_list'].forEach(car_data => {
        //   events.push({
        //     title: '空置車輛',
        //     startTime: new Date(`${element.date}T00:00:00`),
        //     endTime: new Date(`${element.date}T00:00:00`),
        //     allDay: false,
        //     color: "#000000",
        //     car_id: car_data.id,
        //     car_model: car_data?.model,
        //     car_plate: car_data?.plate,
        //     car_cover_img_url: car_data?.cover_img_url_list[0]
        //   });
        // });
        events.push({
          title: '空置車輛',
          startTime: new Date(`${element.date}T00:00:00`),
          endTime: new Date(`${element.date}T00:00:00`),
          allDay: false,
          color: "#000000",
          vacant_car_data_list: element.vacant_car_data_list
        });
      });
    }

    // console.log(events);
    return events;
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    // console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  changeMonth(ev) {
    // console.log(this.current_year_month.split('-')[0]);
    // console.log(this.current_year_month.split('-')[1] - 1);
    // console.log(new Date(this.current_year_month.split('-')[0], this.current_year_month.split('-')[1] - 1, 1));
    if (this.current_year_month != null) {
      let this_year_month = `${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1)).slice(-2)}`;
      if (this.current_year_month == this_year_month) {
        this.calendar.currentDate = new Date(this.current_year_month.split('-')[0], this.current_year_month.split('-')[1] - 1, new Date().getDate());
      }
      else {
        this.calendar.currentDate = new Date(this.current_year_month.split('-')[0], this.current_year_month.split('-')[1] - 1, 1);
      }
    }

    let date = new Date(this.current_year_month + '-01T00:00:00'), y = date.getFullYear(), m = date.getMonth();
    let firstDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m, 1)).split('T')[0];
    let lastDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m + 1, 0)).split('T')[0];
    // console.log(firstDay);
    // console.log(lastDay);
    this.getDataForCalendar(firstDay, lastDay, false);
  }

  onTimeSelected(ev) {
    if (this.onTimeSelectedFirst) {
      // console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
      // console.log(ev);

      let current_year_month = this.commonService.GetDateTimeMatchBackendFormat(new Date(ev.selectedTime)).substring(0, 7);

      if (this.current_year_month != current_year_month) {
        this.current_year_month = current_year_month;
        let date = new Date(ev.selectedTime), y = date.getFullYear(), m = date.getMonth();
        let firstDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m, 1)).split('T')[0];
        let lastDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m + 1, 0)).split('T')[0];
        this.getDataForCalendar(firstDay, lastDay, false);
      }

      this.selected_date = ev.selectedTime;
      this.selected_date_event_list = ev.events;
      // console.log("SELECTED date event",this.selected_date_event_list);
    } else {
      // console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
      // console.log(ev);

      let current_year_month = this.commonService.GetDateTimeMatchBackendFormat(new Date(ev.selectedTime)).substring(0, 7);

      if (this.current_year_month != current_year_month) {
        this.current_year_month = current_year_month;
        let date = new Date(ev.selectedTime), y = date.getFullYear(), m = date.getMonth();
        let firstDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m, 1)).split('T')[0];
        let lastDay = this.commonService.GetDateTimeMatchBackendFormat(new Date(y, m + 1, 0)).split('T')[0];
        // this.getDataForCalendar(firstDay, lastDay);
      }

      this.selected_date = ev.selectedTime;
      this.selected_date_event_list = ev.events;
      // console.log("SELECTED date event",this.selected_date_event_list);
      this.onTimeSelectedFirst = true;
    }
  }

  getOrderNameById(id) {
    let send_data = {
      order_id: id
    }
    // console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_order_data_with_all_other_data_by_order_id, send_data).then((res: Response) => {
      // console.log("ORDER NAME",res.data);
      if (res.result == "success") {
        // this.order_data = JSON.parse(JSON.stringify(res.data));
        // this.checking_order_data = JSON.parse(JSON.stringify(res.data));
        // console.log("ORDER NAME",res.data);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
    return "Anson";
  }
  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
    // console.log(event);
  }

  onRangeChanged(ev) {
    // console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  };


  getCarDataList() {
    this.dataService.resetTableData();

    let send_data = {
      sorting: "create_date",
      direction: "DESC",
      limit: 100,
      page: 1,
      today_status: true,
      sold: false,
      field_list: ['id', 'data_type', 'disabled', 'sold', 'brand', 'model', 'plate']
    }
    this.apiService.postFromServer(ApiPath.get_car_data_and_total_number_by_sorting_and_limit_or_search, send_data).then((res: Response) => {

      console.log(res.data);
      if (res.result == 'success') {

        this.original_car_data_list = JSON.parse(JSON.stringify(res.data.item_list.filter(d => (!d.disabled && !d.sold))));
        this.display_car_data_list = JSON.parse(JSON.stringify(res.data.item_list.filter(d => (!d.disabled && !d.sold))));

        // console.log( this.original_car_data_list.filter(d => (d.today_status == 'booked' && !d.disabled && !d.sold)).length);
        // this.occupancy_rate = this.original_car_data_list.filter(d => (d.today_status == 'booked')).length / this.original_car_data_list.filter(d => (d.today_status != 'blocked_maintaining')).length;


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
    this.current_year_month = (this.date.value.format('YYYY-MM'));
    datepicker.close();

    this.changeMonth(null);

  }


  slidePrev() {
    this.current_year_month = this.commonService.ToBackendDateTimeString(new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth() - 1, 1)).substring(0, 7);
    this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth() - 1, 1);
    this.changeMonth(null);
  }

  slideNext() {
    this.current_year_month = this.commonService.ToBackendDateTimeString(new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth() + 1, 1)).substring(0, 7);
    this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth() + 1, 1);
    this.changeMonth(null);
  }

}
