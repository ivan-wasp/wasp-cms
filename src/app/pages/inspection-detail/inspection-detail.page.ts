import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AdminData, CarData, InspectionData, InspectionStatus, ParkingData, UserData } from 'src/app/schema';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.page.html',
  styleUrls: ['./inspection-detail.page.scss'],
})
export class InspectionDetailPage implements OnInit {
  inspection_id = null;

  inspection_data: InspectionData = null;
  checking_inspection_data: InspectionData = null;

  user_data: UserData = null;
  admin_data: AdminData = null;
  car_data: CarData = null;
  parking_data: ParkingData = null;

  readonly = true;

  send_cancel_notification_to_user: boolean = false;

  public get inspectionStatus(): typeof InspectionStatus {
    return InspectionStatus;
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
        if (params && params.inspection_id) {
          this.inspection_id = parseInt(params.inspection_id);
        }
      }
    });
  }

  ngOnInit() {
    this.cdf.detectChanges();
    if (this.inspection_id != null) {
      this.getInspectionData();
    }
    else {
      this.readonly = false;
      // this.setNewCompensationDataTemplate();
    }

  }

  getInspectionData() {
    let send_data = {
      id: this.inspection_id,
      data_type: "inspection_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.inspection_data = JSON.parse(JSON.stringify(res.data));
        this.checking_inspection_data = JSON.parse(JSON.stringify(res.data));

        if (this.inspection_data.user_id != null){
          this.getUserData();
        }
        if (this.inspection_data.admin_id != null){
          this.getAdminData();
        }
        if (this.inspection_data.parking_id != null && this.dataService.parking_data_list$.value != null && this.dataService.parking_data_list$.value.find(d => d.id == this.inspection_data.parking_id) != null){
          this.parking_data = this.dataService.parking_data_list$.value.find(d => d.id == this.inspection_data.parking_id);
        }
        else{
          this.getParkingData();
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
      id: this.inspection_data.user_id,
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

  getAdminData() {
    let send_data = {
      id: this.inspection_data.admin_id,
      data_type: "admin_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.admin_data = res.data
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getParkingData() {
    let send_data = {
      id: this.inspection_data.parking_id,
      data_type: "parking_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.parking_data = res.data
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  save() {
    let send_data = {
      id: this.inspection_data.id
    }

    send_data = this.commonService.updateDataChecker(send_data, this.inspection_data, this.checking_inspection_data);


    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    console.log(send_data);
    this.apiService.postFromServer(ApiPath.update_inspection, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.inspection_data = JSON.parse(JSON.stringify(res.data));
        this.checking_inspection_data = JSON.parse(JSON.stringify(res.data));
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
