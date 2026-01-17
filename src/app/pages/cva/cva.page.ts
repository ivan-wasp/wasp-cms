import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import SignaturePad from 'signature_pad';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ItemReorderEventDetail } from '@ionic/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Observable } from 'rxjs';
import { CarData } from 'src/app/schema';

const { Camera } = Plugins;

@Component({
  selector: 'app-vra',
  templateUrl: './cva.page.html',
  styleUrls: ['./cva.page.scss'],
})
export class CvaPage implements OnInit {

  car_data_list = null;
  order_id = null;
  order_data = null;
  vrb = {
    order_reference_number: "",
    order_id: null,
    user_identity_number: "",
    user_zh_full_name: "",
    user_en_full_name: "",
    user_phone: "",
    user_address: "",
    car_category: "",
    car_engine_number: "",
    car_brand: "",
    car_color_zh_name: "",
    car_chassis_number: "",
    car_model: "",
    car_tire_brand: "",
    car_tire_model: "",
    car_tire_size: "",
    car_year: "",
    odometer_value: "",
    car_register_number: "",
    order_start_date: "",
    order_pick_up_time: "",
    order_end_date: "",
    order_return_time: "",
    order_rental_amount: "",
    order_deposit_amount: "",
    left_top_list: [],
    left_bottom_list: [],
    middle_top_list: [],
    middle_middle_list: [],
    middle_bottom_list: [],
    right_top_list: [],
    right_bottom_list: [],
    left_top_img_url_list: [],
    left_bottom_img_url_list: [],
    middle_top_img_url_list: [],
    middle_middle_img_url_list: [],
    middle_bottom_img_url_list: [],
    right_top_img_url_list: [],
    right_bottom_img_url_list: [],
    wasp_signature_img_url: "",
    user_signature_img_url: "",
    other_img_url_list: [],
    staff_name:"",
    agreement_date:"",
    agreement_time:"",
    exchange_start_date:"",
    exchange_end_date:"",
    new_car_model:"",
    new_car_number_plate:"",
    check_report_remark	:"", // new data for storing remark
  };
  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  car_data = null;

  inspection_option_list = [
    { "name": "A1  小劃痕", "value": "A1" },
    { "name": "A2  劃痕", "value": "A2" },
    { "name": "A3 大劃痕", "value": "A3" },
    { "name": "E1 少部份凹", "value": "E1" },
    { "name": "E2 幾個凹陷", "value": "E2" },
    { "name": "E3 多個凹陷", "value": "E3" },
    { "name": "U1 小凹頭", "value": "U1" },
    { "name": "U2 凹痕", "value": "U2" },
    { "name": "U3 大凹痕", "value": "U3" },
    { "name": "W1 維修標記/波(難以檢測到)", "value": "W1" },
    { "name": "W2 維修標記/波", "value": "W2" },
    { "name": "W3 明顯的維修標記/波(需要重新繪製)", "value": "W3" },
    { "name": "S1 銹蝕", "value": "S1" },
    { "name": "S2 重鏽", "value": "S2" },
    { "name": "C1 腐蝕", "value": "C1" },
    { "name": "C2 重腐蝕", "value": "C2" },
    { "name": "P - 油漆標記", "value": "P" },
    { "name": "H - 油漆褪色", "value": "H" },
    { "name": "X 需要更換", "value": "X" },
    { "name": "XX 已更換", "value": "XX" },
    { "name": "B1 帶劃痕的小凹痕(像拇指一樣大)", "value": "B1" },
    { "name": "B2 帶劃痕的凹痕(大小如手平)", "value": "B2" },
    { "name": "B3 帶劃痕的大凹痕(大小如肘部)", "value": "B3" },
    { "name": "Y1 小孔或裂紋", "value": "Y1" },
    { "name": "Y2 孔或裂紋", "value": "Y2" },
    { "name": "Y3 大孔或裂紋", "value": "Y3" },
    { "name": "X1 擋風玻璃上的小裂紋(約 1 厘米)", "value": "X1" },
    { "name": "R 修復擋風玻璃上的裂紋", "value": "R" },
    { "name": "RX 擋風玻璃上的裂紋(需要更換)", "value": "RX" },
    { "name": "G - 碎石痕", "value": "G" },
  ];

  @ViewChild('canvas', { static: false }) signaturePadElement;
  @ViewChild('canvas2', { static: false }) signaturePadElement2;
  signaturePad: any;
  signaturePad2: any;
  canvasWidth: number;
  canvasHeight: number;

