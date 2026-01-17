import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppointmentStatus, CarViewingStatus, ChargeStatus, CompensationPaymentStatus, DATA_TYPE, InspectionStatus, OrderStatus, PaymentStatus, PrerentOrderStatus, ViolationStatus } from 'src/app/schema';

@Component({
  selector: 'app-status-chip',
  templateUrl: './status-chip.component.html',
  styleUrls: ['./status-chip.component.scss'],
})
export class StatusChipComponent implements OnChanges {
  @Input() data_type: DATA_TYPE | string = null;
  @Input() status: OrderStatus | PaymentStatus | ViolationStatus | CarViewingStatus | CompensationPaymentStatus | ChargeStatus | PrerentOrderStatus | AppointmentStatus | InspectionStatus = null;

  order_status_style_list = [
    {
      status: OrderStatus.awaiting_payment,
      cssClass: 'order-awaiting-payment',
      text: '待付款'
    },
    {
      status: OrderStatus.awaiting_verification,
      cssClass: 'order-awaiting-verification',
      text: '待審核'
    },
    {
      status: OrderStatus.awaiting_pick_up,
      cssClass: 'order-awaiting-pick-up',
      text: '待取車'
    },
    {
      status: OrderStatus.rendering,
      cssClass: 'order-rendering',
      text: '租用中'
    },
    {
      status: OrderStatus.completed,
      cssClass: 'order-completed',
      text: '已完結'
    },
    {
      status: OrderStatus.cancelled,
      cssClass: 'order-cancelled',
      text: '已取消'
    },
  ]
  order_status_style = null;

  payment_status_style_list = [
    {
      status: PaymentStatus.awaiting_payment,
      cssClass: 'payment-awaiting-payment',
      text: '待付款'
    },
    {
      status: PaymentStatus.awaiting_verification,
      cssClass: 'payment-awaiting-verification',
      text: '待審核'
    },
    {
      status: PaymentStatus.paid,
      cssClass: 'payment-paid',
      text: '已繳款'
    },
    {
      status: PaymentStatus.cancelled,
      cssClass: 'payment-cancelled',
      text: '已取消'
    },
  ]
  payment_status_style = null;

  violation_status_style_list = [
    {
      status: ViolationStatus.cancelled,
      cssClass: 'violation-cancelled',
      text: '已取消'
    },
    {
      status: ViolationStatus.awaiting_payment,
      cssClass: 'violation-awaiting-payment',
      text: '待付款'
    },
    {
      status: ViolationStatus.awaiting_verification,
      cssClass: 'violation-awaiting-verification',
      text: '待審核'
    },
    {
      status: ViolationStatus.paid,
      cssClass: 'violation-paid',
      text: '已繳款'
    },
  ]
  violation_status_style = null;

  car_viewing_status_style_list = [
    {
      status: CarViewingStatus.accepted,
      cssClass: 'car-viewing-accpeted',
      text: '已預約'
    },
    {
      status: CarViewingStatus.completed,
      cssClass: 'car-viewing-completed',
      text: '已完成'
    },
    {
      status: CarViewingStatus.cancelled,
      cssClass: 'car-viewing-cancelled',
      text: '已取消'
    },
  ]
  car_viewing_status_style = null;

  compensation_payment_status_style_list = [
    {
      status: CompensationPaymentStatus.cancelled,
      cssClass: 'compensation-payment-cancelled',
      text: '已取消'
    },
    {
      status: CompensationPaymentStatus.awaiting_quotation,
      cssClass: 'compensation-payment-awaiting-quotation',
      text: '待報價'
    },
    {
      status: CompensationPaymentStatus.awaiting_payment,
      cssClass: 'compensation-payment-awaiting-payment',
      text: '待付款'
    },
    {
      status: CompensationPaymentStatus.awaiting_verification,
      cssClass: 'compensation-payment-awaiting-verification',
      text: '待審核'
    },
    {
      status: CompensationPaymentStatus.paid,
      cssClass: 'compensation-payment-paid',
      text: '已繳款'
    },
  ]
  compensation_payment_status_style = null;

  charge_status_style_list = [
    {
      status: ChargeStatus.awaiting_payment,
      cssClass: 'charge-awaiting-payment',
      text: '待付款'
    },
    {
      status: ChargeStatus.awaiting_verification,
      cssClass: 'charge-awaiting-verification',
      text: '待審核'
    },
    {
      status: ChargeStatus.paid,
      cssClass: 'charge-paid',
      text: '已繳款'
    },
    {
      status: ChargeStatus.cancelled,
      cssClass: 'charge-cancelled',
      text: '已取消'
    },
  ]
  charge_status_style = null;


