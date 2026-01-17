import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AppointmentData, AppointmentStatus, CarData, DATA_TYPE, FactoryData, UserData } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.page.html',
  styleUrls: ['./appointment-detail.page.scss'],
})
export class AppointmentDetailPage implements OnInit {

  appointment_id = null;
  car_id = null;

  appointment_data: AppointmentData = null;
  checking_appointment_data = null;

  admin_data = null;

  upload_type = null;

  readonly = true;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();;
  all_maintenance_data_list = null;
  all_factory_data_list$: Observable<FactoryData[]> = this.dataService.factory_data_list$.pipe();
  appliable_factory_data_list = null;

  selected_maintenance_data = null;
  selected_children_maintenance_category_list = null;

  stepHour = 1;
  stepMinute = 1;
  enableMeridian = false;
  showSeconds = false;

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  @ViewChild('ionSelectable') ionSelectable: IonicSelectableComponent;
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private location: Location,
    private cdf: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      if (params) {
        if (params && params.appointment_id) {
          this.appointment_id = parseInt(params.appointment_id);
        }
        if (params && params.car_id) {
          this.car_id = parseInt(params.car_id);
        }
      }
    });
  }

  async ngOnInit() {
    this.cdf.detectChanges();
    if (this.appointment_id != null) {
      this.getAppointmentData();
      if (this.dataService.user_data_list$.value == null) {
        this.dataService.getAllUserData();
      }
    }
    else {
      this.readonly = false;
      this.setNewAppointmentDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null) {
      await this.dataService.getAllCarData();
    }
    if (this.appointment_id == null && this.car_id != null) {
      this.appointment_data.car_id = this.car_id;
    }
    this.getAllMaintenanceData();
    this.getAllAdminData();


  }

  setNewAppointmentDataTemplate() {
    this.appointment_data = {
      "id": null,
      "data_type": DATA_TYPE.APPOINTMENT_DATA,
      "create_date": "",
      "disabled": false,
      "user_id": null,
      "admin_id": null,
      "order_id": null,
      "car_id": null,
      "maintenance_id": null,
      "factory_id": null,
      "factory_data": null,
      "appointment_datetime": "",
      "contact_name": "",
      "contact_phone": "",
      "remark": "",
      "status": AppointmentStatus.accepted,
      "type": "維修",
      "cost": null,
      "maintenance_category_id": null,
      "sub_maintenance_category_id": null,
      "img_url_list": []
    };
  }

  getAppointmentData() {
    let send_data = {
      id: this.appointment_id,
      data_type: "appointment_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        console.log("appointment_data: " ,res.data);
        this.appointment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_appointment_data = JSON.parse(JSON.stringify(res.data));

        this.getAllAdminData();
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getAllAdminData() {
    let send_data = {
      data_type: "admin_data",
      field_list: ["username", "phone", "email"]
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        if (this.appointment_data.id == null) {
          this.admin_data = res.data.find(d => d.id == this.auth.adminData.value.id);
        }
        else if (this.appointment_data.admin_id != null) {
          this.admin_data = res.data.find(d => d.id == this.appointment_data.admin_id);
        }
        console.log(this.admin_data);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getAllMaintenanceData() {
    let send_data = {
      data_type: "maintenance_data",
      disabled: false
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then(async (res: Response) => {
      console.log("maintenance_data: ", res.data);
      if (res.result == "success") {
        this.all_maintenance_data_list = res.data;
        this.getAllMaintenanceCategoryData();
        if (this.dataService.factory_data_list$.value == null){
          await this.dataService.getAllFactoryData();
          this.getApplicableFactoryDataList();
        }
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getAllMaintenanceCategoryData() {
    let send_data = {
      data_type: "maintenance_category_data",
      disabled: false
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {
      console.log("maintenance_category_data: ", res.data);
      if (res.result == "success") {
        let all_mainenance_category_data_list = res.data;

        this.all_maintenance_data_list.forEach(maintenance_data => {
          maintenance_data.maintenance_category_list.forEach(maintenance_category => {
            maintenance_category['maintenance_category_data'] = all_mainenance_category_data_list.find(d => d.id == maintenance_category.maintenance_category_id);
            for (let index = 0; index < maintenance_category.children.length; index++) {
              maintenance_category.children[index] = all_mainenance_category_data_list.find(d => d.id == maintenance_category.children[index]);
            }
          });
        });

        if (this.appointment_id != null) {
          setTimeout(() => {
            this.selected_maintenance_data = this.all_maintenance_data_list.filter(d => d.id == this.appointment_data.maintenance_id)[0];
            console.log(this.all_maintenance_data_list);
            console.log(this.selected_maintenance_data);
            setTimeout(() => {
              this.selected_children_maintenance_category_list = this.selected_maintenance_data.maintenance_category_list.find(d => d.maintenance_category_id == this.appointment_data.maintenance_category_id).children;
            }, 300);
          }, 300);
        }


      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getApplicableFactoryDataList() {
    this.selected_maintenance_data = this.all_maintenance_data_list.filter(d => d.id == this.appointment_data.maintenance_id)[0];
    if (this.selected_maintenance_data != null) {
      this.appliable_factory_data_list = this.dataService.factory_data_list$.value.filter(d => this.selected_maintenance_data.appliable_factory_id_list.includes(d.id));
    }
    console.log(this.selected_maintenance_data);
  }


  save() {
    let send_data = {
      id: this.appointment_data.id
    }
    // if (this.appointment_data.user_id == undefined || this.appointment_data.user_id == null || this.appointment_data.user_id == '') {
    //   return this.commonService.openErrorSnackBar("必須選擇用戶");
    // }
    if (this.appointment_data.maintenance_id == undefined || this.appointment_data.maintenance_id == null) {
      return this.commonService.openErrorSnackBar("必須選擇維修項目");
    }
    if (this.appointment_data.factory_id == undefined || this.appointment_data.factory_id == null) {
      return this.commonService.openErrorSnackBar("必須選擇車房");
    }
    if (this.appointment_data.car_id == undefined || this.appointment_data.car_id == null) {
      return this.commonService.openErrorSnackBar("必須選擇車輛");
    }
    if (this.appointment_data.appointment_datetime == undefined || this.appointment_data.appointment_datetime == null || this.appointment_data.appointment_datetime == '') {
      return this.commonService.openErrorSnackBar("必須預約日期時間");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.appointment_data, this.checking_appointment_data);


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }
    this.apiService.postFromServer(ApiPath.update_appointment_handler, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.readonly = true;
        this.appointment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_appointment_data = JSON.parse(JSON.stringify(res.data));
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

  createNewAppointment() {

    // if (this.appointment_data.user_id == undefined || this.appointment_data.user_id == null || this.appointment_data.user_id == '') {
    //   return this.commonService.openErrorSnackBar("必須選擇用戶");
    // }
    this.appointment_data.admin_id = this.auth.adminData.value.id;

    if (this.appointment_data.maintenance_id == undefined || this.appointment_data.maintenance_id == null) {
      return this.commonService.openErrorSnackBar("必須選擇維修項目");
    }
    if (this.appointment_data.factory_id == undefined || this.appointment_data.factory_id == null) {
      return this.commonService.openErrorSnackBar("必須選擇車房");
    }
    if (this.appointment_data.appointment_datetime == undefined || this.appointment_data.appointment_datetime == null || this.appointment_data.appointment_datetime == '') {
      return this.commonService.openErrorSnackBar("必須預約日期時間");
    }
    if (this.selected_maintenance_data.maintenance_category_list.length > 0) {
      if (this.appointment_data.maintenance_category_id == undefined || this.appointment_data.appointment_datetime == null) {
        return this.commonService.openErrorSnackBar("必須選擇維修分類");
      }
    }

    if (this.appointment_data.factory_id != null){
      this.appointment_data.factory_data = this.appliable_factory_data_list.find(d => d.id == this.appointment_data.factory_id);
    }


    this.apiService.postFromServer(ApiPath.make_appointment, this.appointment_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.appointment_id = res.data.id;
        this.appointment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_appointment_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/appointment-detail?appointment_id=' + res.data.id);
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
        this.commonService.isLoading = true;
        const upload_base64_to_server: any = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
        this.commonService.isLoading = false;
        if (upload_base64_to_server.result == "success") {
          if (this.appointment_data.hasOwnProperty('img_url_list')) {
            this.appointment_data.img_url_list.push(upload_base64_to_server.data);
          }
          else {
            this.appointment_data['img_url_list'] = [];
            this.appointment_data.img_url_list.push(upload_base64_to_server.data);
          }
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }


  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }




  searchMaintenance(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    event.component.items = this.all_maintenance_data_list.filter(maintenance => {
      return maintenance.id.toString().toLowerCase().indexOf(text) !== -1 ||
        maintenance.zh_service_name.toLowerCase().indexOf(text) !== -1 ||
        maintenance.en_name.toLowerCase().indexOf(text) !== -1 ||
        maintenance.phone.toLowerCase().indexOf(text) !== -1 ||
        maintenance.email.toLowerCase().indexOf(text) !== -1 ||
        maintenance.zh_address.toLowerCase().indexOf(text) !== -1 ||
        maintenance.en_address.toLowerCase().indexOf(text) !== -1
    });
    event.component.endSearch();

  }

  getMaintenanceDataById(id) {
    return this.all_maintenance_data_list != null ? this.all_maintenance_data_list.filter(d => d.id == id)[0] : null;
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  maintenanceChange(ev) {
    console.log(ev);
    this.getApplicableFactoryDataList();
  }

  searchFactory(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    event.component.items = this.appliable_factory_data_list.filter(factory => {
      return factory.id.toString().toLowerCase().indexOf(text) !== -1 ||
        factory.zh_name.toLowerCase().indexOf(text) !== -1 ||
        factory.en_name.toLowerCase().indexOf(text) !== -1 ||
        factory.phone.toLowerCase().indexOf(text) !== -1 ||
        factory.email.toLowerCase().indexOf(text) !== -1 ||
        factory.zh_address.toLowerCase().indexOf(text) !== -1 ||
        factory.en_address.toLowerCase().indexOf(text) !== -1
    });
    event.component.endSearch();

  }

  getFactoryDataById(id) {
    return this.dataService.factory_data_list$.value != null ? this.dataService.factory_data_list$.value.filter(d => d.id == id)[0] : null;
  }


  async appointmentDatetimeChange(e) {
    // console.log(e.value);
    this.appointment_data.appointment_datetime = this.commonService.GetDateTimeMatchBackendFormat(new Date(e.value));
    // console.log(this.appointment_data.appointment_datetime);

    let day = new Date(this.appointment_data.appointment_datetime.split('T')[0]).getDay();
    if (this.appointment_data.factory_id != null){
      if (this.appointment_data.factory_data.working_hour_list.filter(d => d.day == day)[0].allow_booking == false){
        return this.commonService.openErrorSnackBar("此日期不可以預約");
      }
      const get_number_of_appointment_data: Response = await this.dataService.getNumberOfAppointmentDataByFactoryIdAndAppointmentDate(this.appointment_data.factory_id, this.appointment_data.appointment_datetime.split('T')[0]);
      if (get_number_of_appointment_data.result == 'success'){
        if (get_number_of_appointment_data.data >= this.appointment_data.factory_data.working_hour_list.filter(d => d.day == day)[0].quota){
          return this.commonService.openErrorSnackBar("此日期配額已滿");
        }
      }
    }

  }

  resetAppointmentDate() {
    this.appointment_data.appointment_datetime = '';
  }

  changeUser(ev) {
    // console.log(ev.value);
    if (ev.value != null) {
      this.appointment_data.contact_name = this.dataService.user_data_list$.value.find(d => d.id == ev.value).zh_full_name;
      this.appointment_data.contact_phone = this.dataService.user_data_list$.value.find(d => d.id == ev.value).phone;
    }
    else {
      this.appointment_data.contact_name = "";
      this.appointment_data.contact_phone = "";
    }

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

  maintenanceCategoryChange($event) {
    // console.log($event);
    this.selected_children_maintenance_category_list = null;
    setTimeout(() => {
      this.selected_children_maintenance_category_list = this.selected_maintenance_data.maintenance_category_list.find(d => d.maintenance_category_id == this.appointment_data.maintenance_category_id).children;
    }, 200);
  }

  changeFactory(ev) {
    console.log(ev.value);
    this.appointment_data.factory_data = this.dataService.factory_data_list$.value.find(d => d.id == ev.value);
  }

}
