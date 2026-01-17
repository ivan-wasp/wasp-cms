import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { ItemReorderEventDetail } from '@ionic/core';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppPage, CarData, SystemData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-banner-setting',
  templateUrl: './banner-setting.page.html',
  styleUrls: ['./banner-setting.page.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY',
        },
      }
    },
  ]
})
export class BannerSettingPage implements OnInit {

  readonly = true;
  upload_type = null;
  system_data = null;
  curr_index = -1;
  checking_system_data = null;

  system_data$: Observable<SystemData> = this.dataService.system_data$.pipe();
  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();

  all_custom_page_data_list = null;

  static_page_url_list = this.dataService.getStaticPageUrlList();

  app_page_list = Object.keys(AppPage).map((page) => {
    return page;
  });

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private location: Location,
    private cdf: ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
    if (this.dataService.car_data_list$.value == null){
      await this.dataService.getAllCarData();
    }
    await this.dataService.getSystemData();
    this.system_data = this.dataService.system_data$.value;
    this.checking_system_data = JSON.parse(JSON.stringify(this.dataService.system_data$.value));
    this.getCustomPageDataList();
  }

  getCustomPageDataList() {
    this.dataService.resetTableData();

    let send_data = {
      data_type:"custom_page_data",
      field_list: ['id', "title"]
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

  carChange($event, index){
    let car_id = $event.value;
    if (car_id != null){
      this.system_data.banner[index].car_model = this.dataService.car_data_list$.value.find(d => d.id == car_id).model;
    }
  }

  newBanner(){
    this.system_data.banner.push({
      "link_to": "",
      "static_page_url": "",
      "car_id": null,
      "car_model": "",
      "url": "",
      "custom_page_id": null,
      "extra_data": null,
      "img": "",
      "app_page_display_list": []
    });
    this.cdf.detectChanges();
  }

  cancelEdit(){
    this.readonly = true;
    this.system_data.banner = JSON.parse(JSON.stringify(this.checking_system_data.banner));
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.system_data.banner, event.previousIndex, event.currentIndex);
    console.log(this.system_data.banner);
  }

  remove(i){
    this.system_data.banner.splice(i,1);
    this.cdf.detectChanges();
  }

  uploadImage(index){
    if (this.upload_img == null) {
      return;
    }
    this.curr_index = index;
    this.upload_img.nativeElement.click();
  }


  uploadImg() {
    if (this.upload_img == null || this.commonService.isLoading) {
      return;
    }
    const fileList: FileList = this.upload_img.nativeElement.files;
    // if (fileList && fileList.length > 0) {
    //   Array.from(fileList).forEach(file => {
      let file = fileList[0];
        if (file.size/1024/1024 > 10){
          return this.commonService.openErrorSnackBar("不能上載大於10mb的案檔");
        }

        this.commonService.firstFileToBase64(file).then(async (base64: string) => {
          // console.log(base64);
  
          let send_data = {
            file_name: '',
            file_type: this.commonService.getFileType(file.type),
            base64: base64
          }
          this.commonService.isLoading = true;
          const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
          this.commonService.isLoading = false;
          if (upload_base64_to_server.result == "success") {
            console.log(upload_base64_to_server.data);
                this.system_data.banner[this.curr_index].img = upload_base64_to_server.data;
          } else {
            this.commonService.openErrorSnackBar("無法上載檔案");
          }
        })

    //   });
    //   return;

    // }
  }

  save() {
    let send_data = {
      id: this.system_data.id
    }
      console.log(this.system_data.banner);
      console.log(this.checking_system_data.banner);
    if (JSON.stringify(this.system_data.banner) != JSON.stringify(this.checking_system_data.banner)) {
      send_data['banner'] = this.system_data.banner;
    }
    console.log(this.system_data);
    console.log(this.checking_system_data);

    for(let i=0; i<this.system_data.banner.length; i++){
      if(this.system_data.banner[i].car_id == undefined || this.system_data.banner[i].car_id == null){
        this.system_data.banner[i].car_id = "";
        this.system_data.banner[i].car_model = "";
      }else{
        let temp_car = this.dataService.car_data_list$.value.find(data => (data.id == this.system_data.banner[i].car_id) );
        if(temp_car != null){
          this.system_data.banner[i].car_model = temp_car.model;
        }else{
          this.system_data.banner[i].car_model = "";
        }
      }
    }


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_system_data, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.readonly = true;
        this.system_data = JSON.parse(JSON.stringify(res.data));
        this.checking_system_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        this.commonService.openErrorSnackBar("未能更新資料");
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  getCarInfo(id){
    // this.selected_car
    return this.dataService.car_data_list$.value.find(data => (data.id == id) );
  }
}
