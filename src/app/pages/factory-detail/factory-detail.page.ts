import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import { CarData } from 'src/app/schema';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-factory-detail',
  templateUrl: './factory-detail.page.html',
  styleUrls: ['./factory-detail.page.scss'],
})
export class FactoryDetailPage implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];

  factory_id = null;

  factory_data = null;
  checking_factory_data = null;

  upload_type = null;

  readonly = true;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe(
    map(
      (d: CarData[]) => {
        return d != null ? d.filter((c: CarData) => c.disabled == false && c.sold == false) : d;
      }
    )
  );

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
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
        if (params && params.factory_id) {
          this.factory_id = parseInt(params.factory_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.factory_id != null) {
      this.getFactoryData();
    }
    else {
      this.readonly = false;
      this.setNewFactoryDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
  }

  setNewFactoryDataTemplate() {
    this.factory_data = {
      "id": null,
      "data_type": "factory_data",
      "create_date": "",
      "disabled": false,
      "zh_name": "",
      "en_name": "",
      "phone_list": [],
      "email_list": [],
      "zh_address": "",
      "en_address": "",
      "latitude": "",
      "longitude": "",
      "cover_img_url_list": [],
      "working_hour_list": [
        {
          "day": 0,
          "allow_booking": false,
          "time": "",
          "quota": 0
        },
        {
          "day": 1,
          "allow_booking": false,
          "time": "",
          "quota": 0
        },
        {
          "day": 2,
          "allow_booking": false,
          "time": "",
          "quota": 0
        },
        {
          "day": 3,
          "allow_booking": false,
          "time": "",
          "quota": 0
        },
        {
          "day": 4,
          "allow_booking": false,
          "time": "",
          "quota": 0
        },
        {
          "day": 5,
          "allow_booking": false,
          "time": "",
          "quota": 0
        },
        {
          "day": 6,
          "allow_booking": false,
          "time": "",
          "quota": 0
        }
      ],
      admin_only: false,
      applicable_car_id_list: []
    };
  }

  getFactoryData() {
    let send_data = {
      id: this.factory_id,
      data_type: "factory_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.factory_data = JSON.parse(JSON.stringify(res.data));
        this.checking_factory_data = JSON.parse(JSON.stringify(res.data));
        console.log(this.factory_data);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.factory_data.id
    }
    if (this.factory_data.zh_name == undefined || this.factory_data.zh_name == null || this.factory_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文名");
    }
    if (this.factory_data.zh_address == undefined || this.factory_data.zh_address == null || this.factory_data.zh_address == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文地址");
    }

    if (JSON.stringify(this.factory_data.working_hour_list) != JSON.stringify(this.checking_factory_data.working_hour_list)) {
      if (this.factory_data.working_hour_list.filter(d => d.allow_booking && !this.commonService.validateHourMinuteWorkingHourStringFormat(d.time)).length > 0) {
        return this.commonService.openErrorSnackBar("營業時間格式不正確");
      }
      send_data['working_hour_list'] = this.factory_data.working_hour_list;
    }
    console.log(this.factory_data);
    send_data = this.commonService.updateDataChecker(send_data, this.factory_data, this.checking_factory_data);
    console.log(send_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_factory, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.factory_data = JSON.parse(JSON.stringify(res.data));
        this.checking_factory_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
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

  createNewFactory() {

    if (this.factory_data.working_hour_list.filter(d => d.allow_booking && !this.commonService.validateHourMinuteWorkingHourStringFormat(d.time)).length > 0) {
      return this.commonService.openErrorSnackBar("營業時間格式不正確");
    }

    if (this.factory_data.zh_name == undefined || this.factory_data.zh_name == null || this.factory_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文名");
    }
    if (this.factory_data.zh_address == undefined || this.factory_data.zh_address == null || this.factory_data.zh_address == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文地址");
    }

    this.apiService.postFromServer(ApiPath.new_factory, this.factory_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.factory_id = res.data.id;
        this.factory_data = JSON.parse(JSON.stringify(res.data));
        this.checking_factory_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/factory-detail?factory_id=' + res.data.id);
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


  triggerImgUpload() {
    if (this.upload_img == null) {
      return;
    }
    this.upload_img.nativeElement.click();
  }
  uploadImg() {
    if (this.upload_img == null || this.commonService.isLoading) {
      return;
    }
    const fileList: FileList = this.upload_img.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.commonService.firstFileToBase64(fileList[0]).then(async (base64: string) => {
        // console.log(base64);

        let send_data = {
          file_name: '',
          file_type: this.commonService.getFileType(fileList[0].type),
          base64: base64
        }
        const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
        if (upload_base64_to_server.result == "success") {
          this.factory_data.cover_img_url_list.push(upload_base64_to_server.data);
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }


  add(event: MatChipInputEvent,  type: 'email' | 'phone'): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      if (type == 'email'){
        this.factory_data.email_list.push(value);
      }
      else if (type == 'phone'){
        this.factory_data.phone_list.push(value);
      }
    }
    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }
  }

  remove(value: string, type: 'email' | 'phone'): void {

      if (type == 'email'){
        const index = this.factory_data.email_list.indexOf(value);
        if (index >= 0) {
          this.factory_data.email_list.splice(index, 1);
        }
      }
      else if (type == 'phone'){
        const index = this.factory_data.phone_list.indexOf(value);

        if (index >= 0) {
          this.factory_data.phone_list.splice(index, 1);
        }
      }
   
  }


  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

}
