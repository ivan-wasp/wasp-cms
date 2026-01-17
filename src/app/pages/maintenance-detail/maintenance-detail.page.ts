import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { FactoryData } from 'src/app/schema';


@Component({
  selector: 'app-maintenance-detail',
  templateUrl: './maintenance-detail.page.html',
  styleUrls: ['./maintenance-detail.page.scss'],
})
export class MaintenanceDetailPage implements OnInit {

  maintenance_id = null;

  maintenance_data = null;
  checking_maintenance_data = null;

  upload_type = null;

  readonly = true;

  all_factory_data_list$: Observable<FactoryData[]> = this.dataService.factory_data_list$.pipe();
  all_maintenane_category_data_list = null;

  maintenance_category_data = null;
  
  subcategory_index = null;

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
        if (params && params.maintenance_id) {
          this.maintenance_id = parseInt(params.maintenance_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.maintenance_id != null) {
      this.getMaintenanceData();
    }
    else {
      this.readonly = false;
      this.setNewMaintenanceDataTemplate();
    }
    this.dataService.getAllFactoryData();
    this.getAllMaintenanceCategoryData();
  }

  setNewMaintenanceDataTemplate() {
    this.maintenance_data = {
      "id": null,
      "data_type": "maintenance_data",
      "create_date": "",
      "disabled": false,
      "zh_service_name": "",
      "en_service_name": "",
      "icon_url": "",
      "free_once_per_month": false,
      "appliable_factory_id_list": [],
      "index": null,
      "maintenance_category_list": [],
      "allow_user_booking": false
    };
  }

  setNewMaintenanceCategoryDataTemplate() {
    this.maintenance_category_data = {
      "id": null,
      "data_type": "maintenance_category_data",
      "create_date": "",
      "disabled": false,
      "zh_name": "",
      "en_name": "",
    };
  }

  getMaintenanceData() {
    let send_data = {
      id: this.maintenance_id,
      data_type: "maintenance_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.maintenance_data = JSON.parse(JSON.stringify(res.data));
        this.checking_maintenance_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getAllMaintenanceCategoryData() {
    let send_data = {
      data_type: "maintenance_category_data"
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {
      console.log("maintenance_category_data:", res.data);
      if (res.result == "success") {
        this.all_maintenane_category_data_list = res.data;

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.maintenance_data.id
    }
    if (this.maintenance_data.zh_service_name == undefined || this.maintenance_data.zh_service_name == null || this.maintenance_data.zh_service_name == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文名");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.maintenance_data, this.checking_maintenance_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    console.log(send_data);
    this.apiService.postFromServer(ApiPath.update_maintenance, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.maintenance_data = JSON.parse(JSON.stringify(res.data));
        this.checking_maintenance_data = JSON.parse(JSON.stringify(res.data));
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

  createNewMaintenance() {
    if (this.maintenance_data.zh_service_name == undefined || this.maintenance_data.zh_service_name == null || this.maintenance_data.zh_service_name == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文名");
    }
    this.apiService.postFromServer(ApiPath.new_maintenance, this.maintenance_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.maintenance_id = res.data.id;
        this.maintenance_data = JSON.parse(JSON.stringify(res.data));
        this.checking_maintenance_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/maintenance-detail?maintenance_id=' + res.data.id);
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

  createNewMaintenanceCategory() {
    if (this.maintenance_category_data.zh_name == undefined || this.maintenance_category_data.zh_name == null || this.maintenance_category_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須輸入維修項目中文名");
    }

    if (this.maintenance_category_data.id != null){
      this.apiService.postFromServer(ApiPath.update_maintenance_category, this.maintenance_category_data, true).then((res: Response) => {
        if (res.result == "success") {
          this.commonService.openSnackBar("已建立資料");
          let index = this.all_maintenane_category_data_list.findIndex(d => d.id == res.data.id);
          if (index != -1){
            this.all_maintenane_category_data_list[index] = res.data;
          }
          this.maintenance_category_data = null;
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
    else {
      this.apiService.postFromServer(ApiPath.new_maintenance_category, this.maintenance_category_data, true).then((res: Response) => {
        if (res.result == "success") {
          this.all_maintenane_category_data_list.push(res.data);
          this.setNewMaintenanceCategoryDataTemplate();
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
          this.maintenance_data.icon_url = (upload_base64_to_server.data);
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  searchFactory(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    event.component.items = this.dataService.factory_data_list$.value.filter(factory => {
      return factory.id.toString().toLowerCase().indexOf(text) !== -1 ||
        factory.zh_name.toLowerCase().indexOf(text) !== -1 ||
        factory.en_name.toLowerCase().indexOf(text) !== -1 ||
      factory.phone.toLowerCase().indexOf(text) !== -1 ||
      factory.email.toLowerCase().indexOf(text) !== -1 ||
      factory.zh_address.toLowerCase().indexOf(text) !== -1 ||
      factory.en_address.toLowerCase().indexOf(text) !== -1
    });
    event.component.endSearch();

  }

  getFactoryDataById(id) {
    return this.dataService.factory_data_list$.value != null ? this.dataService.factory_data_list$.value.filter(d => d.id == id)[0] : null;
  }

  getMaintenanceCategoryDataById(id) {
    return this.all_maintenane_category_data_list != null ? this.all_maintenane_category_data_list.filter(d => d.id == id)[0] : null;
  }

  addCategory(item){
    if (this.subcategory_index == null){
      if (this.maintenance_data.maintenance_category_list.filter(d => d.maintenance_category_id == item.id).length <= 0){
        this.maintenance_data.maintenance_category_list.push(
          {
            maintenance_category_id: item.id,
            children: []
          }
        );
      }
    }
    else{
      if (this.maintenance_data.maintenance_category_list[this.subcategory_index].children.indexOf(item.id) == -1){
        this.maintenance_data.maintenance_category_list[this.subcategory_index].children.push(item.id)
      }
    }
    console.log(this.maintenance_data.maintenance_category_list);
  }

  selectCategory(index){
    if (this.subcategory_index == null || (this.subcategory_index != null && this.subcategory_index != index)){
      this.subcategory_index = index;
    }
    else{
      this.subcategory_index = null;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    this.subcategory_index = null;
    moveItemInArray(this.maintenance_data.maintenance_category_list, event.previousIndex, event.currentIndex);
  }

  drop2(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.maintenance_data.maintenance_category_list[this.subcategory_index.children], event.previousIndex, event.currentIndex);
  }

}
