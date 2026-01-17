import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { CarDamage, CarDamageCategory, CarDamageFrontSubcategory, CarDamageLeftSideSubcategory, CarDamageRearSubcategory, CarDamageRightSideSubcategory, DATA_TYPE, OrderStatus, ReturnVehicleReport, VehicleRentalAgreement } from 'src/app/schema';
import { TranslateService } from '@ngx-translate/core';
import SignaturePad from 'signature_pad';

const { Camera } = Plugins;

@Component({
  selector: 'app-rvr',
  templateUrl: './rvr.page.html',
  styleUrls: ['./rvr.page.scss'],
})
export class RvrPage implements OnInit {


  order_id = null;
  order_data = null;

  return_vehicle_report: ReturnVehicleReport = null;
  selected_car_damage_index: number = null;
  selected_category: CarDamageCategory = CarDamageCategory.front;
  selected_subcategory: CarDamageFrontSubcategory | CarDamageLeftSideSubcategory | CarDamageRightSideSubcategory | CarDamageRearSubcategory = null;
  subcategory_list: any = this.carDamageFrontSubcategory;

  slideOpts = {
    initialSlide: 1,
    autoHeight: true
  };

  @ViewChild('canvas', { static: false }) signaturePadElement;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;

  stepHour = 1;
  stepMinute = 1;
  enableMeridian = false;
  showSeconds = false;

