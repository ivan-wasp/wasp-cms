import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Editor, Toolbar } from 'ngx-editor';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { CarData, CustomPageData, DATA_TYPE } from 'src/app/schema';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-custom-page-detail',
  templateUrl: './custom-page-detail.page.html',
  styleUrls: ['./custom-page-detail.page.scss'],
})
export class CustomPageDetailPage implements OnInit {
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  custom_page_id = null;
  custom_page_data: CustomPageData = null;
  checking_custom_page_data: CustomPageData = null;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_custom_page_data_list = null;

  static_page_url_list = this.dataService.getStaticPageUrlList();

  readonly = true;

  upload_type = null;

  html_content_img_url: string = null;

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
        if (params && params.custom_page_id) {
          this.custom_page_id = parseInt(params.custom_page_id);
        }
      }
    });
  }


  ngOnInit(): void {
    this.editor = new Editor();
    if (this.custom_page_id != null) {
      this.getCustomPageData();
    }
    else {
      this.readonly = false;
      this.setNewCustomPageDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
    this.getCustomPageDataList();
  }


  getCustomPageDataList() {
    this.dataService.resetTableData();

    let send_data = {
      data_type:"custom_page_data"
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {

      console.log("all_custom_page_data_list: ", res.data);
      if (res.result == 'success') {
        this.all_custom_page_data_list = res.data;
      } else {
        this.commonService.openErrorSnackBar();
      }
    });

  }


  setNewCustomPageDataTemplate() {
    this.custom_page_data = {
      "id": null,
      "data_type": DATA_TYPE.CUSTOM_PAGE_DATA,
      "create_date": '',
      "release_date": '',
      "shortlisted": false,
      "popular": false,
      "disabled": false,
      "short_name": "",
      "zh_title": "",
      "en_title": "",
      "zh_category": "",
      "en_category": "",
      "category_color": "",
      "youtube_only": false,
      "youtube_url": "",
      "app_visible": false,
      "web_visible": false,
      "banner_img_url_list": [],
      "html_content": "",
      "zh_button_title": "",
      "en_button_title": "",
      "link_to": "",
      "static_page_url": "",
      "url": "",
      "car_id": null,
      "car_model": "",
      "custom_page_id": null,
      "extra_data": null
    };
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  getCustomPageData() {
    let send_data = {
      id: this.custom_page_id,
      data_type: "custom_page_data"
    }
    // console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log("custom_page_data: ", res.data);
      if (res.result == "success") {
        this.custom_page_data = JSON.parse(JSON.stringify(res.data));
        this.checking_custom_page_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    function hasWhiteSpace(s) {
      return s.indexOf(' ') >= 0;
    }
    console.log(this.custom_page_data);
    let send_data = {
      id: this.custom_page_data.id
    }
    if (this.custom_page_data.short_name == null || this.custom_page_data.short_name == ''){
      return this.commonService.openErrorSnackBar("必須輸入short name");
    }
    if (this.custom_page_data.zh_title == null || this.custom_page_data.zh_title == ''){
      return this.commonService.openErrorSnackBar("必須輸入中文標題");
    }
    if (this.custom_page_data.release_date == null || this.custom_page_data.release_date == ''){
      return this.commonService.openErrorSnackBar("必須輸入發佈日期");
    }
    if (this.custom_page_data.banner_img_url_list.length <= 0){
      return this.commonService.openErrorSnackBar("必須上載封面圖片");
    }
    if (hasWhiteSpace(this.custom_page_data.short_name)){
      return this.commonService.openErrorSnackBar("short name不可輸入空白鍵");
    }
    if (this.custom_page_data.link_to != undefined && this.custom_page_data.link_to != null && this.custom_page_data.link_to != '') {
      if (this.custom_page_data.zh_button_title == null || this.custom_page_data.zh_button_title == ''){
        return this.commonService.openErrorSnackBar("必須輸入button文字");
      }
    }
    if (this.custom_page_data.youtube_only && this.custom_page_data.youtube_url == ''){
      return this.commonService.openErrorSnackBar("必須輸入Youtube url");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.custom_page_data, this.checking_custom_page_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_custom_page, send_data, true).then((res: Response) => {

      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.custom_page_data = JSON.parse(JSON.stringify(res.data));
        this.checking_custom_page_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        switch (res.data) {
          case 'duplicate short name':
            this.commonService.openErrorSnackBar("已有相同short name");
            break;
          default:
            this.commonService.openErrorSnackBar("未能更新資料");
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }


  createNewCustomPage() {
    function hasWhiteSpace(s) {
      return s.indexOf(' ') >= 0;
    }
    if (this.custom_page_data.short_name == null || this.custom_page_data.short_name == ''){
      return this.commonService.openErrorSnackBar("必須輸入short name");
    }
    if (this.custom_page_data.zh_title == null || this.custom_page_data.zh_title == ''){
      return this.commonService.openErrorSnackBar("必須輸入中文標題");
    }
    if (this.custom_page_data.release_date == null || this.custom_page_data.release_date == ''){
      return this.commonService.openErrorSnackBar("必須選擇發佈日期");
    }
    if (this.custom_page_data.banner_img_url_list.length <= 0){
      return this.commonService.openErrorSnackBar("必須上載封面圖片");
    }
    if (this.custom_page_data.link_to != undefined && this.custom_page_data.link_to != null && this.custom_page_data.link_to != '') {
      if (this.custom_page_data.zh_button_title == null || this.custom_page_data.zh_button_title == ''){
        return this.commonService.openErrorSnackBar("必須輸入button文字");
      }
    }
    if (hasWhiteSpace(this.custom_page_data.short_name)){
      return this.commonService.openErrorSnackBar("short name不可輸入空白鍵");
    }
    if (this.custom_page_data.youtube_only && this.custom_page_data.youtube_url == ''){
      return this.commonService.openErrorSnackBar("必須輸入Youtube url");
    }

    console.log(this.custom_page_data);
    this.apiService.postFromServer(ApiPath.new_custom_page, this.custom_page_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.custom_page_id = res.data.id;
        this.custom_page_data = JSON.parse(JSON.stringify(res.data));
        this.checking_custom_page_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/custom-page-detail?custom_page_id=' + res.data.id);
        }, 1000);
      } else {
        switch (res.data) {
          case 'duplicate short name':
            this.commonService.openErrorSnackBar("已有相同short name");
            break;

          default:
            this.commonService.openErrorSnackBar("未能建立資料");
            break;
        }

      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  carChange($event){
    let car_id = $event.value;
    if (car_id != null){
      this.custom_page_data.car_model = this.dataService.car_data_list$.value.find(d => d.id == car_id).model;
      console.log(this.custom_page_data.car_model);
    }
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
            case 'banner_img_url_list':
              this.custom_page_data.banner_img_url_list = [upload_base64_to_server.data];
              break;
            case 'html_content_img_url':
              this.html_content_img_url = upload_base64_to_server.data;
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

  getCarInfo(car_id: number){
    return this.dataService.car_data_list$.value == null ? null : this.dataService.car_data_list$.value.find(data => (data.id == car_id) );
  }


  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  selectionDateChanged(e) {
    this.custom_page_data.release_date = this.commonService.GetDateTimeMatchBackendFormat(new Date(e.value));

  }


}
