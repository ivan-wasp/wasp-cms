import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';


@Component({
  selector: 'app-faq-detail',
  templateUrl: './faq-detail.page.html',
  styleUrls: ['./faq-detail.page.scss'],
})
export class FaqDetailPage implements OnInit {


  faq_id = null;

  faq_data = null;
  checking_faq_data = null;

  upload_type = null;

  readonly = true;

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
        if (params && params.faq_id) {
          this.faq_id = parseInt(params.faq_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.faq_id != null) {
      this.getFaqData();
    }
    else {
      this.readonly = false;
      this.setNewPlateDataTemplate();
    }
  }

  setNewPlateDataTemplate() {
    this.faq_data = {
      "id": null,
      "data_type": "faq_data",
      "create_date": "",
      "disabled": false,
      "zh_category": "",
      "en_category": "",
      "detail_list": [
          {
              "zh_title": "",
              "en_title": "",
              "zh_content": "",
              "en_content": ""
          }
      ],
      "index": null,
      "icon_img_url": ""
    };
  }

  getFaqData() {
    let send_data = {
      id: this.faq_id,
      data_type: "faq_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.faq_data = JSON.parse(JSON.stringify(res.data));
        this.checking_faq_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.faq_data.id
    }
    if (this.faq_data.zh_category == undefined || this.faq_data.zh_category == null || this.faq_data.zh_category == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文分類");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.faq_data, this.checking_faq_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }
    this.apiService.postFromServer(ApiPath.update_faq, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.faq_data = JSON.parse(JSON.stringify(res.data));
        this.checking_faq_data = JSON.parse(JSON.stringify(res.data));
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

  createNewFaq() {

    if (this.faq_data.zh_category == undefined || this.faq_data.zh_category == null || this.faq_data.zh_category == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文分類");
    }
    
    this.apiService.postFromServer(ApiPath.new_faq, this.faq_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.faq_id = res.data.id;
        this.faq_data = JSON.parse(JSON.stringify(res.data));
        this.checking_faq_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/faq-detail?faq_id=' + res.data.id);
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

  addQuestionAndAnswer(){
    this.faq_data.detail_list.push({
      "zh_title": "",
      "en_title": "",
      "zh_content": "",
      "en_content": ""
    })
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
        console.log(base64);

        let send_data = {
          file_name: '',
          file_type: this.commonService.getFileType(fileList[0].type),
          base64: base64
        }
        this.commonService.isLoading = true;
        const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
        this.commonService.isLoading = false;
        if (upload_base64_to_server.result == "success") {
            this.faq_data.icon_img_url = upload_base64_to_server.data;
            
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

}
