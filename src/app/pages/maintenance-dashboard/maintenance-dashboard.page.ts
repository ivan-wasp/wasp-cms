import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonModal } from '@ionic/angular';
import { AppointmentData, AppointmentStatus, CompensationPaymentData, CompensationPaymentStatus, FactoryData } from 'src/app/schema';
import { CommonService } from 'src/app/services/common.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maintenance-dashboard',
  templateUrl: './maintenance-dashboard.page.html',
  styleUrls: ['./maintenance-dashboard.page.scss'],
})
export class MaintenanceDashboardPage implements OnInit {
  factory_data: FactoryData = null;
  factory_id: number = null;

  factory_data_list: FactoryData[] = null;

  upcoming_appointment_data_list: any[] = null;
  ongoing_appointment_data_list: any[] = null;

  compensation_payment_data_list: any[] = null;

  refreshData: any;

  selected_compensation_payment_data: CompensationPaymentData = null;

  isModalOpen: boolean = false;

  @ViewChild(IonModal) modal: IonModal;
  constructor(
    public sanitizer: DomSanitizer,
    private apiService: ApiService,
    public commonService: CommonService
  ) { }


  ngOnInit() {
    this.getFactoryDataList();
  }

  selectFactory(factory_data: FactoryData){
    this.factory_data = factory_data;
    this.factory_id = factory_data.id;
    this.init();    
  }

  init() {
    //one hour refresh time
    setInterval(() => {
      location.reload();
    }, 1000 * 60 * 60);

    let refresh_time = (environment.production == true ? (1000 * 5 * 60) : (1000 * 60 * 60));
    //5 mins refresh data
    this.getDisplayBoardData();
    this.refreshData = setInterval(() => {
      this.getDisplayBoardData();
    }, refresh_time);
  }


  getFactoryDataList() {
    let send_data = {
    };

    this.apiService.postFromServer(ApiPath.get_all_factory_data_for_display_board, send_data, true).then((res: Response) => {
      if (res.result == 'success') {
        this.factory_data_list = res.data;
        if (this.factory_data_list.length > 0){
          this.selectFactory(this.factory_data_list.find(d => d.zh_name.toLowerCase().includes('wrapper')));
        }
      }
      else {
        this.commonService.openErrorSnackBar();
      }
    });
  }

  getDisplayBoardData() {
    let send_data = {
      factory_id: this.factory_id,
      field_list: ["type","admin_id", "appointment_datetime", "car_id", "contact_name", "contact_phone", "factory_id", "maintenance_category_id", "maintenance_id", "remark", "status", "sub_maintenance_category_id", "user_id"],
      limit: 10
    };

    this.apiService.postFromServer(ApiPath.get_coming_accepted_appointment_data_excluding_disabled, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        console.log(res.data);

        //filter out battery appointment
        this.upcoming_appointment_data_list = res.data.filter((d: any) => d.maintenance_data != null && d.maintenance_data.allow_user_booking == true && new Date(d.appointment_datetime) > new Date(this.commonService.GetDateTimeMatchBackendFormat(new Date())) );
        this.ongoing_appointment_data_list = res.data.filter((d: any) => d.maintenance_data != null && d.maintenance_data.allow_user_booking == true  && new Date(d.appointment_datetime) < new Date(this.commonService.GetDateTimeMatchBackendFormat(new Date())) );

        this.ongoing_appointment_data_list.forEach((appointment_data: AppointmentData) => {
          const date1 = new Date(appointment_data.appointment_datetime).getTime();
          const date2 = new Date(this.commonService.GetDateTimeMatchBackendFormat(new Date())).getTime();
          const diffTime = Math.abs(date2 - date1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          appointment_data['accmulated_days'] =  diffDays;
        });

        console.log("upcoming_appointment_data_list", this.upcoming_appointment_data_list);
        console.log("ongoing_appointment_data_list", this.ongoing_appointment_data_list);
        
        this.getAllCompensationData();
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getAllCompensationData() {
    let send_data = {
      field_list: [],
      limit: 10
    };

    this.apiService.postFromServer(ApiPath.get_all_compensation_payment_data_for_maintenance_board, send_data, true).then((res: Response) => {
      console.log("compensation_payment_data_list", res.data);
      if (res.result == "success") {
        this.compensation_payment_data_list = res.data;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  completeAppointment(appointment_data: AppointmentData){
    this.updateAppointmentStatus(appointment_data, AppointmentStatus.completed);
  }

  cancelAppointment(appointment_data: AppointmentData){
    this.updateAppointmentStatus(appointment_data, AppointmentStatus.cancelled);
  }

  updateAppointmentStatus(appointment_data: AppointmentData, status: AppointmentStatus) {
    let send_data = {
      id: appointment_data.id,
      status: status
    }

    this.apiService.postFromServer(ApiPath.update_appointment_handler, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.ongoing_appointment_data_list = this.ongoing_appointment_data_list.filter(d => d.id != appointment_data.id);
        this.upcoming_appointment_data_list = this.upcoming_appointment_data_list.filter(d => d.id != appointment_data.id);
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

  updateCompensationPayment() {
    let compensation_payment_data: CompensationPaymentData = this.selected_compensation_payment_data;
    if (!compensation_payment_data){
      return;
    }
    let send_data = {
      id: compensation_payment_data.id,
      compensation_price: compensation_payment_data.compensation_price,
      status: CompensationPaymentStatus.awaiting_payment
    }

    this.apiService.postFromServer(ApiPath.update_compensation_payment, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.modal.dismiss();
        this.compensation_payment_data_list[this.compensation_payment_data_list.findIndex(d => d.id == compensation_payment_data.id)].compensation_price = res.data.compensation_price;
        this.compensation_payment_data_list[this.compensation_payment_data_list.findIndex(d => d.id == compensation_payment_data.id)].status = res.data.status;
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

  onDidDismiss(event: Event) {
    this.isModalOpen = false;
  }
}
