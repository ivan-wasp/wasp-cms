import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AdminData, AdminType, Authority } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment-slider',
  templateUrl: './payment-slider.component.html',
  styleUrls: ['./payment-slider.component.scss'],
})
export class PaymentSliderComponent implements OnInit {

  current_url = null;

  slideOpts = {
    // initialSlide: 1,
    speed: 400,
  };

  readonly = true;

  @Input() payment_id = null;
  @Input() new_payment_data = null;

  payment_data = null;
  checking_payment_data = null;

  recalculated_payment_data = null;

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  coupon_code = null;

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private router: Router
  ) {
    this.current_url = this.router.url;
    // console.log(this.current_url);
  }

  ngOnInit() {
    if (this.payment_id != null && this.payment_id != ''){
      this.getPaymentData();
    }
    else if (this.new_payment_data != null && this.new_payment_data != ''){
      this.payment_data = this.new_payment_data;
    }

    console.log(this.auth.adminData.value);
  }


  getPaymentData() {
    let send_data = {
      id: this.payment_id,
      data_type: "payment_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {

        this.payment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_payment_data = JSON.parse(JSON.stringify(res.data));
        console.log(this.payment_data);

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  recalculatePayment() {
    if (this.payment_data.status == 'paid' && this.payment_data.payment_method == 'credit_card'){
      return this.commonService.openErrorSnackBar("已使用信用卡付款，不能更改");
    }
    if (this.payment_data.penality_amount === null || this.payment_data.penality_amount === ''){
      return this.commonService.openErrorSnackBar("所有金額數值不能留空，最少為0");
    }
    if (this.payment_data.internal_discount_amount === null || this.payment_data.internal_discount_amount === ''){
      return this.commonService.openErrorSnackBar("所有金額數值不能留空，最少為0");
    }
    if (this.payment_data.internal_charge_amount === null || this.payment_data.internal_charge_amount === ''){
      return this.commonService.openErrorSnackBar("所有金額數值不能留空，最少為0");
    }
    let send_data = {
      'payment_method': this.payment_data.payment_method,
      'rental_amount': this.payment_data.rental_amount,
      'parking_amount': this.payment_data.parking_amount,
      'deposit_amount': this.payment_data.deposit_amount,
      'equipment_amount': this.payment_data.equipment_amount,
      'product_amount': this.payment_data.product_amount,
      'penality_amount': this.payment_data.penality_amount,
      'coupon_amount': this.payment_data.coupon_amount,
      'discount_amount': this.payment_data.discount_amount,
      'insurance_amount': this.payment_data.insurance_amount,
      'internal_discount_amount': this.payment_data.internal_discount_amount,
      'internal_charge_amount': this.payment_data.internal_charge_amount,
      'credit_card_extra_charge_amount': this.payment_data.credit_card_extra_charge_amount,
      'total_amount': this.payment_data.total_amount
    }
    // console.log(send_data);
    this.apiService.postFromServer(ApiPath.calculate_payment_data_amount, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.recalculated_payment_data = res.data;

        this.payment_data.rental_amount = res.data.rental_amount;
        this.payment_data.parking_amount = res.data.parking_amount;
        this.payment_data.deposit_amount = res.data.deposit_amount;
        this.payment_data.equipment_amount = res.data.equipment_amount;
        this.payment_data.product_amount = res.data.product_amount;
        this.payment_data.penality_amount = res.data.penality_amount;
        this.payment_data.coupon_amount = res.data.coupon_amount;
        this.payment_data.internal_discount_amount = res.data.internal_discount_amount;
        this.payment_data.internal_charge_amount = res.data.internal_charge_amount;
        this.payment_data.credit_card_extra_charge_amount = res.data.credit_card_extra_charge_amount;
        this.payment_data.total_amount = res.data.total_amount;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  updatePaymentData() {
    let send_data = {
      'id': this.payment_data.id,
    }
    if (this.payment_data.status != this.checking_payment_data.status){
      send_data['status'] = this.payment_data.status;
    }
    if (this.payment_data.remark != this.checking_payment_data.remark){
      send_data['remark'] = this.payment_data.remark;
    }
    if (this.payment_data.internal_charge_amount_remark != this.checking_payment_data.internal_charge_amount_remark){
      send_data['internal_charge_amount_remark'] = this.payment_data.internal_charge_amount_remark;
    }
    if (this.payment_data.internal_discount_amount_remark != this.checking_payment_data.internal_discount_amount_remark){
      send_data['internal_discount_amount_remark'] = this.payment_data.internal_discount_amount_remark;
    }
    if (this.payment_data.payment_method != this.checking_payment_data.payment_method){
      send_data['payment_method'] = this.payment_data.payment_method;
    }
    if (this.payment_data.payment_order_data != this.checking_payment_data.payment_order_data){
      send_data['payment_order_data'] = this.payment_data.payment_order_data;
    }
    if (this.payment_data.allow_discount != this.checking_payment_data.allow_discount){
      send_data['allow_discount'] = this.payment_data.allow_discount;
    }
    // send_data = this.commonService.updateDataChecker(send_data, this.payment_data, this.checking_payment_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }
    console.log(send_data);

    this.apiService.postFromServer(ApiPath.update_payment_handler, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.readonly = true;
        this.recalculated_payment_data = null;
        this.payment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_payment_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新帳單", null, 1000);
        if (send_data.hasOwnProperty('status')){
          setTimeout(() => {
            this.commonService.openSnackBar("如有需要請更新訂單狀態！");
          }, 1000);
        }
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  async applyDiscount(discount_type: 'coupon' | 'deposit_discount' | 'reset', coupon_code?){
    const apply_payment_data = await this.dataService.applyCouponToPayment(discount_type, this.payment_data, (discount_type == 'coupon' ? (coupon_code ? coupon_code : this.coupon_code) : null));
    console.log(apply_payment_data);
    if (apply_payment_data){
      this.payment_data = apply_payment_data;

      const update_payment: Response = await this.dataService.updatePaymentHandler(this.payment_data);
      if (update_payment.result == "success") {
        this.readonly = true;
        this.recalculated_payment_data = null;
        this.payment_data = JSON.parse(JSON.stringify(update_payment.data));
        this.checking_payment_data = JSON.parse(JSON.stringify(update_payment.data));
        this.commonService.openSnackBar("已更新帳單");
      } else {
        this.commonService.openErrorSnackBar();
      }
    }
  }

  async updatePaymentAmount() {
    let send_data = {
      'id': this.payment_data.id,
      'payment_method': this.recalculated_payment_data.payment_method,
      'rental_amount': this.recalculated_payment_data.rental_amount,
      'parking_amount': this.recalculated_payment_data.parking_amount,
      'deposit_amount': this.recalculated_payment_data.deposit_amount,
      'equipment_amount': this.recalculated_payment_data.equipment_amount,
      'product_amount': this.recalculated_payment_data.product_amount,
      'penality_amount': this.recalculated_payment_data.penality_amount,
      'coupon_amount': this.recalculated_payment_data.coupon_amount,
      'internal_discount_amount': this.recalculated_payment_data.internal_discount_amount,
      'internal_charge_amount': this.recalculated_payment_data.internal_charge_amount,
      'credit_card_extra_charge_amount': this.recalculated_payment_data.credit_card_extra_charge_amount,
      'total_amount': this.recalculated_payment_data.total_amount
    }
    // console.log(send_data);

    const update_payment: Response = await this.dataService.updatePaymentHandler(send_data);
    if (update_payment.result == "success") {
      this.readonly = true;
      this.recalculated_payment_data = null;
      this.payment_data = JSON.parse(JSON.stringify(update_payment.data));
      this.checking_payment_data = JSON.parse(JSON.stringify(update_payment.data));
      this.commonService.openSnackBar("已更新帳單");
    } else {
      this.commonService.openErrorSnackBar();
    }
  }

  generateInvoice() {
    let send_data = {
      'payment_id': this.payment_data.id,
    }
    this.apiService.postFromServer(ApiPath.generate_invoice_pdf_by_payment_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.payment_data.invoice_url = res.data.invoice_url;
        this.checking_payment_data.invoice_url = res.data.invoice_url;
        this.commonService.openSnackBar("已產生Invoice");
        this.commonService?.openPage(this.payment_data.invoice_url, true, true);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  removeImg(data){
    console.log(data);
    this.payment_data.payment_order_data = "";
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
          this.payment_data.payment_order_data = upload_base64_to_server.data;
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  resetEdit(){
    this.readonly = true;
    this.payment_data = JSON.parse(JSON.stringify(this.checking_payment_data));
  }

}
