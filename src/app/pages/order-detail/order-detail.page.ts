import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { IonSelect, IonSlides, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AdminData, AdminType, CarData, ParkingData, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
// import { runInThisContext } from 'vm';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY',
        },
      }
    },
  ]
})
export class OrderDetailPage implements OnInit {
  admin_data$: Observable<AdminData> = this.auth.adminData.pipe();

  order_id = null;
  order_data = null;
  checking_order_data = null;
  all_admin_data_list = null;
  admin_data = null;

  extend_days = 0;

  upload_type = null;

  readonly = true;

  other_doc_file_name = "";

  all_parking_data_list$: Observable<ParkingData[]> = this.dataService.parking_data_list$.pipe();

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();

  hong_kong_island_custom_pick_up_charge = null;
  kowloon_custom_pick_up_charge = null;
  new_territories_custom_pick_up_charge = null;

  customOptions = {
    // header: '',
    subHeader: '更改車輛只影響車輛租金數據計算，並不影響車輛租用狀態！',
    message: '如需轉車，必需同時為新車進行“禁止預約“！',
    translucent: true,
  };

  today = this.commonService.ToBackendDateTimeString(new Date()).split('T')[0];

  show_br_url: boolean = false;
  show_identity_card_url: boolean = false;
  show_driving_license_url: boolean = false;
  show_address_proof_url: boolean = false;

