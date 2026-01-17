import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';

@Component({
  selector: 'app-rbb-equipment-detail',
  templateUrl: './rbb-equipment-detail.page.html',
  styleUrls: ['./rbb-equipment-detail.page.scss'],
})
export class RbbEquipmentDetailPage implements OnInit {


  rbb_equipment_id = null;

  rbb_equipment_data = null;
  checking_rbb_equipment_data = null;

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
        if (params && params.rbb_equipment_id) {
          this.rbb_equipment_id = parseInt(params.rbb_equipment_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.rbb_equipment_id != null) {
      this.getRbbEquipmentData();
    }
    else {
      this.readonly = false;
      this.setNewRbbEquipmentDataTemplate();
    }
  }

  setNewRbbEquipmentDataTemplate() {
    this.rbb_equipment_data = {
      "id": null,
      "data_type": "rbb_equipment_data",
      "create_date": "",
      "disabled": false,
      "zh_name": "",
      "en_name": "",
      "price": ""
    };
  }

  getRbbEquipmentData() {
    let send_data = {
      id: this.rbb_equipment_id,
      data_type: "rbb_equipment_data"
    }
    
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.rbb_equipment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_rbb_equipment_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.rbb_equipment_data.id
    }
    if (this.rbb_equipment_data.zh_name == undefined || this.rbb_equipment_data.zh_name == null || this.rbb_equipment_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文名稱");
    }
    if (this.rbb_equipment_data.price == undefined || this.rbb_equipment_data.price == null || this.rbb_equipment_data.price == '') {
      return this.commonService.openErrorSnackBar("必須輸入價錢");
    }
    send_data = this.commonService.updateDataChecker(send_data, this.rbb_equipment_data, this.checking_rbb_equipment_data);


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_rbb_equipment, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.readonly = true;
        this.rbb_equipment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_rbb_equipment_data = JSON.parse(JSON.stringify(res.data));
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

  createNewRbbEquipment() {

    if (this.rbb_equipment_data.zh_name == undefined || this.rbb_equipment_data.zh_name == null || this.rbb_equipment_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須輸入中文名稱");
    }
    if (this.rbb_equipment_data.price == undefined || this.rbb_equipment_data.price == null || this.rbb_equipment_data.price == '') {
      return this.commonService.openErrorSnackBar("必須輸入價錢");
    }

    this.apiService.postFromServer(ApiPath.new_rbb_equipment, this.rbb_equipment_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.rbb_equipment_id = res.data.id;
        this.rbb_equipment_data = JSON.parse(JSON.stringify(res.data));
        this.checking_rbb_equipment_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/rbb-equipment-detail?rbb_equipment_id=' + res.data.id);
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


}
