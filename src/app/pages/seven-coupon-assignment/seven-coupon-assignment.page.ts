import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { AdminData, AdminType, Authority, SevenCouponType, UserData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-seven-coupon-assignment',
  templateUrl: './seven-coupon-assignment.page.html',
  styleUrls: ['./seven-coupon-assignment.page.scss'],
})
export class SevenCouponAssignmentPage implements OnInit {

  not_distributed_coupon_list = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();
  having_deposit_user_id_list = null;
  all_user_id_list_exluding_having_deposit = null;

  selected_user_id_list = [];
  quantity = 0;
  amount = null;
  seven_coupon_type: SevenCouponType = null;

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();
  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }
  public get sevenCouponType(): typeof SevenCouponType {
    return SevenCouponType;
  }

  @ViewChild('portComponent') portComponent: IonicSelectableComponent;
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private location: Location
  ) {

  }

  async ngOnInit() {

    if (this.dataService.user_data_list$.value == null) {
      await this.dataService.getAllUserData();
    }
    this.getUserIdListByType();
  }

  sevenCouponTypeChange(){
    this.getNotDistributedSevenCouponQuantity();
  }


  getNotDistributedSevenCouponQuantity() {
    let send_data = {
      seven_coupon_type: this.seven_coupon_type
    }
    this.apiService.postFromServer(ApiPath.get_total_quantity_of_seven_coupon_not_distributed_group_by_amount, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.not_distributed_coupon_list = res.data;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getUserIdListByType() {
    let send_data = {
    }
    this.apiService.postFromServer(ApiPath.get_user_id_list_by_type, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.having_deposit_user_id_list = res.data.having_deposit_user_id_list;
        this.all_user_id_list_exluding_having_deposit = this.dataService.user_data_list$.value.map(d => d.id).filter(d => !res.data.having_deposit_user_id_list.includes(d));
        // this.having_past_order_user_id_list = res.data.having_past_order_user_id_list;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }


  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }





  clear() {
    // this.notification_data.user_id_list = [];
    this.portComponent.toggleItems(false);
    //     this.portComponent.clear();
    // this.portComponent.close();
  }

  selectAll() {
    // this.portComponent.toggleItems(this.portComponent.itemsToConfirm.length ? false : true);
    this.portComponent.toggleItems(true);

    // Confirm items and close Select page
    // without having the user to click Confirm button.
    // this.confirm();
  }

  confirm() {
    this.portComponent.confirm();
    this.portComponent.close();
  }

  distributeCouponByUserIdsAndQantity() {
    if (this.not_distributed_coupon_list.filter(d => d.amount == this.amount).quantity < this.selected_user_id_list.length * this.quantity) {
      return this.commonService.openErrorSnackBar("未有足夠coupon派發");
    }
    let send_data = {
      user_id_list: this.selected_user_id_list,
      quantity: this.quantity,
      amount: this.seven_coupon_type == SevenCouponType.seven_eleven ? this.amount : null ,
      seven_coupon_type: this.seven_coupon_type
    }
    this.apiService.postFromServer(ApiPath.distribute_seven_coupon_to_user_by_user_id_and_quantity_and_amount, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {

        this.commonService.openSnackBar("已派發coupon");
        setTimeout(() => {
          this.commonService.isLoading = false;
          this.selected_user_id_list = [];
          this.quantity = null;
          this.getNotDistributedSevenCouponQuantity();
        }, 1000);
      } else {
        this.commonService.isLoading = false;
        switch (res.data) {
          case "not enough coupon":
            this.commonService.openErrorSnackBar("未有足夠coupon派發");
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

}