  second_driver_phone = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('[23456789][0-9]{7}')]);

  second_driver_user_data: UserData = null;

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  @ViewChild('slider', { static: false }) slider: IonSlides;
  @ViewChildren('select') selectGroup: QueryList<IonSelect>;
  public get adminType(): typeof AdminType {
    return AdminType;
  }
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      if (params) {
        if (params && params.order_id) {
          this.order_id = parseInt(params.order_id);
        }
      }
    });
  }

  async ngOnInit() {
    if (this.order_id != null && this.order_id != '') {
      this.getOrderData();
      await this.dataService.getSystemData();
      this.dataService.getAllParkingData();
      if (this.dataService.car_data_list$.value == null){
        this.dataService.getAllCarData();
      }

    }
    else {
    }

    this.hong_kong_island_custom_pick_up_charge = this.dataService.system_data$.value.hong_kong_island_custom_pick_up_charge;
    this.kowloon_custom_pick_up_charge = this.dataService.system_data$.value.kowloon_custom_pick_up_charge;
    this.new_territories_custom_pick_up_charge = this.dataService.system_data$.value.new_territories_custom_pick_up_charge;
  }

  ionViewDidEnter(){

  }

  getAllStaffData() {
    let send_data = {
      data_type: "admin_data",
      disabled: false
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.all_admin_data_list = res.data;
        if (this.order_data.staff_in_charge != undefined && this.order_data.staff_in_charge != null && this.order_data.staff_in_charge != -1) {
          this.admin_data = this.all_admin_data_list.find(data => data.id == this.order_data.staff_in_charge);
        }
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  searchStaff(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    event.component.items = this.all_admin_data_list.filter(car => {
      return car.id.toString().toLowerCase().indexOf(text) !== -1 ||
        car.username.toLowerCase().indexOf(text) !== -1;
    });
    event.component.endSearch();

  }

  selectStaff(ev) {
    // console.log(ev);
    // console.log(this.order_data);
    this.order_data.staff_in_charge = this.admin_data.id;
  }


  getOrderData() {
    let send_data = {
      order_id: this.order_id
    }
    this.apiService.postFromServer(ApiPath.get_order_data_with_all_other_data_by_order_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        console.log("order_data: ", res.data);
        this.order_data = JSON.parse(JSON.stringify(res.data));
        this.checking_order_data = JSON.parse(JSON.stringify(res.data));
        this.getAllStaffData();
        if (this.order_data.second_driver_user_id != null){
          this.getSecondDriverUserData();
        }
        console.log(this.order_data.payment_data_list.map(d => d.id));
        setTimeout(() => {
          this.slider.lockSwipes(true);
        }, 500);
        this.dataService.getAwaitingApplicationDepositAmountAndCreateDateByUserId(this.order_data.user_id);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  triggerImgUpload(type) {
    if (this.upload_img == null) {
      return;
    }
    this.upload_type = type;
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
        const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
        this.commonService.isLoading = false;
        if (upload_base64_to_server.result == "success") {
          switch (this.upload_type) {

            case 'contract_url':
              this.order_data.contract_url = upload_base64_to_server.data;
              break;

            case 'other_doc_url_list':
              this.order_data.other_doc_url_list.unshift({
                name: this.other_doc_file_name,
                url: upload_base64_to_server.data,
                upload_date: this.commonService.GetDateTimeMatchBackendFormat(new Date())
              });
              this.other_doc_file_name = "";
              break;

            default:
              break;
          }
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  save() {
    let send_data = {
      id: this.order_data.id
    }

    if (Number(this.order_data.pick_up_data.time.split(':')[0]) < this.order_data.return_data.time.split(':')[0]){
      return this.commonService.openErrorSnackBar("還車時間不得遲於取車時間");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.order_data, this.checking_order_data);
    
    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_order_handler, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.getOrderData();
        this.commonService.openSnackBar("已更新資料", null, 1000);
        if (send_data.hasOwnProperty('status')) {
          setTimeout(() => {
            this.commonService.openSnackBar("如有需要請更新帳單狀態！");
          }, 1000);
        }
      } else {
        this.commonService.openErrorSnackBar("未能更新資料");
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  disabledChange(ev) {
    this.order_data.disabled = !ev.detail.checked;
  }


  generateContract() {
    this.commonService.isLoading = true;
    let send_data = {
      'order_id': this.order_data.id,
    }
    this.apiService.postFromServer(ApiPath.generate_confirmation_pdf_by_order_id, send_data, true).then((res: Response) => {

      if (res.result == "success") {
        this.order_data.contract_url = res.data;
        this.checking_order_data.contract_url = res.data;
        this.commonService.openSnackBar("已產生Contract");
        this.commonService?.openPage(this.order_data.contract_url, true, true);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  districtChange(ev, pick_up) {
    if (pick_up) {
      this.order_data.pick_up_data.district = ev.detail.value;
    }
    else {
      this.order_data.return_data.district = ev.detail.value;
    }
    switch (ev.detail.value) {
      case "香港":
        if (pick_up) {
          this.order_data.pick_up_data.charge = this.hong_kong_island_custom_pick_up_charge;
        }
        else {
          this.order_data.return_data.charge = this.hong_kong_island_custom_pick_up_charge;
        }
        break;
      case "九龍":
        if (pick_up) {
          this.order_data.pick_up_data.charge = this.kowloon_custom_pick_up_charge;
        }
        else {
          this.order_data.return_data.charge = this.kowloon_custom_pick_up_charge;
        }
        break;
      case "新界":
        if (pick_up) {
          this.order_data.pick_up_data.charge = this.new_territories_custom_pick_up_charge;
        }
        else {
          this.order_data.return_data.charge = this.new_territories_custom_pick_up_charge;
        }
        break;

      default:
        break;
    }


  }

  pickUpOrReturnSelectParking(ev, type: 'pick_up' | 'return'){
    console.log(ev);
    let parking_id = ev.detail.value;
    if (parking_id == ''){
      if (type == 'pick_up'){
        this.order_data.pick_up_data.parking_id = null;
        this.order_data.pick_up_data.address = '';
      }
      else if (type == 'return'){
        this.order_data.return_data.parking_id = null;
        this.order_data.return_data.address = '';
      }
    }
    else{
      if (type == 'pick_up'){
        this.order_data.pick_up_data.charge = '';
        this.order_data.pick_up_data.district = '';
        this.order_data.pick_up_data.address = this.dataService.parking_data_list$.value.find(d => d.id == parking_id).zh_address;
      }
      else if (type == 'return'){
        this.order_data.return_data.charge = '';
        this.order_data.return_data.district = '';
        this.order_data.return_data.address = this.dataService.parking_data_list$.value.find(d => d.id == parking_id).zh_address;
      }
    }
  }

  selectionDateChanged(field, date: HTMLInputElement) {
    if (date.value != null && date.value != '' && date.value != null && date.value != '') {
      this.order_data[field] = date.value.substring(0, 10);
    }
  }

  async extendOrder() {
    if (this.extend_days <= 0) {
      return;
    }
    const make_extend_order_result: Response = await this.dataService.makeExtendOrder(this.order_data.id, this.extend_days);
    if (make_extend_order_result.result == 'success'){
      this.commonService.isLoading = true;
      this.commonService.openSnackBar("續約成功");
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }
  }

  goSlide(index){
    this.slider.lockSwipes(false);
    this.slider.slideTo(index);
    this.slider.lockSwipes(true);
  }

  changePaymentCarSelectinoTrigger(index){
    // let element: ElementRef = this.content.getNativeElement();
    // let select = element.querySelector('#select'+index);
    // select.click(); 
    this.selectGroup.forEach((element, i) => {
  
      if (index == i){
        // console.log(index);
        // console.log(element.value);
        let payment_id = element.value;
        element.open().then(res => {
          console.log(res);
        });
        
      }
    });
  }

  changePaymentCar($ev, payment_id){
    let new_car_id = $ev.detail.value;
    this.updatePaymentData(new_car_id, payment_id);
  }

  updatePaymentData(car_id, payment_id) {
    let send_data = {
      'id': payment_id,
      'car_id': car_id
    }

    this.apiService.postFromServer(ApiPath.update_payment_handler, send_data, true).then((res: Response) => {

      if (res.result == "success") {
        window.location.reload();
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  async getSecondDriverUserData() {
    const get_user_data_result: Response = await this.dataService.getUserDataById(this.order_data.second_driver_user_id);
    // console.log(get_user_data_result);
    if (get_user_data_result.result == 'success') {
      this.second_driver_user_data = get_user_data_result.data;
      console.log("second driver: ", this.second_driver_user_data);
    }
  }

  async searchSecondDriver(){
    if (this.second_driver_phone.invalid || this.order_data.user_data == null){
      return this.commonService.openErrorSnackBar();
    }
    const validate_second_driver: Response = await this.dataService.secondDriverValidation(this.order_data.user_data.phone, this.second_driver_phone.value);
    if (validate_second_driver.result == 'success'){
      this.order_data.second_driver_user_id = validate_second_driver.data.user_id;
      this.getSecondDriverUserData();
      this.second_driver_phone.reset();
    }
  }

}