  prerent_order_status_style_list = [
    {
      status: PrerentOrderStatus.awaiting_payment,
      cssClass: 'prerent-order-awaiting-payment',
      text: '待繳付訂金'
    },
    {
      status: PrerentOrderStatus.awaiting_verification,
      cssClass: 'prerent-order-awaiting-verification',
      text: '付款待審核'
    },
    {
      status: PrerentOrderStatus.paid,
      cssClass: 'prerent-order-paid',
      text: '已繳付訂單'
    },
    {
      status: PrerentOrderStatus.completed,
      cssClass: 'prerent-order-completed',
      text: '已完成預租'
    },
    {
      status: PrerentOrderStatus.cancelled,
      cssClass: 'prerent-order-cancelled',
      text: '已取消預租'
    },
  ]
  prerent_order_status_style = null;

  appointment_status_style_list = [
    {
      status: AppointmentStatus.awaiting_verification,
      cssClass: 'appointment-awaiting-verification',
      text: '待審核'
    },
    {
      status: AppointmentStatus.accepted,
      cssClass: 'appointment-accepted',
      text: '已成功預約'
    },
    {
      status: AppointmentStatus.completed,
      cssClass: 'appointment-completed',
      text: '已完成服務'
    },
    {
      status: AppointmentStatus.cancelled,
      cssClass: 'appointment-cancelled',
      text: '已取消預約'
    },
  ]
  appointment_status_style = null;

  inspection_status_style_list = [
    {
      status: InspectionStatus.pending,
      cssClass: 'inspection-pending',
      text: '待檢查'
    },
    {
      status: InspectionStatus.in_progress,
      cssClass: 'inspection-in-progress',
      text: '進行中'
    },
    {
      status: InspectionStatus.result_generated,
      cssClass: 'inspection-result-generated',
      text: '已完成服務'
    },
    {
      status: InspectionStatus.completed,
      cssClass: 'inspection-completed',
      text: '已完成'
    },
    {
      status: InspectionStatus.cancelled,
      cssClass: 'inspection-cancelled',
      text: '已取消預約'
    },
    {
      status: InspectionStatus.expired,
      cssClass: 'inspection-expired',
      text: '已過期'
    },
  ]
  inspection_status_style = null;

  public get orderStatus(): typeof OrderStatus {
    return OrderStatus;
  }
  constructor(
  ) { }


  ngOnChanges(changes: SimpleChanges){
    if(changes['status']){
      if (this.status != null && this.data_type == DATA_TYPE.ORDER_DATA){
        this.order_status_style = this.order_status_style_list.find(d => d.status == this.status);
      }
      if (this.status != null && this.data_type == DATA_TYPE.PAYMENT_DATA){
        this.payment_status_style = this.payment_status_style_list.find(d => d.status == this.status);
      }
      if (this.status != null && this.data_type == DATA_TYPE.VIOLATION_DATA){
        this.violation_status_style = this.violation_status_style_list.find(d => d.status == this.status);
      }
      if (this.status != null && this.data_type == DATA_TYPE.CAR_VIEWING_DATA){
        this.car_viewing_status_style = this.car_viewing_status_style_list.find(d => d.status == this.status);
      }
      if (this.status != null && this.data_type == DATA_TYPE.COMPENSATION_PAYMENT_DATA){
        this.compensation_payment_status_style = this.compensation_payment_status_style_list.find(d => d.status == this.status);
      }
      if (this.status != null && this.data_type == DATA_TYPE.CHARGE_DATA){
        this.charge_status_style = this.charge_status_style_list.find(d => d.status == this.status);
      }
      if (this.status != null && this.data_type == DATA_TYPE.PRERENT_ORDER_DATA){
        this.prerent_order_status_style = this.prerent_order_status_style_list.find(d => d.status == this.status);
      }
      if (this.status != null && this.data_type == DATA_TYPE.APPOINTMENT_DATA){
        this.appointment_status_style = this.appointment_status_style_list.find(d => d.status == this.status);
      }
      if (this.status != null && this.data_type == DATA_TYPE.INSPECTION_DATA){
        this.inspection_status_style = this.inspection_status_style_list.find(d => d.status == this.status);
      }
    }
  }
  

}
