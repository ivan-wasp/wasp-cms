import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';

@Component({
  selector: 'app-rbb-payment',
  templateUrl: './rbb-payment.component.html',
  styleUrls: ['./rbb-payment.component.scss'],
})
export class RbbPaymentComponent implements OnInit {

  @Input() rbb_payment_id = null;

  rbb_payment_data = null;
  checking_rbb_payment_data = null;

  readonly = true;


  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (this.rbb_payment_id != null && this.rbb_payment_id != ''){
      this.getRbbPaymentData();
      console.log(this.rbb_payment_id);
    }

  }


  getRbbPaymentData() {
    let send_data = {
      id: this.rbb_payment_id,
      data_type: "rbb_payment_data"
    }

    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.rbb_payment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_rbb_payment_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }


  updateRbbPaymentData() {

    let send_data = {
      'id': this.rbb_payment_data.id,
    }

    send_data = this.commonService.updateDataChecker(send_data, this.rbb_payment_data, this.checking_rbb_payment_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }
    this.apiService.postFromServer(ApiPath.update_rbb_payment, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.readonly = true;
        this.rbb_payment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_rbb_payment_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新帳單");
      } else {
        this.commonService.openErrorSnackBar();
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
        console.log(upload_base64_to_server.result);
        if (upload_base64_to_server.result == "success") {
          this.rbb_payment_data.payment_order_data = upload_base64_to_server.data;
          this.commonService.openSnackBar("上載完成，請儲存！");
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }


  resetEdit(){
    this.readonly = true;
    this.rbb_payment_data = JSON.parse(JSON.stringify(this.checking_rbb_payment_data));
  }

}
