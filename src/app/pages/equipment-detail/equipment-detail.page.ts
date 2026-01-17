import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { ItemReorderEventDetail } from '@ionic/core';
import { Location } from '@angular/common';
import { CarData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.page.html',
  styleUrls: ['./equipment-detail.page.scss'],
})
export class EquipmentDetailPage implements OnInit {

  equipment_id = null;

  equipment_data = null;
  checking_equipment_data = null;

  upload_type = null;

  readonly = true;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();

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
        if (params && params.equipment_id) {
          this.equipment_id = parseInt(params.equipment_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.equipment_id != null) {
      this.getEquipmentData();
    }
    else {
      this.readonly = false;
      this.setNewEquipmentDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }

  }

  setNewEquipmentDataTemplate() {
    this.equipment_data = {
      "id": null,
      "data_type": "equipment_data",
      "create_date": "",
      "disabled": false,
      "zh_name": "",
      "en_name": "",
      "category": "",
      "company": "",
      "price_per_month": null,
      "applicable_car_id_list": [],
      "img_url_list": []
    };
  }

  getEquipmentData() {
    let send_data = {
      id: this.equipment_id,
      data_type: "equipment_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.equipment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_equipment_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
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
            case 'img_url_list':
              this.equipment_data.img_url_list.push(upload_base64_to_server.data);
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

  save() {
    let send_data = {
      id: this.equipment_data.id
    }

    if (this.equipment_data.zh_name == null || this.equipment_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文名稱");
    }
    if (!Number.isInteger(this.equipment_data.price_per_month) || this.equipment_data.price_per_month < 0 || this.equipment_data.price_per_month === null || this.equipment_data.price_per_month === '') {
      return this.commonService.openErrorSnackBar("必須填寫每月租金");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.equipment_data, this.checking_equipment_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_equipment, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.equipment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_equipment_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        this.commonService.isLoading = false;
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

  createNewEquipment() {

    if (this.equipment_data.zh_name == null || this.equipment_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文名稱");
    }
    if (!Number.isInteger(this.equipment_data.price_per_month) || this.equipment_data.price_per_month < 0 || this.equipment_data.price_per_month === null || this.equipment_data.price_per_month === '') {
      return this.commonService.openErrorSnackBar("必須填寫每月租金");
    }
    this.apiService.postFromServer(ApiPath.new_equipment, this.equipment_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.equipment_id = res.data.id;
        this.equipment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_equipment_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/equipment-detail?equipment_id=' + res.data.id);
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

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }




  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.equipment_data.img_url_list = ev.detail.complete(this.equipment_data.img_url_list);
    ev.detail.complete();
  }

}
