import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AdminData, Authority, BlockingData, CarData, DATA_TYPE, UserData } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blocking',
  templateUrl: './blocking.page.html',
  styleUrls: ['./blocking.page.scss'],
})
export class BlockingPage implements OnInit {

  car_id = null;
  car_data = null;
  disabled: boolean = false;
  visible: boolean = true;

  date = this.commonService.GetNthDaysBefore(this.commonService.ToBackendDateTimeString(new Date()), 7).split('T')[0];

  rentable_car_data_list$: Observable<CarData[]> = this.dataService.rentable_car_data_list$.pipe();

  blocking_data: BlockingData = null;
  checking_blocking_data: BlockingData = null;

  blocking_data_list: BlockingData[] = null;
  display_blocking_data_list: BlockingData[] = null;
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();;

  optionsSingle: CalendarComponentOptions = {
    pickMode: 'multi',
    color: "secondary",
  };

  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
    color: "secondary",
  };

  calendar_mode = "single";
  display_past_date = false;

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  @ViewChild('ionSelectable') ionSelectable: IonicSelectableComponent;
  public get authority(): typeof Authority {
    return Authority;
  }
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private location: Location
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params) {
        if (params && params.car_id) {
          this.car_id = parseInt(params.car_id);
        }
      }
    });
  }

  async ngOnInit() {
    if (this.dataService.car_data_list$.value == null) {
      let field_list = ['id', 'cover_img_url_list', 'brand', 'model', 'plate'];
      await this.dataService.getAllCarData(field_list);
      if (this.car_id != null) {
        this.car_data = this.dataService.car_data_list$.value.filter(d => d.id == this.car_id)[0];
      }
    }
    this.getAllBlockingData();
    if (this.dataService.user_data_list$.value == null) {
      this.dataService.getAllUserData();
    }
    this.setNewBlockingDataTemplate();
  }

  setNewBlockingDataTemplate() {
    this.blocking_data = {
      "id": null,
      "data_type": DATA_TYPE.BLOCKING_DATA,
      "create_date": "",
      "disabled": false,
      "visible": true,
      "car_id": null,
      "booking_date_list": [],
      "remark": "",
      "excluded_user_id_list": [],
      is_maintaining: false
    };
  }

  getAllBlockingData() {
    let send_data = {
      visible: this.visible,
    }
    if (this.car_data && this.car_data != null) {
      send_data['car_id'] = this.car_data.id;
    }
    if (this.disabled != null) {
      send_data['disabled'] = this.disabled;
    }
    if (this.date != "") {
      send_data['date'] = this.date;
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_all_blocking_data, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.blocking_data_list = res.data;
        this.display_blocking_data_list = res.data;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  carChange(ev) {
    console.log(ev);
    let new_path = ev.value != null ? `/blocking?car_id=${this.car_data.id}` : `/blocking`;
    if (this.location.path() != new_path) {
      this.location.replaceState(new_path);
    }
    this.getAllBlockingData();
  }

  onDateRangeChange($event) {
    console.log($event);
    let start_date = $event.from;
    let end_date = $event.to;
    this.generateAllBookingDateToList(start_date, end_date);
    // let start_date = this.commonService.ToBackendDateTimeString(new Date($event.from.toDate())).split('T')[0];
    // let end_date = this.commonService.ToBackendDateTimeString(new Date($event.to.toDate())).split('T')[0];
  }

  generateAllBookingDateToList(start_date, end_date): Promise<any> {
    return new Promise((resolve, reject) => {
      let day = 1000 * 60 * 60 * 24;
      let diff = (new Date(end_date).getTime() - new Date(start_date).getTime()) / day;
      // console.log(diff);
      for (let i = 0; i <= diff; i++) {
        let xx = new Date(start_date).getTime() + day * i;
        let yy = new Date(xx);
        let date = yy.getFullYear() + "-" + ('0' + (yy.getMonth() + 1)).slice(-2) + "-" + ('0' + (yy.getDate())).slice(-2);
        if (!this.blocking_data.booking_date_list.includes(date)) {
          this.blocking_data.booking_date_list.push(date);
        }
      }
      resolve('completed');
    });
  }

  onChange(ev) {
    console.log(ev);
    if (ev.detail.checked == true) {
      this.calendar_mode = "range";
    }
    else {
      this.calendar_mode = "single";
    }
  }



  createNewBlocking() {

    if (this.car_data == null || this.car_data == '') {
      return this.commonService.openErrorSnackBar("請先選擇車輛");
    }

    this.blocking_data.car_id = this.car_data.id;

    if (this.blocking_data.remark == null || this.blocking_data.remark == '' || !this.blocking_data.remark.replace(/\s/g, '').length) {
      return this.commonService.openErrorSnackBar("必須輸入備注");
    }
    if (this.blocking_data.booking_date_list.length <= 0) {
      return this.commonService.openErrorSnackBar("必須至少選擇一個日期");
    }
    this.blocking_data.booking_date_list = this.blocking_data.booking_date_list.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    this.apiService.postFromServer(ApiPath.new_blocking, this.blocking_data, true).then((res: Response) => {
      if (res.result == "success") {

        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.setNewBlockingDataTemplate();
          this.getAllBlockingData();
        }, 1000);
      } else {
        switch (true) {

          default:
            this.commonService.openErrorSnackBar("未能建立資料");
            break;
        }

      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  save() {

    if (this.blocking_data.remark == null || this.blocking_data.remark == '' || !this.blocking_data.remark.replace(/\s/g, '').length) {
      return this.commonService.openErrorSnackBar("必須輸入備注");
    }
    if (this.blocking_data.booking_date_list.length <= 0) {
      return this.commonService.openErrorSnackBar("必須至少選擇一個日期");
    }
    this.blocking_data.booking_date_list = this.blocking_data.booking_date_list.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let send_data = {
      id: this.blocking_data.id
    }
    send_data = this.commonService.updateDataChecker(send_data, this.blocking_data, this.checking_blocking_data);
    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_blocking, this.blocking_data, true).then((res: Response) => {

      console.log(res);
      if (res.result == "success") {

        this.commonService.openSnackBar("已更新資料");
        this.commonService.isLoading = true;
        setTimeout(() => {
          this.setNewBlockingDataTemplate();
          this.getAllBlockingData();
          this.commonService.isLoading = false;
        }, 1000);
      } else {
        switch (true) {

          default:
            this.commonService.openErrorSnackBar("未能更新資料");
            break;
        }

      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  editBlocking(blocking_data) {
    this.blocking_data = JSON.parse(JSON.stringify(blocking_data));
    this.checking_blocking_data = JSON.parse(JSON.stringify(blocking_data));

    let new_path = `/blocking?car_id=${this.blocking_data.car_id}`;
    if (this.location.path() != new_path) {
      this.location.replaceState(new_path);
    }

    this.car_data = this.dataService.car_data_list$.value.filter(d => d.id == this.blocking_data.car_id)[0];
  }

  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
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

  getDayDiff(startDate: string, endDate: string): number {
    const msInDay = 24 * 60 * 60 * 1000;

    return Math.round(
      Math.abs(Number(new Date(endDate)) - Number(new Date(startDate))) / msInDay
    );
  }

  showAll() {
    if (this.disabled != null) {
      this.disabled = null;
      this.date = '';
    }
    else {
      this.disabled = false;
      this.date = this.commonService.GetNthDaysBefore(this.commonService.ToBackendDateTimeString(new Date()), 7).split('T')[0];
    }
    this.getAllBlockingData();
  }

}
