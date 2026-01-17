import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AppointmentData, AppointmentStatus, CarData, CompensationPaymentStatus, CompensationPaymentData, DATA_TYPE, OrderData, UserData } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-compensation-payment-detail',
  templateUrl: './compensation-payment-detail.page.html',
  styleUrls: ['./compensation-payment-detail.page.scss'],
})
export class CompensationPaymentDetailPage implements OnInit {
  compensation_payment_id = null;

  compensation_payment_data: CompensationPaymentData = null;
  checking_compensation_payment_data: CompensationPaymentData = null;

  user_data: UserData = null;
  car_data: CarData = null;
  order_data: OrderData = null;

  readonly = true;

  send_quotation_created_notification: boolean = false;

  all_order_data_list: OrderData[] | any[] = null;

  public get compensationPaymentStatus(): typeof CompensationPaymentStatus {
    return CompensationPaymentStatus;
  }
  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private location: Location,
    private cdf: ChangeDetectorRef,
    private alertController: AlertController
  ) {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      if (params) {
        if (params && params.compensation_payment_id) {
          this.compensation_payment_id = parseInt(params.compensation_payment_id);
        }
      }
    });
  }

  async ngOnInit() {
    this.cdf.detectChanges();
    if (this.compensation_payment_id != null) {
      this.getCompensationData();
    }
    else {
      this.readonly = false;
      this.setNewCompensationPaymentDataTemplate();
      const get_order_data_list: Response = await this.dataService.getAllDataByDataTypeAndIdList(DATA_TYPE.ORDER_DATA, undefined, ['id', 'reference_number', 'start_date', 'end_date', 'car_id', 'user_id'], 'id', 'DESC');
      if (get_order_data_list.result == 'success') {
        this.all_order_data_list = get_order_data_list.data;
        let user_id_list: number[] = this.all_order_data_list.map(d => d.user_id);
        if (user_id_list.length > 0){
          const get_user_data_list: Response = await this.dataService.getAllDataByDataTypeAndIdList(DATA_TYPE.USER_DATA, user_id_list, ['id', 'zh_full_name', 'phone']);
          if (get_user_data_list.result == 'success'){
            for (let index = 0; index < this.all_order_data_list.length; index++) {
              this.all_order_data_list[index]['user_zh_full_name'] = get_user_data_list.data.find(d => d.id == this.all_order_data_list[index].user_id)?.zh_full_name;
              this.all_order_data_list[index]['user_phone'] = get_user_data_list.data.find(d => d.id == this.all_order_data_list[index].user_id)?.phone;
            }
          }
        }

        let car_id_list: number[] = this.all_order_data_list.map(d => d.car_id);
        if (car_id_list.length > 0){
          const get_car_data_list: Response = await this.dataService.getAllDataByDataTypeAndIdList(DATA_TYPE.CAR_DATA, car_id_list, ['id', 'model', 'brand', 'plate']);
          if (get_car_data_list.result == 'success'){
            for (let index = 0; index < this.all_order_data_list.length; index++) {
              this.all_order_data_list[index]['model'] = get_car_data_list.data.find(d => d.id == this.all_order_data_list[index].car_id)?.model;
              this.all_order_data_list[index]['brand'] = get_car_data_list.data.find(d => d.id == this.all_order_data_list[index].car_id)?.brand;
              this.all_order_data_list[index]['plate'] = get_car_data_list.data.find(d => d.id == this.all_order_data_list[index].car_id)?.plate;
            }
          }
        }
      }
      // this.setNewCompensationDataTemplate();
    }

  }

  setNewCompensationPaymentDataTemplate() {
    this.compensation_payment_data = {
      "id": null,
      "data_type": DATA_TYPE.COMPENSATION_PAYMENT_DATA,
      "create_date": "",
      "last_update_datetime": "",
      "disabled": false,
      "order_id": null,
      "user_id": null,
      "car_id": null,
      "quotation_datetime": "",
      "expiry_date": "",
      "payment_method": "",
      "payment_order_data": null,
      "payment_completed_datetime": "",
      "compensation_price": null,
      "credit_card_extra_charge_amount": 0,
      "total_amount": null,
      "status": CompensationPaymentStatus.awaiting_quotation,
      "remark": "",
      "return_vehicle_report_pdf_url": "",
      "quotation_pdf_url": "",
      "return_vehicle_report_id": null,
      "accident": false,
      "third_party_liability_amount": null,
      "self_liability_amount": null,
    };
  }

  getCompensationData() {
    let send_data = {
      id: this.compensation_payment_id,
      data_type: "compensation_payment_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.compensation_payment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_compensation_payment_data = JSON.parse(JSON.stringify(res.data));

        if (this.compensation_payment_data.user_id != null) {
          this.getUserData();
        }
        if (this.compensation_payment_data.car_id != null) {
          this.getCarData();
        }
        if (this.compensation_payment_data.order_id != null) {
          this.getOrderData();
        }
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  async getUserData() {
    const get_user_data_result: Response = await this.dataService.getUserDataById(this.compensation_payment_data.user_id);
    console.log(get_user_data_result);
    if (get_user_data_result.result == 'success') {
      this.user_data = get_user_data_result.data;
    }
  }

  async getCarData() {
    const get_car_data_result: Response = await this.dataService.getSingleDataById(this.compensation_payment_data.car_id, DATA_TYPE.CAR_DATA);
    if (get_car_data_result.result == 'success') {
      this.car_data = get_car_data_result.data;
    }
  }

  async getRvrData() {
    const get_return_vehicle_report_result: Response = await this.dataService.getReturnVehicleReportByOrderId(this.compensation_payment_data.order_id);
    if (get_return_vehicle_report_result.result == 'success') {
      this.compensation_payment_data.return_vehicle_report_id = get_return_vehicle_report_result.data.id;
    }
  }

  async getOrderData() {
    const get_order_data_result: Response = await this.dataService.getSingleDataById(this.compensation_payment_data.order_id, DATA_TYPE.ORDER_DATA);
    if (get_order_data_result.result == 'success') {
      this.order_data = get_order_data_result.data;
    }
  }

  generateQuotationPdf() {
    let send_data = {
      compensation_payment_id: this.compensation_payment_data.id,
    }
    this.apiService.postFromServer(ApiPath.generate_compensation_payment_quotation_pdf, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.compensation_payment_data.quotation_pdf_url = res.data;
        this.checking_compensation_payment_data.quotation_pdf_url = res.data;
        this.commonService.downloadMedia(this.compensation_payment_data.quotation_pdf_url, true);
      } else {
        switch (res.data) {
          case 'no return vehicle report':
            this.commonService.openErrorSnackBar("未有交還車輛報告");
            break;
        
          default:
            this.commonService.openErrorSnackBar();
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }


  createNewCompensationPayment() {

    if (this.compensation_payment_data.car_id == null) {
      return this.commonService.openErrorSnackBar("未選擇汽車");
    }
    if (this.compensation_payment_data.user_id == null) {
      return this.commonService.openErrorSnackBar("未選擇用戶");
    }
    if (this.compensation_payment_data.order_id == null) {
      return this.commonService.openErrorSnackBar("未選擇訂單");
    }

    this.apiService.postFromServer(ApiPath.new_compensation_payment, this.compensation_payment_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.compensation_payment_id = res.data.id;
        this.compensation_payment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_compensation_payment_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/compensation-payment-detail?compensation_payment_id=' + res.data.id);
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
    let send_data = {
      id: this.compensation_payment_data.id
    }

    send_data = this.commonService.updateDataChecker(send_data, this.compensation_payment_data, this.checking_compensation_payment_data);


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    if (this.send_quotation_created_notification) {
      send_data['send_quotation_created_notification'] = this.send_quotation_created_notification;
    }

    console.log(send_data);
    this.apiService.postFromServer(ApiPath.update_compensation_payment, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.compensation_payment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_compensation_payment_data = JSON.parse(JSON.stringify(res.data));
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
        const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
        this.commonService.isLoading = false;
        if (upload_base64_to_server.result == "success") {
          this.compensation_payment_data.payment_order_data = upload_base64_to_server.data;
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  removeImg(data) {
    console.log(data);
    this.compensation_payment_data.payment_order_data = "";
  }


  getOrderDataById(id) {
    return this.all_order_data_list != null ? this.all_order_data_list.filter(d => d.id == id)[0] : null;
  }

  searchOrder(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    event.component.items = this.all_order_data_list.filter(order => {
      return order?.id.toString()?.toLowerCase().indexOf(text) !== -1 ||
        order?.reference_number?.toLowerCase().indexOf(text) !== -1 ||
        order?.start_date?.toLowerCase().indexOf(text) !== -1 ||
        order?.end_date?.toLowerCase().indexOf(text) !== -1 ||
        order?.user_phone?.toLowerCase().indexOf(text) !== -1 ||
        order?.user_zh_full_name?.toLowerCase().indexOf(text) !== -1
    });
    event.component.endSearch();

  }

  orderChange(ev) {
    if (ev.value != null) {
      let order_data = this.all_order_data_list.filter(d => d.id == ev.value)[0];
      if (order_data != null) {
        this.compensation_payment_data.user_id = order_data.user_id;
        this.compensation_payment_data.car_id = order_data.car_id;
        this.getUserData();
        this.getCarData();
        this.getRvrData()
      }
    }
    else {
      this.compensation_payment_data.user_id = null;
      this.user_data = null;
      this.compensation_payment_data.car_id = null;
      this.car_data = null;
    }

  }


}