  public get cDC(): typeof CarDamageCategory {
    return CarDamageCategory;
  }
  public get carDamageCategory() {
    return Object.keys(CarDamageCategory);
  }
  public get carDamageFrontSubcategory() {
    return Object.keys(CarDamageFrontSubcategory);
  }
  public get carDamageLeftSideSubcategory() {
    return Object.keys(CarDamageLeftSideSubcategory);
  }
  public get carDamageRightSideSubcategory() {
    return Object.keys(CarDamageRightSideSubcategory);
  }
  public get carDamageRearSubcategory() {
    return Object.keys(CarDamageRearSubcategory);
  }
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private translateService: TranslateService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.order_id) {
        this.order_id = parseInt(params.order_id);
      }
    });
  }

  async ngOnInit() {
    if (this.order_id != null && this.order_id != '') {
      const get_order_data: Response = await this.dataService.getOrderDataWithAllOtherDataByOrderId(this.order_id);
      if (get_order_data.result == 'success') {
        this.order_data = get_order_data.data
      }
      console.log(this.order_data);
      const get_return_vehicle_report_by_order_id: Response = await this.dataService.getReturnVehicleReportByOrderId(this.order_data.id);
      if (get_return_vehicle_report_by_order_id.result == 'success') {
        if (get_return_vehicle_report_by_order_id.data != null) {
          this.return_vehicle_report = get_return_vehicle_report_by_order_id.data;
          this.return_vehicle_report.car_id = this.order_data.car_data.id;
          this.return_vehicle_report.car_data = this.order_data.car_data;
          this.return_vehicle_report.user_id = this.order_data.user_data.id;
          this.return_vehicle_report.user_data = this.order_data.user_data;
          this.return_vehicle_report.order_id = this.order_data.id;
          this.return_vehicle_report.order_data = this.order_data;
          this.return_vehicle_report.admin_id = this.auth.getAdminData().id;
          this.return_vehicle_report.admin_username = this.auth.getAdminData().username;
        }
      }
      console.log(this.return_vehicle_report);
      setTimeout(() => {
        this.initSignaturePad();
      }, 1000);
    }
  }

  initSignaturePad() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signaturePad.clear();
    this.signaturePad.penColor = 'rgb(56,128,255)';
  }

  newCarDamage() {
    let new_car_damage: CarDamage = {
      category: null,
      category_name: "",
      subcategory: null,
      subcategory_name: '',
      img_url_list: []
    }
    this.return_vehicle_report.car_damage_list.push(new_car_damage);
  }

  async selectImageSource(category, subcategory) {
    this.selected_category = category;
    this.selected_subcategory = subcategory;
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

  async confirmSignature() {

    let send_data = {
      file_name: '',
      file_type: 'png',
      base64: this.signaturePad.toDataURL()
    }
    this.commonService.isLoading = true;
    const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
    this.commonService.isLoading = false;
    if (upload_base64_to_server.result == "success") {
      this.return_vehicle_report.user_signature_img_url = upload_base64_to_server.data;
      this.signaturePad.clear();
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

      // upload_base64_to_server.data
      let index = this.return_vehicle_report.car_damage_list.findIndex((d: CarDamage) => d.category == this.selected_category && d.subcategory == this.selected_subcategory);
      if (index != -1) {
        this.return_vehicle_report.car_damage_list[index].img_url_list.push(upload_base64_to_server.data);
      }
      else {
        let car_damage: CarDamage = {
          category: this.selected_category,
          category_name: this.translateService.translations[this.translateService.currentLang]['car_damage'][this.selected_category],
          subcategory: this.selected_subcategory,
          subcategory_name: this.translateService.translations[this.translateService.currentLang]['car_damage'][this.selected_subcategory],
          img_url_list: [upload_base64_to_server.data]
        }
        this.return_vehicle_report.car_damage_list.push(car_damage);
        this.selected_car_damage_index = this.return_vehicle_report.car_damage_list.findIndex((d: CarDamage) => d.category == this.selected_category && d.subcategory == this.selected_subcategory);
      }
      console.log(this.return_vehicle_report.car_damage_list);
    }
    else {
      this.commonService.openErrorSnackBar("無法上載檔案");
    }

    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  }

  getCarDamge(category, subcategory) {
    return this.return_vehicle_report.car_damage_list.find((d: CarDamage) => d.category == category && d.subcategory == subcategory);
  }

  removeCarDamageImage(category, subcategory, index) {
    let car_damage_index = this.return_vehicle_report.car_damage_list.findIndex((d: CarDamage) => d.category == category && d.subcategory == subcategory);
    this.return_vehicle_report.car_damage_list[car_damage_index].img_url_list.splice(index, 1);
  }

  async UpdateVehicleRentalAgreement() {
    if (this.return_vehicle_report.hasOwnProperty('id') && this.return_vehicle_report.id != null) {
      const update_return_vehicle_report: Response = await this.dataService.updateReturnVehicleReport(this.return_vehicle_report);
      console.log(update_return_vehicle_report);
      if (update_return_vehicle_report.result == 'success') {
        this.return_vehicle_report = update_return_vehicle_report.data;
        this.commonService.openSnackBar("儲存成功");
      }
      else {
        this.commonService.openErrorSnackBar();
      }
    }
  }


  async generatePdf() {
    const generate_pdf: Response = await this.dataService.generateReturnVehicleReportPdfByRvrData(this.return_vehicle_report);
    console.log("generate_pdf: ", generate_pdf);
    if (generate_pdf.result == 'success') {
      this.commonService.downloadMedia(generate_pdf.data, true);
      this.commonService.openSnackBar("已產生交還車輛報告");

      if (this.return_vehicle_report.car_data.keyless_type == '') {
        this.presentUpdateOrderStatusActionSheet();
      }
    }
    else {
      this.commonService.openErrorSnackBar();
    }
  }


  async presentUpdateOrderStatusActionSheet() {
    let buttons = [
      {
        text: '更新',
        handler: () => {
          let send_data = {
            id: this.order_data.id,
            status: OrderStatus.completed
          };

          this.apiService.postFromServer(ApiPath.update_order_handler, send_data, true).then((res: Response) => {
            if (res.result == "success") {
              this.commonService.openSnackBar("已更新資料", null, 1000);
            } else {
              this.commonService.openErrorSnackBar("未能更新資料");
            }
          }, err => {
            this.commonService.openErrorSnackBar();
          });
        }
      },
      {
        text: '稍後',
        handler: () => {
          window.history.back();
        }
      }
    ];

    let actionSheet = await this.actionSheetCtrl.create({
      header: '要把訂單狀態更新成《已完結》？',
      buttons
    });
    await actionSheet.present();
  }


  async addCarDamageToCar(category, subcategory) {
    let car_damage: CarDamage = this.getCarDamge(category, subcategory);
    if (car_damage == null) {
      return this.commonService.openErrorSnackBar();
    }
    const update_car_data_result: Response = await this.dataService.addCarDamageToCarByCarId(this.return_vehicle_report.car_id, car_damage);
    console.log("update_car_data_result: ", update_car_data_result);
    if (update_car_data_result.result == 'success') {
      this.commonService.openSnackBar("已加至車輛原有破損列表");
    }
    else {
      this.commonService.openErrorSnackBar();
    }
  }


  async submittedDatetimeChange(e) {
    // console.log(e.value);
    this.return_vehicle_report.submitted_datetime = this.commonService.GetDateTimeMatchBackendFormat(new Date(e.value));
    // console.log(this.return_vehicle_report.submitted_datetime);
  }


  resetSubmittedDatetime() {
    this.return_vehicle_report.submitted_datetime = '';
  }

}
