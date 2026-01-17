import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-daf',
  templateUrl: './daf.page.html',
  styleUrls: ['./daf.page.scss'],
})
export class DafPage implements OnInit {


  deposit_id = null;
  deposit_data = null;
  daf = {
    deposit_id: null,
    user_en_full_name: "",
    user_zh_full_name: "",
    user_identity_number: "",
    user_phone: "",
    user_address: "",
    order_start_date_end_date: "",
    car_register_number: "",
    deposit_amount: "",
    user_signature_img_url: "",
  };


  @ViewChild('canvas2', { static: false }) signaturePadElement2;
  signaturePad2: any;
  canvasWidth: number;
  canvasHeight: number;

  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private elementRef: ElementRef,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params) {
        if (params && params.deposit_id) {
          this.deposit_id = parseInt(params.deposit_id);
        }
      }
    });
  }

  initSignaturePad() {
    this.signaturePad2 = new SignaturePad(this.signaturePadElement2.nativeElement);
    this.signaturePad2.clear();
    this.signaturePad2.penColor = 'rgb(56,128,255)';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.initSignaturePad();
  }

  // init() {
  //   const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight - 140;
  //   if (this.signaturePad) {
  //     this.signaturePad.clear(); // Clear the pad on init
  //   }
  // }

  ngOnInit() {
    if (this.deposit_id != null && this.deposit_id != '') {
      this.getDepositData();
    }
  }

  getDepositData() {
    let send_data = {
      deposit_id: this.deposit_id
    }
    this.apiService.postFromServer(ApiPath.get_deposit_data_with_all_other_data_by_deposit_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.deposit_data = res.data;

        this.injectData();

        setTimeout(() => {
          this.initSignaturePad();
        }, 500);

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  injectData() {
    this.daf.deposit_id = this.deposit_data.id;
    if (this.deposit_data.user_data != undefined && this.deposit_data.user_data != null){
      this.daf.user_en_full_name = this.deposit_data.user_data.en_full_name;
      this.daf.user_zh_full_name = this.deposit_data.user_data.zh_full_name;
      this.daf.user_identity_number = this.deposit_data.user_data.identity_number;
      this.daf.user_phone = this.deposit_data.user_data.phone;
      this.daf.user_address = this.deposit_data.user_data.address;
    }
    if (this.deposit_data.order_data != undefined && this.deposit_data.order_data != null){
      this.daf.order_start_date_end_date = this.deposit_data.order_data.start_date + ' - ' + this.deposit_data.order_data.end_date;
    }
    if (this.deposit_data.car_data != undefined && this.deposit_data.car_data != null){
      this.daf.car_register_number = this.deposit_data.car_data.register_number;
    }
    if(this.deposit_data.penalty!=undefined && this.deposit_data.penalty!=null && this.deposit_data.penalty!=''){
      this.daf.deposit_amount = (this.deposit_data.amount - this.deposit_data.penalty).toString();
    }else{
      this.daf.deposit_amount = this.deposit_data.amount;
    }

  }

  async save() {

    let user_signature_img_base64 = this.signaturePad2.toDataURL();

    let send_data2 = {
      file_name: '',
      file_type: 'png',
      base64: user_signature_img_base64
    }
    const upload_base64_to_server2 = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data2);
    if (upload_base64_to_server2.result == "success") {
      this.daf.user_signature_img_url = upload_base64_to_server2.data;
    }
    else {
      this.commonService.openErrorSnackBar("無法上載檔案");
    }

    console.log(this.daf);

    this.apiService.postFromServer(ApiPath.generate_deposit_authorization_form_pdf_by_daf_data, this.daf, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        setTimeout(() => {
          this.commonService.downloadMedia(res.data, true);
          this.commonService.openSnackBar("已產生代領按金授權書");
          window.history.back();
        }, 500);

      }
      else {
        this.commonService.openErrorSnackBar("產生代領按金授權書失敗");
      }
    });

  }

}
