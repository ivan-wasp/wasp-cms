import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import SignaturePad from 'signature_pad';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ItemReorderEventDetail } from '@ionic/core';

const { Camera } = Plugins;

@Component({
  selector: 'app-rdr',
  templateUrl: './rdr.page.html',
  styleUrls: ['./rdr.page.scss'],
})
export class RdrPage implements OnInit {
  on_contract_status:boolean = false;

  deposit_id = null;
  deposit_data = null;
  rdr = {
    deposit_id: null,
    user_en_full_name: "",
    user_zh_full_name: "",
    create_date: "",
    user_phone: "",
    user_identity_number: "",
    user_address: "",
    order_start_date_end_date: "",
    contract_status: "",
    new_plate: "",
    deposit_amount: "",
    car_plate: "",
    car_brand: "",
    quotation: false,
    car_model: "",
    repair_fee: "",
    user_signature_img_url: "",
    violation_data_list: [],
    cheque_img_url: ""
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
    private alertController: AlertController,
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
    this.rdr.deposit_id = this.deposit_data.id;
    if (this.deposit_data.user_data != undefined && this.deposit_data.user_data != null){
      this.rdr.user_en_full_name = this.deposit_data.user_data.en_full_name;
      this.rdr.user_zh_full_name = this.deposit_data.user_data.zh_full_name;
      this.rdr.user_phone = this.deposit_data.user_data.phone;
      this.rdr.user_identity_number = this.deposit_data.user_data.identity_number;
      this.rdr.user_address = this.deposit_data.user_data.address;
    }
    if (this.deposit_data.order_data != undefined && this.deposit_data.order_data != null){
      this.rdr.order_start_date_end_date = this.deposit_data.order_data.start_date + ' - ' + this.deposit_data.order_data.end_date;
    }
    // this.rdr.deposit_amount = this.deposit_data.amount;
    if(this.deposit_data.penalty!=undefined && this.deposit_data.penalty!=null && this.deposit_data.penalty!=''){
      this.rdr.deposit_amount = (this.deposit_data.amount - this.deposit_data.penalty).toString();
    }else{
      this.rdr.deposit_amount = this.deposit_data.amount;
    }
    if (this.deposit_data.car_data != undefined && this.deposit_data.car_data != null){
      this.rdr.car_plate = this.deposit_data.car_data.plate;
      this.rdr.car_brand = this.deposit_data.car_data.brand;
      this.rdr.car_model = this.deposit_data.car_data.model;
    }
    this.rdr.violation_data_list = this.deposit_data.violation_data_list;
    if(this.deposit_data.contract_status != undefined){
      this.rdr.contract_status = this.deposit_data.contract_status;
    }
    if(this.deposit_data.new_plate != undefined){
      this.rdr.new_plate = this.deposit_data.new_plate;
    }
    if(this.deposit_data.quotation != undefined){
      this.rdr.quotation = this.deposit_data.quotation;
    }
    if(this.deposit_data.repair_fee != undefined){
      this.rdr.repair_fee = this.deposit_data.repair_fee;
    }
  }

  async save() {

    let user_signature_img_base64 = this.signaturePad2.toDataURL();

    let send_data2 = {
      file_name: '',
      file_type: 'png',
      base64: user_signature_img_base64
    }
    this.commonService.isLoading = true;
    const upload_base64_to_server2 = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data2);
    this.commonService.isLoading = false;
    if (upload_base64_to_server2.result == "success") {
      this.rdr.user_signature_img_url = upload_base64_to_server2.data;
    }
    else {
      this.commonService.openErrorSnackBar("無法上載檔案");
    }