  slideOpts = {
    initialSlide: 1,
    autoHeight: true
  };

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
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signaturePad.clear();
    this.signaturePad.penColor = 'rgb(56,128,255)';

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
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
  }

  getOrderData() {
    let send_data = {
      order_id: this.order_id
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_order_data_with_all_other_data_by_order_id, send_data, true).then((res: Response) => {
      console.log(res.data);
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
    this.vrb.order_reference_number = this.order_data.reference_number;
    this.vrb.order_id = this.order_data.id;
    console.log(this.vrb);
    console.log(this.auth.getAdminData());
    this.vrb.staff_name = this.auth.getAdminData().username;

    if (this.order_data.user_data != undefined && this.order_data.user_data != null){
      this.vrb.user_zh_full_name = this.order_data.user_data.zh_full_name;
      this.vrb.user_en_full_name = this.order_data.user_data.en_full_name;
      this.vrb.user_identity_number = this.order_data.user_data.identity_number;
      this.vrb.user_phone = this.order_data.user_data.phone;
      this.vrb.user_address = this.order_data.user_data.address;

      // this.vrb.user_suspension_record = this.order_data.user_data.suspension_record;
      // this.vrb.user_penalty_record = this.order_data.user_data.penalty_record;
      // this.vrb.user_bankrupt_record = this.order_data.user_data.bankrupt_record;
    }
    if (this.order_data.car_data != undefined && this.order_data.car_data != null){
      this.vrb.car_category = this.order_data.car_data.category;
      this.vrb.car_engine_number = this.order_data.car_data.engine_number;
      this.vrb.car_brand = this.order_data.car_data.brand;
      this.vrb.car_color_zh_name = this.order_data.car_data.color_zh_name;
      this.vrb.car_chassis_number = this.order_data.car_data.chassis_number;
      this.vrb.car_model = this.order_data.car_data.model;
      this.vrb.car_tire_brand = this.order_data.car_data.tire_brand;
      this.vrb.car_tire_model = this.order_data.car_data.tire_model;
      this.vrb.car_tire_size = this.order_data.car_data.tire_size;
      this.vrb.car_year = this.order_data.car_data.year;
      this.vrb.car_register_number = this.order_data.car_data.plate;
    }


    // this.vrb.odometer_value = this.order_data;

    this.vrb.order_start_date = this.order_data.start_date;
    this.vrb.order_pick_up_time = this.order_data.pick_up_data.time;
    this.vrb.order_end_date = this.order_data.end_date;
    this.vrb.order_return_time = this.order_data.return_data.time;
    this.vrb.order_rental_amount = this.order_data.rental_amount;
    this.vrb.order_deposit_amount = this.order_data.deposit_amount;

    // this.vrb.left_top_list = this.order_data.
    // this.vrb.left_bottom_list = this.order_data.
    // this.vrb.middle_top_list = this.order_data.
    // this.vrb.middle_middle_list = this.order_data.
    // this.vrb.middle_bottom_list = this.order_data.
    // this.vrb.right_top_list = this.order_data.
    // this.vrb.right_bottom_list = this.order_data.
    // this.vrb.wasp_signature_img_url = this.order_data.
    // this.vrb.user_signature_img_url = this.order_data.
    // this.vrb.other_img_url_list = this.order_data.
  }

  async save() {
     // Upoad signature
    let wasp_signature_img_base64 = this.signaturePad.toDataURL();
    let send_data = {
      file_name: '',
      file_type: 'png',
      base64: wasp_signature_img_base64
    }
    this.commonService.isLoading = true;
    const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
    this.commonService.isLoading = false;
    if (upload_base64_to_server.result == "success") {
      this.vrb.wasp_signature_img_url = upload_base64_to_server.data;
    }
    else {
      this.commonService.openErrorSnackBar("無法上載檔案");
    }
    // Upoad signature 2 
    let user_signature_img_base64 = this.signaturePad2.toDataURL();
    let send_data2 = {
      file_name: '',
      file_type: 'png',
      base64: user_signature_img_base64
    }
    this.commonService.isLoading = true;
    const upload_base64_to_server2 = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data2, true);
    this.commonService.isLoading = false;
    if (upload_base64_to_server2.result == "success") {
      this.vrb.user_signature_img_url = upload_base64_to_server2.data;
    }
    else {
      this.commonService.openErrorSnackBar("無法上載檔案");
    }

    console.log(this.vrb);

    console.log("VRB",this.vrb);
    this.apiService.postFromServer(ApiPath.generate_change_vehicle_agreement_pdf_by_vrb_data, this.vrb, true).then((res: Response) => {
      // this.commonService.isLoading = false;
      if (res.result == "success") {

        let send_car_data = {
          id: this.order_data.car_id
        };
        if (this.vrb.odometer_value != "") {
          send_car_data['odometer_value'] = this.vrb.odometer_value;
        }
        this.apiService.postFromServer(ApiPath.update_car, send_car_data, true).then((res2: Response) => {
          setTimeout(() => {
            this.commonService.downloadMedia(res.data, true);
            this.commonService.openSnackBar("已產生更換車輛同意書");
            window.history.back();
          }, 500);
        }, err => {
          setTimeout(() => {
            this.commonService.downloadMedia(res.data, true);
            this.commonService.openSnackBar("已產生更換車輛同意書");
            window.history.back();
          }, 500);
        });
      }
      else {
        this.commonService.openErrorSnackBar("產生更換車輛同意書失敗");
      }
    });

  }

  async selectImageSource(type) {
    const buttons = [
      {
        text: '拍攝新照片',
        icon: 'camera',
        handler: () => {
          this.takePicture(CameraSource.Camera, type);
        }
      },
      {
        text: '從手機相簿選擇',
        icon: 'image',
        handler: () => {
          this.takePicture(CameraSource.Photos, type);
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
      this.takePicture(CameraSource.Photos, type);
    }
    else {
      const actionSheet = await this.actionSheetCtrl.create({
        header: '圖片來源',
        buttons
      });
      await actionSheet.present();
    }


  }


  async takePicture(source: CameraSource, type) {
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

      switch (type) {
        case 'other_img_url_list':
          this.vrb.other_img_url_list.push(upload_base64_to_server.data);
          break;
        case 'left_top_img_url_list':
          this.vrb.left_top_img_url_list.push(upload_base64_to_server.data);
          break;
        case 'left_bottom_img_url_list':
          this.vrb.left_bottom_img_url_list.push(upload_base64_to_server.data);
          break;
        case 'middle_top_img_url_list':
          this.vrb.middle_top_img_url_list.push(upload_base64_to_server.data);
          break;
        case 'middle_middle_img_url_list':
          this.vrb.middle_middle_img_url_list.push(upload_base64_to_server.data);
          break;
        case 'middle_bottom_img_url_list':
          this.vrb.middle_bottom_img_url_list.push(upload_base64_to_server.data);
          break;
        case 'right_top_img_url_list':
          this.vrb.right_top_img_url_list.push(upload_base64_to_server.data);
          break;
        case 'right_bottom_img_url_list':
          this.vrb.right_bottom_img_url_list.push(upload_base64_to_server.data);
          break;
      
        default:
          break;
      }
    }
    else {
      this.commonService.openErrorSnackBar("無法上載檔案");
    }

    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  }


  selectCar(ev) {
    console.log(this.car_data);
    console.log(ev.value.model);
    console.log(ev.value.plate);
    // this.car_data = 
    this.vrb.new_car_model = this.car_data.model;
    this.vrb.new_car_number_plate = this.car_data.plate;
    // this.clearPaymentDataList();

    // //REMARK reset date range selection
    // this.order_data.start_date = "";
    // this.order_data.end_date = "";
    // this.order_data.booking_date_list = [];
    // this.all_available_car_data_list = null;
    // this.booking_days = null;
    // this.car_rental_amount = null;

    // this.order_data.car_id = this.car_data.id;
    // this.getAvailableCampaign();
    // if (this.order_data.start_date != null && this.order_data.start_date != '' && this.order_data.end_date != null && this.order_data.end_date != '') {
    //   this.calculateRentalAmount();
    // }

    // if (this.order_data.start_date != null && this.order_data.start_date != '') {
    //   //TODO get restriction of pick up/return time
    //   this.getReturnAndPickupLimit();

    //   this.resetParking();
    //   this.resetPickUpAndReturnAddress();

    //   this.getEquipmentData();
    //   this.getProductData();
    // }

  }


  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.vrb.other_img_url_list = ev.detail.complete(this.vrb.other_img_url_list);
    ev.detail.complete();
  }

}
