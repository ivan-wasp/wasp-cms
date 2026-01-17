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
  selector: 'app-plate-detail',
  templateUrl: './plate-detail.page.html',
  styleUrls: ['./plate-detail.page.scss'],
})
export class PlateDetailPage implements OnInit {

  plate_id = null;

  plate_data = null;
  checking_plate_data = null;

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
        if (params && params.plate_id) {
          this.plate_id = parseInt(params.plate_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.plate_id != null) {
      this.getPlateData();
    }
    else {
      this.readonly = false;
      this.setNewPlateDataTemplate();
    }
  }

  setNewPlateDataTemplate() {
    this.plate_data = {
      "id": null,
      "data_type": "plate_data",
      "create_date": "",
      "disabled": false,
      "plate_number": "",
      "price": "",
      "sold": false
    };
  }

  getPlateData() {
    let send_data = {
      id: this.plate_id,
      data_type: "plate_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.plate_data = JSON.parse(JSON.stringify(res.data));
        this.checking_plate_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.plate_data.id
    }
    if (this.plate_data.plate_number == undefined || this.plate_data.plate_number == null || this.plate_data.plate_number == '') {
      return this.commonService.openErrorSnackBar("必須輸入車牌號碼");
    }
    if (this.plate_data.price == undefined || this.plate_data.price == null || this.plate_data.price == '') {
      return this.commonService.openErrorSnackBar("必須輸入價錢");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.plate_data, this.checking_plate_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_plate, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.plate_data = JSON.parse(JSON.stringify(res.data));
        this.checking_plate_data = JSON.parse(JSON.stringify(res.data));
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

  createNewPlate() {

    if (this.plate_data.plate_number == undefined || this.plate_data.plate_number == null || this.plate_data.plate_number == '') {
      return this.commonService.openErrorSnackBar("必須輸入車牌號碼");
    }
    if (this.plate_data.price == undefined || this.plate_data.price == null || this.plate_data.price == '') {
      return this.commonService.openErrorSnackBar("必須輸入價錢");
    }

    this.apiService.postFromServer(ApiPath.new_plate, this.plate_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.plate_id = res.data.id;
        this.plate_data = JSON.parse(JSON.stringify(res.data));
        this.checking_plate_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/plate-detail?plate_id=' + res.data.id);
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
