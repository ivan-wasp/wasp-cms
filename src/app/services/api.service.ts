import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';
const headers = { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') };

export interface Response {
  result: 'success' | 'fail' | 'error';
  data: any;
}

export enum ApiPath {
  get_system_data = 'get_system_data',
  upload_base64_file_to_server = 'upload_base64_file_to_server',
  get_all_rentable_car_data = 'get_all_rentable_car_data',
  user_login = 'user_login',
  request_phone_verify_code = 'request_phone_verify_code',
  new_user = 'new_user',
  update_user = 'update_user',
  get_user_data_by_id = 'get_user_data_by_id',
  get_all_data_by_data_type = 'get_all_data_by_data_type',
  get_single_data_by_data_type_and_id = 'get_single_data_by_data_type_and_id',
  get_all_car_data_exluding_disabled_by_model_group_by_color_code = 'get_all_car_data_exluding_disabled_by_model_group_by_color_code',
  get_available_campaign_by_user_id_and_car_id = 'get_available_campaign_by_user_id_and_car_id',
  get_unavailable_booking_date_list_by_car_id_and_user_id = 'get_unavailable_booking_date_list_by_car_id_and_user_id',
  calculate_car_rental_amount_by_booking_days_and_car_id_and_user_id = 'calculate_car_rental_amount_by_booking_days_and_car_id_and_user_id',
  get_new_order_data_template = 'get_new_order_data_template',
  get_return_data_and_pick_up_data_limit_by_car_id_and_start_date_and_end_date = 'get_return_data_and_pick_up_data_limit_by_car_id_and_start_date_and_end_date',
  get_rentable_parking_data_list_by_car_id = 'get_rentable_parking_data_list_by_car_id',
  get_available_equipment_by_booking_date_list_and_car_id_group_by_category = 'get_available_equipment_by_booking_date_list_and_car_id_group_by_category',
  get_available_product_data_list_by_car_id_and_booking_days = 'get_available_product_data_list_by_car_id_and_booking_days',
  generate_payment_data = 'generate_payment_data',
  apply_discount_to_payment = 'apply_discount_to_payment',
  get_awaiting_application_deposit_amount_and_create_date_by_user_id = 'get_awaiting_application_deposit_amount_and_create_date_by_user_id',
  get_all_usable_coupon_data_by_user_id_and_car_id = 'get_all_usable_coupon_data_by_user_id_and_car_id',
  make_order = 'make_order',
  pay = 'pay',
  calculate_payment_data_amount = 'calculate_payment_data_amount',
  get_current_order_data_with_car_data_with_payment_data_list_by_user_id = 'get_current_order_data_with_car_data_with_payment_data_list_by_user_id',
  get_next_payment_data_with_awaiting_payment_status_by_user_id = 'get_next_payment_data_with_awaiting_payment_status_by_user_id',
  make_extend_order = 'make_extend_order',
  get_bookable_maintenance_data = 'get_bookable_maintenance_data',
  get_appointment_data_before_n_days_by_order_id_and_maintenance_id = 'get_appointment_data_before_n_days_by_order_id_and_maintenance_id',
  make_appointment = 'make_appointment',
  get_current_appointment_data_by_order_id = 'get_current_appointment_data_by_order_id',
  get_unpaid_violation_data_list_by_user_id = 'get_unpaid_violation_data_list_by_user_id',
  user_submit_violation_payment_img = 'user_submit_violation_payment_img',
  request_payment_intent = 'request_payment_intent',
  cancel_payment_intent = 'cancel_payment_intent',
  get_customer_payment_method_by_user_id = 'get_customer_payment_method_by_user_id',
  detach_customer_payment_method_by_user_id_and_payment_method_id = 'detach_customer_payment_method_by_user_id_and_payment_method_id',
  delete_data_by_data_type_and_id = 'delete_data_by_data_type_and_id',
  admin_login = 'admin_login',
  get_kpi_temp = 'get_kpi_temp',
  verify_admin = 'verify_admin',
  calculate_kpi = 'calculate_kpi',
  update_kpi_temp = 'update_kpi_temp',
  get_car_data_and_order_data_for_cms_home_calendar = 'get_car_data_and_order_data_for_cms_home_calendar',
  get_vacant_car_data_list_for_coming_n_days_for_cms = 'get_vacant_car_data_list_for_coming_n_days_for_cms',
  get_order_data_with_all_other_data_by_order_id = 'get_order_data_with_all_other_data_by_order_id',
  get_car_data_and_total_number_by_sorting_and_limit_or_search = 'get_car_data_and_total_number_by_sorting_and_limit_or_search',
  check_car_available_by_booking_date_list_and_car_id_and_user_id = 'check_car_available_by_booking_date_list_and_car_id_and_user_id',
  get_all_favorited_user_by_car_model = 'get_all_favorited_user_by_car_model',
  send_favorite_reminder = 'send_favorite_reminder',
  get_faq_data_and_total_number_by_sorting_and_limit_or_search = 'get_faq_data_and_total_number_by_sorting_and_limit_or_search',
  new_faq = 'new_faq',
  update_faq = 'update_faq',
  new_equipment = 'new_equipment',
  update_equipment = 'update_equipment',
  get_emergency_data_and_total_number_by_sorting_and_limit_or_search = 'get_emergency_data_and_total_number_by_sorting_and_limit_or_search',
  get_user_id_list_by_type = 'get_user_id_list_by_type',
  update_emergency = 'update_emergency',
  new_emergency = 'new_emergency',
  get_deposit_data_and_total_number_by_sorting_and_limit_or_search = 'get_deposit_data_and_total_number_by_sorting_and_limit_or_search',
  update_deposit_handler = 'update_deposit_handler',
  update_system_data = 'update_system_data',
  update_car = 'update_car',
  new_car = 'new_car',
  generate_deposit_authorization_form_pdf_by_daf_data = 'generate_deposit_authorization_form_pdf_by_daf_data',
  get_deposit_data_with_all_other_data_by_deposit_id = 'get_deposit_data_with_all_other_data_by_deposit_id',
  new_coupon = 'new_coupon',
  update_coupon = 'update_coupon',
  generate_change_vehicle_agreement_pdf_by_vrb_data = 'generate_change_vehicle_agreement_pdf_by_vrb_data',
  new_custom_page = 'new_custom_page',
  update_custom_page = 'update_custom_page',
  get_all_equipment_company_list = 'get_all_equipment_company_list',
  get_equipment_summary_report = 'get_equipment_summary_report',
  get_user_data_and_total_number_by_sorting_and_limit_or_search = 'get_user_data_and_total_number_by_sorting_and_limit_or_search',
  get_compensation_payment_data_and_total_number_by_sorting_and_limit_or_search = 'get_compensation_payment_data_and_total_number_by_sorting_and_limit_or_search',
  new_compensation_payment = 'new_compensation_payment',
  update_compensation_payment = 'update_compensation_payment',
  get_all_car_brand_list = 'get_all_car_brand_list',
  get_all_form = 'get_all_form',
  get_campaign_data_and_total_number_by_sorting_and_limit_or_search = 'get_campaign_data_and_total_number_by_sorting_and_limit_or_search',
  new_campaign = 'new_campaign',
  update_campaign = 'update_campaign',
  new_blocking = 'new_blocking',
  update_blocking = 'update_blocking',
  get_all_blocking_data = 'get_all_blocking_data',
  get_appointment_data_and_total_number_by_sorting_and_limit_or_search = 'get_appointment_data_and_total_number_by_sorting_and_limit_or_search',
  update_appointment_handler = 'update_appointment_handler',
  get_admin_data_and_total_number_by_sorting_and_limit_or_search = 'get_admin_data_and_total_number_by_sorting_and_limit_or_search',
  update_admin_notification = 'update_admin_notification',
  get_admin_notification_data_and_total_number_by_sorting_and_limit_or_search = 'get_admin_notification_data_and_total_number_by_sorting_and_limit_or_search',
  new_admin = 'new_admin',
  update_admin = 'update_admin',
  get_car_report_stat_by_car_id = 'get_car_report_stat_by_car_id',
  convert_server_image_to_base64 = 'convert_server_image_to_base64',
  update_rbb_payment = 'update_rbb_payment',
  update_payment_handler = 'update_payment_handler',
  generate_invoice_pdf_by_payment_id = 'generate_invoice_pdf_by_payment_id',
  generate_vehicle_register_form_pdf_by_vrf_data = 'generate_vehicle_register_form_pdf_by_vrf_data',
  update_order_handler = 'update_order_handler',
  generate_vehicle_rental_agreement_pdf_by_vrb_data = 'generate_vehicle_rental_agreement_pdf_by_vrb_data',
  new_violation = 'new_violation',
  update_violation = 'update_violation',
  distribute_seven_coupon_to_user_by_user_id_and_quantity_and_amount = 'distribute_seven_coupon_to_user_by_user_id_and_quantity_and_amount',
  get_total_quantity_of_seven_coupon_not_distributed_group_by_amount = 'get_total_quantity_of_seven_coupon_not_distributed_group_by_amount',
  generate_return_vehicle_report_pdf_by_rvr_data = 'generate_return_vehicle_report_pdf_by_rvr_data',
  new_rbb_equipment = 'new_rbb_equipment',
  update_rbb_equipment = 'update_rbb_equipment',
  generate_rbb_confirmation = 'generate_rbb_confirmation',
  generate_rbb_agreement = 'generate_rbb_agreement',
  new_rbb = 'new_rbb',
  update_rbb = 'update_rbb',
  update_rbb_handler = 'update_rbb_handler',
  get_all_rendering_order_data_excluding_disabled = 'get_all_rendering_order_data_excluding_disabled',
  get_rbb_data_with_all_other_data_by_rbb_id = 'get_rbb_data_with_all_other_data_by_rbb_id',
  get_parking_data_and_total_number_by_sorting_and_limit_or_search = 'get_parking_data_and_total_number_by_sorting_and_limit_or_search',
  new_parking = 'new_parking',
  update_parking = 'update_parking',
  generate_confirmation_pdf_by_order_id = 'generate_confirmation_pdf_by_order_id',
  get_available_car_by_booking_date_list = 'get_available_car_by_booking_date_list',
  // get_all_user_booking_date_list_by_user_id = 'get_all_user_booking_date_list_by_user_id',
  get_all_buyable_product_data_excluding_disabled_by_car_id = 'get_all_buyable_product_data_excluding_disabled_by_car_id',
  new_gift = 'new_gift',
  update_gift = 'update_gift',
  new_multi_gift = 'new_multi_gift',
  generate_vehicle_sign_for_confirmation_pdf_by_vls_data = 'generate_vehicle_sign_for_confirmation_pdf_by_vls_data',
  new_maintenance_category = 'new_maintenance_category',
  update_maintenance_category = 'update_maintenance_category',
  new_maintenance = 'new_maintenance',
  update_maintenance = 'update_maintenance',
  get_gift_data_and_total_number_by_sorting_and_limit_or_search = 'get_gift_data_and_total_number_by_sorting_and_limit_or_search',
  get_equipment_data_and_total_number_by_sorting_and_limit_or_search = 'get_equipment_data_and_total_number_by_sorting_and_limit_or_search',
  get_coupon_data_and_total_number_by_sorting_and_limit_or_search = 'get_coupon_data_and_total_number_by_sorting_and_limit_or_search',
  get_violation_data_and_total_number_by_sorting_and_limit_or_search = 'get_violation_data_and_total_number_by_sorting_and_limit_or_search',
  get_charge_data_and_total_number_by_sorting_and_limit_or_search = 'get_charge_data_and_total_number_by_sorting_and_limit_or_search',
  get_seven_coupon_data_and_total_number_by_sorting_and_limit_or_search = 'get_seven_coupon_data_and_total_number_by_sorting_and_limit_or_search',
  new_seven_coupon = 'new_seven_coupon',
  update_seven_coupon = 'update_seven_coupon',
  generate_return_deposit_report_pdf_by_rdr_data = 'generate_return_deposit_report_pdf_by_rdr_data',
  get_rbb_data_and_total_number_by_sorting_and_limit_or_search = 'get_rbb_data_and_total_number_by_sorting_and_limit_or_search',
  new_factory = 'new_factory',
  update_factory = 'update_factory',
  get_rbb_equipment_data_and_total_number_by_sorting_and_limit_or_search = 'get_rbb_equipment_data_and_total_number_by_sorting_and_limit_or_search',
  get_product_data_and_total_number_by_sorting_and_limit_or_search = 'get_product_data_and_total_number_by_sorting_and_limit_or_search',
  new_product = 'new_product',
  update_product = 'update_product',
  get_all_compensation_payment_data_for_maintenance_board = 'get_all_compensation_payment_data_for_maintenance_board',
  get_all_factory_data_for_display_board = 'get_all_factory_data_for_display_board',
  get_coming_accepted_appointment_data_excluding_disabled = 'get_coming_accepted_appointment_data_excluding_disabled',
  get_product_summary_report = 'get_product_summary_report',
  get_all_product_company_list = 'get_all_product_company_list',
  get_plate_data_and_total_number_by_sorting_and_limit_or_search = 'get_plate_data_and_total_number_by_sorting_and_limit_or_search',
  new_plate = 'new_plate',
  update_plate = 'update_plate',
  get_payment_data_and_total_number_by_sorting_and_limit_or_search = 'get_payment_data_and_total_number_by_sorting_and_limit_or_search',
  get_order_data_and_total_number_by_sorting_and_limit_or_search = 'get_order_data_and_total_number_by_sorting_and_limit_or_search',
  get_notification_data_and_total_number_by_sorting_and_limit_or_search = 'get_notification_data_and_total_number_by_sorting_and_limit_or_search',
  new_notification_template = 'new_notification_template',
  update_notification_template = 'update_notification_template',
  new_onesignal_notification = 'new_onesignal_notification',
  send_custom_sms = 'send_custom_sms',
  update_notification = 'update_notification',
  get_maintenance_data_and_total_number_by_sorting_and_limit_or_search = 'get_maintenance_data_and_total_number_by_sorting_and_limit_or_search',
  get_log_data_and_total_number_by_sorting_and_limit_or_search = 'get_log_data_and_total_number_by_sorting_and_limit_or_search',
  get_factory_data_and_total_number_by_sorting_and_limit_or_search = 'get_factory_data_and_total_number_by_sorting_and_limit_or_search',
  get_form_by_id = 'get_form_by_id',
  get_car_viewing_data_and_total_number_by_sorting_and_limit_or_search = 'get_car_viewing_data_and_total_number_by_sorting_and_limit_or_search',
  new_car_viewing = 'new_car_viewing',
  update_car_viewing = 'update_car_viewing',
  get_most_recent_previous_order_drop_off_parking_data_by_car_id_list_and_date = 'get_most_recent_previous_order_drop_off_parking_data_by_car_id_list_and_date',
  generate_compensation_payment_quotation_pdf = 'generate_compensation_payment_quotation_pdf',
  generate_personal_settlement_by_emergency_id = 'generate_personal_settlement_by_emergency_id',
  get_temp_order_data_by_user_id = 'get_temp_order_data_by_user_id',
  update_temp_order = 'update_temp_order',
  get_vehicle_rental_agreement_by_order_id = 'get_vehicle_rental_agreement_by_order_id',
  get_return_vehicle_report_by_order_id = 'get_return_vehicle_report_by_order_id',
  new_vehicle_rental_agreement = 'new_vehicle_rental_agreement',
  update_vehicle_rental_agreement = 'update_vehicle_rental_agreement',
  update_vehicle_rental_agreement_by_order_id = 'update_vehicle_rental_agreement_by_order_id',
  update_return_vehicle_report = 'update_return_vehicle_report',
  generate_vehicle_rental_agreement_pdf_by_vra_data = 'generate_vehicle_rental_agreement_pdf_by_vra_data',
  add_car_damage_to_car_by_car_id = 'add_car_damage_to_car_by_car_id',
  new_charge = 'new_charge',
  update_charge = 'update_charge',
  apply_return_deposit_by_user_id = 'apply_return_deposit_by_user_id',
  get_number_of_acceted_appointment_data_by_factory_id_and_appointment_date = 'get_number_of_acceted_appointment_data_by_factory_id_and_appointment_date',
  get_prerent_order_data_and_total_number_by_sorting_and_limit_or_search = 'get_prerent_order_data_and_total_number_by_sorting_and_limit_or_search',
  update_prerent_order = 'update_prerent_order',
  import_hke_toll_file = 'import_hke_toll_file',
  get_unpaid_charge_data_ranking = 'get_unpaid_charge_data_ranking',
  get_unpaid_violation_data_ranking = 'get_unpaid_violation_data_ranking',
  second_driver_validation = 'second_driver_validation',
  pay_charge_data = 'pay_charge_data',
  get_tesla_charging_history = 'get_tesla_charging_history',
  get_inspection_data_and_total_number_by_sorting_and_limit_or_search = 'get_inspection_data_and_total_number_by_sorting_and_limit_or_search',
  update_inspection = 'update_inspection',
  request_settlement_verify_code = 'request_settlement_verify_code',
  get_jimi_device_streaming_live = 'get_jimi_device_streaming_live',
  get_jimi_device_live_map = 'get_jimi_device_live_map',
  get_jimi_device_location = 'get_jimi_device_location',
  get_jimi_user_device_location_list = 'get_jimi_user_device_location_list',
  lock_unlock_obd_by_device_id = 'lock_unlock_obd_by_device_id',
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(
    private http: HttpClient,
    private injector: Injector,
  ) {
  }


  private get commonService() {
    return this.injector.get(CommonService);
  }

  private get authService() {
    return this.injector.get(AuthService);
  }

  postFromServer(path: ApiPath, send_data: any | null, loadding?): Promise<Response> {
    let body = new URLSearchParams();
    body.set(path, JSON.stringify(send_data));

    if (environment.enable_api_log){
      console.log(`${path}: `, send_data);
    }

    return new Promise((resolve, reject) => {
      if(loadding) this.commonService.isLoading = true;
      this.http.post(environment.api_url, body.toString(), headers).subscribe(async (res: any) => {
        // console.log(path);
        if(loadding) this.commonService.isLoading = false;
        if (res != null){
          const response: Response = res;
          switch (response.result) {
            case 'success':
              resolve(response);
              break;
            case 'fail':
              resolve(response);
              break;
            case 'error':
              this.errorHandler(path, response);
              reject(response)
              break;
  
            default:
              break;
          }
        }
        else{
          console.error(`API ${path} error: ${res}`);
          this.errorHandler(path);
          reject(null);
        }

      }),
        async (error: any) => {
          
          console.error(`API ${path} error: ${error}`);
          this.errorHandler(path, error);
          reject(error);
        };
    });
  }

  errorHandler(path: ApiPath, error?: any) {
    switch (path) {
      case ApiPath.verify_admin:
        this.authService.Logout();
        break;

      default:
        let message = environment.production ? '出現錯誤' : `Api ${path} Error: ${JSON.stringify(error)}`;
        this.commonService.openErrorSnackBar(message);
        break;
    }
  }
  
}
