import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { PrerentOrderData, PrerentOrderStatus, UserData } from 'src/app/schema';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-prerent-order-detail',
  templateUrl: './prerent-order-detail.page.html',
  styleUrls: ['./prerent-order-detail.page.scss'],
})
export class PrerentOrderDetailPage implements OnInit {
  prerent_order_id = null;

  prerent_order_data: PrerentOrderData = null;
  checking_prerent_order_data: PrerentOrderData = null;

  user_data: UserData = null;

  readonly = true;

  send_quotation_created_notification: boolean = false;

  public get prerentOrderStatus(): typeof PrerentOrderStatus {
    return PrerentOrderStatus;
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
        if (params && params.prerent_order_id) {
          this.prerent_order_id = parseInt(params.prerent_order_id);
        }
      }
    });
  }

  ngOnInit() {
    this.cdf.detectChanges();
    if (this.prerent_order_id != null) {
      this.getPrerentOrderData();
    }
    else {
      this.readonly = false;
      // this.setNewCompensationDataTemplate();
    }

  }

  getPrerentOrderData() {
    let send_data = {
      id: this.prerent_order_id,
      data_type: "prerent_order_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.prerent_order_data = JSON.parse(JSON.stringify(res.data));
        this.checking_prerent_order_data = JSON.parse(JSON.stringify(res.data));

        if (this.prerent_order_data.user_id != null){
          this.getUserData();
        }
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  async getUserData() {
    const get_user_data_result: Response = await this.dataService.getUserDataById(this.prerent_order_data.user_id);
    console.log(get_user_data_result);
    if (get_user_data_result.result == 'success'){
      this.user_data = get_user_data_result.data;
    }
  }

  save() {
    let send_data = {
      id: this.prerent_order_data.id
    }

    send_data = this.commonService.updateDataChecker(send_data, this.prerent_order_data, this.checking_prerent_order_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    console.log(send_data);
    this.apiService.postFromServer(ApiPath.update_prerent_order, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.prerent_order_data = JSON.parse(JSON.stringify(res.data));
        this.checking_prerent_order_data = JSON.parse(JSON.stringify(res.data));
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
          this.prerent_order_data.payment_order_data = upload_base64_to_server.data;
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  removeImg(){
    this.prerent_order_data.payment_order_data = "";
  }


}