    this.apiService.postFromServer(ApiPath.generate_return_deposit_report_pdf_by_rdr_data, this.rdr, true).then((res: Response) => {
      if (res.result == "success") {
        setTimeout(() => {
          this.commonService.downloadMedia(res.data, true);
          this.commonService.openSnackBar("已產生退回按金報告");
          // popup update data
          // window.history.back();
          this.presentAlertCheckbox();
        }, 500);

      }
      else {
        this.commonService.openErrorSnackBar("產生退回按金報告失敗");
      }
    });

  }
  async presentAlertCheckbox() {
    const alert = await this.alertController.create({
      header: '更新按金狀態',
      buttons: [
        {
          text: '未申請',
          handler: () => {
            this.updateStatus('awaiting_application');
          }
        }, {
          text: '審核中',
          handler: () => {
            this.updateStatus('awaiting_verification');
          }
        }, {
          text: '已批核',
          handler: () => {
            this.updateStatus('approved');
          }
        }, {
          text: '已退還',
          handler: () => {
            this.updateStatus('refunded');
          }
        }, {
          text: '已扣起',
          handler: () => {
            this.updateStatus('confiscated');
          }
        }
      ]
    });

    await alert.present();
  }


  updateStatus(status) {
    let send_data = {
      id: this.deposit_data.id
    }
    send_data['status'] = status;
    this.apiService.postFromServer(ApiPath.update_deposit_handler, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        window.history.back();
      } else {
        switch (true) {
          default:
            this.commonService.openErrorSnackBar("更新不成功");
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }



  tempSave() {
    let send_data = {
      id: this.deposit_data.id
    }

    if (this.deposit_data.contract_status == undefined || this.deposit_data.contract_status != this.rdr.contract_status) {
      send_data['contract_status'] = this.rdr.contract_status;
    }
    if (this.deposit_data.new_plate == undefined || this.deposit_data.new_plate != this.rdr.new_plate) {
      send_data['new_plate'] = this.rdr.new_plate;
    }
    if (this.deposit_data.quotation == undefined || this.deposit_data.quotation != this.rdr.quotation) {
      send_data['quotation'] = this.rdr.quotation;
    }
    if (this.deposit_data.repair_fee == undefined || this.deposit_data.repair_fee != this.rdr.repair_fee) {
      send_data['repair_fee'] = this.rdr.repair_fee;
    }

    this.apiService.postFromServer(ApiPath.update_deposit_handler, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.deposit_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已暫存資料");
      } else {
        switch (true) {
          default:
            this.commonService.openErrorSnackBar("未能暫存資料");
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  async selectImageSource() {
    const buttons = [
      {
        text: '拍攝新照片',
        icon: 'camera',
        handler: () => {
          this.takePicture(CameraSource.Camera);
        }
      },
      {
        text: '從手機相簿選擇',
        icon: 'image',
        handler: () => {
          this.takePicture(CameraSource.Photos);
        }
      }
    ];

    // Only allow file selection inside a browser
    if (!this.platform.is('hybrid')) {
      // buttons.push({
      //   text: '選擇圖片',
      //   icon: 'attach',
      //   handler: () => {
      //     // this.fileInput.nativeElement.click();
      //     this.takePicture(CameraSource.Photos);
      //   }
      // });
      this.takePicture(CameraSource.Photos);
    }
    else {
      const actionSheet = await this.actionSheetCtrl.create({
        header: '圖片來源',
        buttons
      });
      await actionSheet.present();
    }


  }


  async takePicture(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });

    // var imageUrl = image.webPath;
    // console.log(image).base64String;

    let base64Image = `data:image/${image.format};base64,` + image.base64String;
    let send_data = {
      file_name: '',
      file_type: image.format,
      base64: base64Image
    }
    this.commonService.isLoading = true;
    const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
    this.commonService.isLoading = false;
    if (upload_base64_to_server.result == "success") {
      this.rdr.cheque_img_url = (upload_base64_to_server.data);
    }
    else {
      this.commonService.openErrorSnackBar("無法上載檔案");
    }

    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    console.log(ev);
    this.rdr.violation_data_list = ev.detail.complete(this.rdr.violation_data_list);
    ev.detail.complete();
    
  }
  



}
