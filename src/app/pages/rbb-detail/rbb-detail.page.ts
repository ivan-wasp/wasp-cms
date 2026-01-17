import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CarData, DATA_TYPE, RbbData, RbbPaymentData, RbbStatus, UserData } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-rbb-detail',
  templateUrl: './rbb-detail.page.html',
  styleUrls: ['./rbb-detail.page.scss'],
})
export class RbbDetailPage implements OnInit {


  rbb_id = null;
  rbb_data: RbbData = null;
  checking_rbb_data = null;
  checking_user_data = null;

  user_data: UserData;
  car_data: CarData;
  rbb_payment_data: RbbPaymentData;

  upload_type = null;

  readonly = true;

  other_doc_file_name = "";

  all_rendering_order_data_list = null;

  all_rbb_equipment_data_list = null;


  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe(
    map(
      (d: CarData[]) => {
        return d != null ? d.filter((c: CarData) => c.disabled != true && c.sold != true) : d;
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
        if (params && params.rbb_id) {
          this.rbb_id = parseInt(params.rbb_id);
        }
      }
    });
  }

  async ngOnInit() {
    if (this.rbb_id != null && this.rbb_id != '') {
      this.getRbbData();
    }
    else {
      this.readonly = false;
      this.setNewRbbDataTemplate();
      if (this.dataService.car_data_list$.value == null) {
        await this.dataService.getAllCarData();
      }
    }
  
    const get_rendering_order_data_list: Response = await this.dataService.getAllRenderingOrderData();
    if (get_rendering_order_data_list.result == 'success'){
      this.all_rendering_order_data_list = get_rendering_order_data_list.data;
    }
    this.getAllRbbEquipmentData();
  }

  setNewRbbDataTemplate() {
    this.rbb_data = {
      "id": null,
      "data_type": DATA_TYPE.RBB_DATA,
      "create_date": "",
      "disabled": false,
      "user_id": null,
      "car_id": null,
      "order_id": null,
      "rbb_payment_id": null,
      "car_price": null,
      "plan": "",
      "interest_rate": [],
      "mortgage_period": [],
      "selected_mortgage_period": null,
      "first_payment_discount": false,
      "first_payment_discount_percentage": "",
      "purchase_hybrid_care": false,
      "hybrid_care": false,
      "hybrid_care_amount": 2000,
      "selected_plate_data": null,
      "status": RbbStatus.awaiting_application,
      "status_history_list": [],
      "equipment_id_list": [],
      "other_doc_url_list": [],
      "selected_equipment_id_list": [],
      "selected_equipment_data_list": [],
      "rbb_agreement_url": "",
      "rbb_confirm_url": "",
    };
  }

  async getRbbData() {
    let send_data = {
      rbb_id: this.rbb_id
    }
    const get_rbb_data: Response = await this.apiService.postFromServer(ApiPath.get_rbb_data_with_all_other_data_by_rbb_id, send_data, true);
    if (get_rbb_data.result == 'success'){
      this.rbb_data = JSON.parse(JSON.stringify(get_rbb_data.data));
      if (!Array.isArray(this.rbb_data.interest_rate)) {
        let temp = [];
        temp.push(this.rbb_data.interest_rate);
        this.rbb_data.interest_rate = temp;
      }
      if (this.rbb_data.interest_rate.length > this.rbb_data.mortgage_period.length) {
        this.rbb_data.interest_rate = this.rbb_data.interest_rate.slice(0, this.rbb_data.mortgage_period.length);
      }
      while (this.rbb_data.interest_rate.length < this.rbb_data.mortgage_period.length) {
        this.rbb_data.interest_rate.push("");
      }
      if(this.rbb_data.selected_mortgage_period != null){
        this.rbb_data.selected_mortgage_period = this.rbb_data.selected_mortgage_period.toString();
      }else{
        
      }
      console.log(this.rbb_data);
      this.checking_rbb_data = JSON.parse(JSON.stringify(this.rbb_data));


      if (this.rbb_data.user_id != null){
        this.user_data = get_rbb_data.data.user_data;
        this.checking_user_data = get_rbb_data.data.user_data;
      }
      this.car_data = get_rbb_data.data.car_data;
      if (get_rbb_data.data.rbb_payment_data){
        this.rbb_payment_data = get_rbb_data.data.rbb_payment_data;
      }
    }else {
      this.commonService.openErrorSnackBar();
    }


  }

  getAllRbbEquipmentData() {
    let send_data = {
      data_type: "rbb_equipment_data"
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.all_rbb_equipment_data_list = res.data;

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

            case 'other_doc_url_list':
              this.rbb_data.other_doc_url_list.unshift({
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
      id: this.rbb_data.id
    };
    let send_user_data = null;
    if (this.rbb_data.user_id != null){
      let send_user_data = {
        id: this.user_data.id
      };
    }

    // console.log(this.rbb_data);
    // console.log(this.checking_rbb_data);

    // if (this.rbb_data.user_id == null) {
    //   return this.commonService.openErrorSnackBar("未選擇用戶");
    // }
    // if (this.rbb_data.order_id == null ) {
    //   return this.commonService.openErrorSnackBar("未選擇訂單");
    // }
    if (this.rbb_data.car_id == null) {
      return this.commonService.openErrorSnackBar("未選擇汽車");
    }
    if (this.rbb_data.car_price == null || this.rbb_data.car_price <= 0) {
      return this.commonService.openErrorSnackBar("不正確的車價");
    }
    // if (this.rbb_data.interest_rate == null || this.rbb_data.interest_rate == '' || this.rbb_data.interest_rate <= 0 || this.rbb_data.interest_rate > 100) {
    //   return this.commonService.openErrorSnackBar("不正確的利率");
    // }
    // if (this.rbb_data.mortgage_period == null || this.rbb_data.mortgage_period.length <= 0) {
    //   return this.commonService.openErrorSnackBar("請選擇期數");
    // }
    if (this.rbb_data.first_payment_discount) {
      if (this.rbb_data.first_payment_discount_percentage == null || this.rbb_data.first_payment_discount_percentage == '') {
        return this.commonService.openErrorSnackBar("請選擇首數折扣");
      }
    }
    if (this.rbb_data.hybrid_care) {
      if (this.rbb_data.hybrid_care_amount == null ) {
        return this.commonService.openErrorSnackBar("請輸入Hybrid care價錢");
      }
    }
    send_data = this.commonService.updateDataChecker(send_data, this.rbb_data, this.checking_rbb_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }


    if (Object.keys(send_data).length > 1) {
      console.log(send_data);


      this.apiService.postFromServer(ApiPath.update_rbb_handler, send_data, true).then((res: Response) => {

        if (res.result == "success") {
          this.readonly = true;
          this.checking_rbb_data = JSON.parse(JSON.stringify(this.rbb_data));
          if (send_user_data != null && Object.keys(send_user_data).length > 1) {
            this.apiService.postFromServer(ApiPath.update_user, send_user_data, true).then((res: Response) => {
 
              if (res.result == "success") {
                this.readonly = true;
                  this.commonService.openSnackBar("已更新資料");
              } else {
                  this.commonService.openErrorSnackBar("未能更新資料");
              }
            }, err => {
              this.commonService.openErrorSnackBar();
            });
          } else {
            this.commonService.openSnackBar("已更新資料");
          }
        } else {
            this.commonService.openErrorSnackBar("未能更新資料");
        }
      }, err => {
        this.commonService.openErrorSnackBar();
      });
    } else {
      console.log(send_user_data);
      if (Object.keys(send_user_data).length > 1) {

        this.apiService.postFromServer(ApiPath.update_user, send_user_data, true).then((res: Response) => {
          if (res.result == "success") {
            this.readonly = true;
            this.checking_rbb_data = JSON.parse(JSON.stringify(this.rbb_data));
              this.commonService.openSnackBar("已更新資料");
          } else {
              this.commonService.openErrorSnackBar("未能更新資料");
          }
        }, err => {
          this.commonService.openErrorSnackBar();
        });
      }
    }

  }

  getOrderDataById(id) {
    return this.all_rendering_order_data_list != null ? this.all_rendering_order_data_list.filter(d => d.id == id)[0] : null;
  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  searchOrder(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    event.component.items = this.all_rendering_order_data_list.filter(order => {
      return order.id.toString().toLowerCase().indexOf(text) !== -1 ||
        order.reference_number.toLowerCase().indexOf(text) !== -1 ||
        order.start_date.toLowerCase().indexOf(text) !== -1 ||
        order.end_date.toLowerCase().indexOf(text) !== -1 ||
        order.user_phone.toLowerCase().indexOf(text) !== -1 ||
        order.user_zh_full_name.toLowerCase().indexOf(text) !== -1
    });
    event.component.endSearch();

  }

  disabledChange(ev) {
    this.rbb_data.disabled = !ev.detail.checked;
  }

  orderChange(ev) {
    // console.log(ev.value);

    if (ev.value != null) {
      let order_data = this.all_rendering_order_data_list.filter(d => d.id == ev.value)[0];
      if (order_data != null) {
        this.rbb_data.user_id = order_data.user_id;
        this.rbb_data.car_id = order_data.car_id;
        this.getUserData();
        this.getCarData();
      }
    }
    else {
      this.rbb_data.user_id = null;
      this.user_data = null;
      this.rbb_data.car_id = null;
      this.car_data = null;
    }

  }

  carChange(ev){
    if (ev.value != null) {
      this.car_data = this.dataService.car_data_list$.value.find(d => d.id == ev.value);
    }
    else{
      this.car_data = null;
    }
    console.log(this.car_data);
  }

  getUserData() {
    let send_data = {
      id: this.rbb_data.user_id,
      data_type: "user_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.user_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getCarData() {
    let send_data = {
      id: this.rbb_data.car_id,
      data_type: "car_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.car_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }


  createNewRbb() {

    if (this.rbb_data.car_id == null) {
      return this.commonService.openErrorSnackBar("未選擇汽車");
    }
    // if (this.rbb_data.user_id == null) {
    //   return this.commonService.openErrorSnackBar("未選擇用戶");
    // }
    // if (this.rbb_data.order_id == null) {
    //   return this.commonService.openErrorSnackBar("未選擇訂單");
    // }
    if (this.rbb_data.car_price == null || this.rbb_data.car_price <= 0) {
      return this.commonService.openErrorSnackBar("不正確的車價");
    }
    if (this.rbb_data.mortgage_period == null || this.rbb_data.mortgage_period.length <= 0) {
      return this.commonService.openErrorSnackBar("請選擇期數");
    }
    if (this.rbb_data.first_payment_discount) {
      if (this.rbb_data.first_payment_discount_percentage == null || this.rbb_data.first_payment_discount_percentage == '') {
        return this.commonService.openErrorSnackBar("請選擇首數折扣");
      }
    }
    if (this.rbb_data.hybrid_care) {
      if (this.rbb_data.hybrid_care_amount == null) {
        return this.commonService.openErrorSnackBar("請輸入Hybrid care價錢");
      }
    }

    this.apiService.postFromServer(ApiPath.new_rbb, this.rbb_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.rbb_id = res.data.id;
        this.rbb_data = JSON.parse(JSON.stringify(res.data));
        this.checking_rbb_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/rbb-detail?rbb_id=' + res.data.id);
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

  periodChange() {
    if (this.rbb_data.interest_rate.length > this.rbb_data.mortgage_period.length) {
      this.rbb_data.interest_rate = this.rbb_data.interest_rate.slice(0, this.rbb_data.mortgage_period.length);
    }
    while (this.rbb_data.interest_rate.length < this.rbb_data.mortgage_period.length) {
      this.rbb_data.interest_rate.push("");
    }
    console.log(this.rbb_data.mortgage_period);
    console.log(this.rbb_data.interest_rate);
  }


  generateConfirm() {
    let send_data = {
      'id': this.rbb_data.id,
    }
    this.apiService.postFromServer(ApiPath.generate_rbb_confirmation, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.rbb_data.rbb_confirm_url = res.data.rbb_confirm_url;
        this.checking_rbb_data.rbb_confirm_url = res.data.rbb_confirm_url;
        this.commonService.openSnackBar("已產生訂購單");
        this.commonService?.openPage(this.rbb_data.rbb_confirm_url, true, true);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }


  generateAgreement() {
    let send_data = {
      'id': this.rbb_data.id,
    }
    this.apiService.postFromServer(ApiPath.generate_rbb_agreement, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.rbb_data.rbb_agreement_url = res.data.rbb_agreement_url;
        this.checking_rbb_data.rbb_agreement_url = res.data.rbb_agreement_url;
        this.commonService.openSnackBar("已產生訂購單");
        console.log(this.rbb_data.rbb_agreement_url);
        this.commonService?.openPage(this.rbb_data.rbb_agreement_url, true, true);
        // this.commonService?.openPage("https://wasphk.com/terms/WASP_RBB_T&C.pdf", true, true);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }
}
