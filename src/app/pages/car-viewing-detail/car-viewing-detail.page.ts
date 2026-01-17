import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AppointmentData, AppointmentStatus, CarData, CompensationPaymentStatus, CompensationPaymentData, DATA_TYPE, OrderData, UserData, CarViewingStatus, CarViewingData } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';

@Component({
  selector: 'app-car-viewing-detail',
  templateUrl: './car-viewing-detail.page.html',
  styleUrls: ['./car-viewing-detail.page.scss'],
})
export class CarViewingDetailPage implements OnInit {
  car_viewing_id = null;

  car_viewing_data: CarViewingData = null;
  checking_car_viewing_data: CarViewingData = null;

  user_data: UserData = null;
  car_data: CarData = null;

  readonly = true;

  send_cancel_notification_to_user: boolean = false;

  public get carViewingStatus(): typeof CarViewingStatus {
    return CarViewingStatus;
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
        if (params && params.car_viewing_id) {
          this.car_viewing_id = parseInt(params.car_viewing_id);
        }
      }
    });
  }

  ngOnInit() {
    this.cdf.detectChanges();
    if (this.car_viewing_id != null) {
      this.getCarViewingData();
    }
    else {
      this.readonly = false;
      // this.setNewCompensationDataTemplate();
    }

  }

  getCarViewingData() {
    let send_data = {
      id: this.car_viewing_id,
      data_type: "car_viewing_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.car_viewing_data = JSON.parse(JSON.stringify(res.data));
        this.checking_car_viewing_data = JSON.parse(JSON.stringify(res.data));

        if (this.car_viewing_data.user_id != null){
          this.getUserData();
        }
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getUserData() {
    let send_data = {
      id: this.car_viewing_data.user_id,
      data_type: "user_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.user_data = res.data
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.car_viewing_data.id
    }

    send_data = this.commonService.updateDataChecker(send_data, this.car_viewing_data, this.checking_car_viewing_data);


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    if (this.car_viewing_data.status == CarViewingStatus.cancelled && this.checking_car_viewing_data.status != CarViewingStatus.cancelled && this.send_cancel_notification_to_user){
      send_data['send_cancel_notification_to_user'] = this.send_cancel_notification_to_user;
    }

    console.log(send_data);
    this.apiService.postFromServer(ApiPath.update_car_viewing, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.car_viewing_data = JSON.parse(JSON.stringify(res.data));
        this.checking_car_viewing_data = JSON.parse(JSON.stringify(res.data));
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




}
