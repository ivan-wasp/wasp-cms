import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-vls',
  templateUrl: './vls.page.html',
  styleUrls: ['./vls.page.scss'],
})
export class VlsPage implements OnInit {

  order_id = null;
  order_data = null;
  vls = {
    order_reference_number: "",
    order_id: null,
    car_plate: "",
    user_en_full_name: "",
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
        if (params && params.order_id) {
          this.order_id = parseInt(params.order_id);
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
    if (this.order_id != null && this.order_id != '') {
      this.getOrderData();
    }
  }

  getOrderData() {
    let send_data = {
      order_id: this.order_id
    }
    this.apiService.postFromServer(ApiPath.get_order_data_with_all_other_data_by_order_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.order_data = res.data;

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
    this.vls.order_reference_number = this.order_data.reference_number;
    this.vls.order_id = this.order_data.id;


    if (this.order_data.car_data != undefined && this.order_data.car_data != null){
      this.vls.car_plate = this.order_data.car_data.plate;
    }
    if (this.order_data.user_data != undefined && this.order_data.user_data != null){
      this.vls.user_en_full_name = this.order_data.user_data.en_full_name;
    }

  }

  async save() {

    let user_signature_img_base64 = this.signaturePad2.toDataURL();

    let send_data2 = {
      file_name: '',
      file_type: 'png',
      base64: user_signature_img_base64,
      compress_img: true
    }
    const upload_base64_to_server2 = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server ,send_data2, true);
    if (upload_base64_to_server2.result == "success") {
      this.vls.user_signature_img_url = upload_base64_to_server2.data;
    }
    else {
      this.commonService.openErrorSnackBar("無法上載檔案");
    }

    this.apiService.postFromServer(ApiPath.generate_vehicle_sign_for_confirmation_pdf_by_vls_data, this.vls, true).then((res: Response) => {

      console.log(res);
      if (res.result == "success") {
        setTimeout(() => {
          this.commonService.downloadMedia(res.data, true);
          this.commonService.openSnackBar("已產生行車證簽收確認書");
          window.history.back();
        }, 500);

      }
      else {
        this.commonService.openErrorSnackBar("產生行車證簽收確認書失敗");
      }
    });

  }


}
