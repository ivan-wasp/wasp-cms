import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { NonBuyerGuard } from './guard/non-buyer.guard';
import { NonMaintainerGuard } from './guard/non-maintainer.guard';
import { NonPatrolGuard } from './guard/non-patrol.guard';
import { NonOwnerGuard } from './guard/non-owner.guard';
import { NonPickupDropoffGuard } from './guard/non-pickup-dropoff.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    // canActivate: [AuthGuard]
    canActivate: [AuthGuard, NonMaintainerGuard, NonBuyerGuard, NonPatrolGuard, NonOwnerGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then(m => m.UserPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'car',
    loadChildren: () => import('./pages/car/car.module').then(m => m.CarPageModule),
    canActivate: [AuthGuard, NonPickupDropoffGuard]
  },
  {
    path: 'car-detail',
    loadChildren: () => import('./pages/car-detail/car-detail.module').then(m => m.CarDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-detail',
    loadChildren: () => import('./pages/user-detail/user-detail.module').then(m => m.UserDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'coupon',
    loadChildren: () => import('./pages/coupon/coupon.module').then(m => m.CouponPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'coupon-detail',
    loadChildren: () => import('./pages/coupon-detail/coupon-detail.module').then(m => m.CouponDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'parking',
    loadChildren: () => import('./pages/parking/parking.module').then(m => m.ParkingPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'parking-detail',
    loadChildren: () => import('./pages/parking-detail/parking-detail.module').then(m => m.ParkingDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'campaign',
    loadChildren: () => import('./pages/campaign/campaign.module').then(m => m.CampaignPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'campaign-detail',
    loadChildren: () => import('./pages/campaign-detail/campaign-detail.module').then(m => m.CampaignDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'equipment',
    loadChildren: () => import('./pages/equipment/equipment.module').then(m => m.EquipmentPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'equipment-detail',
    loadChildren: () => import('./pages/equipment-detail/equipment-detail.module').then(m => m.EquipmentDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'product-detail',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then(m => m.OrderPageModule),
    canActivate: [AuthGuard, NonBuyerGuard, NonMaintainerGuard]
  },
  {
    path: 'order-detail',
    loadChildren: () => import('./pages/order-detail/order-detail.module').then(m => m.OrderDetailPageModule),
    canActivate: [AuthGuard, NonBuyerGuard, NonMaintainerGuard]
  },
  {
    path: 'deposit',
    loadChildren: () => import('./pages/deposit/deposit.module').then(m => m.DepositPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'deposit-detail',
    loadChildren: () => import('./pages/deposit-detail/deposit-detail.module').then(m => m.DepositDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'blocking',
    loadChildren: () => import('./pages/blocking/blocking.module').then(m => m.BlockingPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'emergency',
    loadChildren: () => import('./pages/emergency/emergency.module').then(m => m.EmergencyPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'emergency-detail',
    loadChildren: () => import('./pages/emergency-detail/emergency-detail.module').then(m => m.EmergencyDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'violation',
    loadChildren: () => import('./pages/violation/violation.module').then(m => m.ViolationPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'violation-detail',
    loadChildren: () => import('./pages/violation-detail/violation-detail.module').then(m => m.ViolationDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./pages/maintenance/maintenance.module').then(m => m.MaintenancePageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'maintenance-detail',
    loadChildren: () => import('./pages/maintenance-detail/maintenance-detail.module').then(m => m.MaintenanceDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'appointment',
    loadChildren: () => import('./pages/appointment/appointment.module').then(m => m.AppointmentPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'appointment-detail',
    loadChildren: () => import('./pages/appointment-detail/appointment-detail.module').then(m => m.AppointmentDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'factory',
    loadChildren: () => import('./pages/factory/factory.module').then(m => m.FactoryPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'factory-detail',
    loadChildren: () => import('./pages/factory-detail/factory-detail.module').then(m => m.FactoryDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'new-order',
    loadChildren: () => import('./pages/new-order/new-order.module').then(m => m.NewOrderPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'gift',
    loadChildren: () => import('./pages/gift/gift.module').then(m => m.GiftPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'gift-detail',
    loadChildren: () => import('./pages/gift-detail/gift-detail.module').then(m => m.GiftDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'plate',
    loadChildren: () => import('./pages/plate/plate.module').then(m => m.PlatePageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'plate-detail',
    loadChildren: () => import('./pages/plate-detail/plate-detail.module').then(m => m.PlateDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'rbb-equipment',
    loadChildren: () => import('./pages/rbb-equipment/rbb-equipment.module').then(m => m.RbbEquipmentPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'rbb-equipment-detail',
    loadChildren: () => import('./pages/rbb-equipment-detail/rbb-equipment-detail.module').then(m => m.RbbEquipmentDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'rbb',
    loadChildren: () => import('./pages/rbb/rbb.module').then(m => m.RbbPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'rbb-detail',
    loadChildren: () => import('./pages/rbb-detail/rbb-detail.module').then(m => m.RbbDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'notification-detail',
    loadChildren: () => import('./pages/notification-detail/notification-detail.module').then(m => m.NotificationDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then(m => m.SettingPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin-detail',
    loadChildren: () => import('./pages/admin-detail/admin-detail.module').then(m => m.AdminDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'faq-detail',
    loadChildren: () => import('./pages/faq-detail/faq-detail.module').then(m => m.FaqDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin-notification',
    loadChildren: () => import('./pages/admin-notification/admin-notification.module').then(m => m.AdminNotificationPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'vra',
    loadChildren: () => import('./pages/vra/vra.module').then(m => m.VraPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cva',
    loadChildren: () => import('./pages/cva/cva.module').then(m => m.CvaPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'rvr',
    loadChildren: () => import('./pages/rvr/rvr.module').then(m => m.RvrPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'vls',
    loadChildren: () => import('./pages/vls/vls.module').then(m => m.VlsPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'vrf',
    loadChildren: () => import('./pages/vrf/vrf.module').then(m => m.VrfPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'daf',
    loadChildren: () => import('./pages/daf/daf.module').then(m => m.DafPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'rdr',
    loadChildren: () => import('./pages/rdr/rdr.module').then(m => m.RdrPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'log',
    loadChildren: () => import('./pages/log/log.module').then(m => m.LogPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'favorite-car',
    loadChildren: () => import('./pages/favorite-car/favorite-car.module').then(m => m.FavoriteCarPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'equipment-report',
    loadChildren: () => import('./pages/equipment-report/equipment-report.module').then(m => m.EquipmentReportPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'product-report',
    loadChildren: () => import('./pages/product-report/product-report.module').then(m => m.ProductReportPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'car-overview',
    loadChildren: () => import('./pages/car-overview/car-overview.module').then(m => m.CarOverviewPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'outstanding-payment',
    loadChildren: () => import('./pages/outstanding-payment/outstanding-payment.module').then(m => m.OutstandingPaymentPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'banner-setting',
    loadChildren: () => import('./pages/banner-setting/banner-setting.module').then(m => m.BannerSettingPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'seven-coupon',
    loadChildren: () => import('./pages/seven-coupon/seven-coupon.module').then(m => m.SevenCouponPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'seven-coupon-detail',
    loadChildren: () => import('./pages/seven-coupon-detail/seven-coupon-detail.module').then(m => m.SevenCouponDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'seven-coupon-assignment',
    loadChildren: () => import('./pages/seven-coupon-assignment/seven-coupon-assignment.module').then(m => m.SevenCouponAssignmentPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'form-list',
    loadChildren: () => import('./pages/charity-form-list/charity-form-list.module').then(m => m.CharityFormListPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'form',
    loadChildren: () => import('./pages/charity-form/charity-form.module').then(m => m.CharityFormPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'custom-page-detail',
    loadChildren: () => import('./pages/custom-page-detail/custom-page-detail.module').then(m => m.CustomPageDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'custom-page',
    loadChildren: () => import('./pages/custom-page/custom-page.module').then(m => m.CustomPagePageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'maintenance-dashboard',
    loadChildren: () => import('./pages/maintenance-dashboard/maintenance-dashboard.module').then(m => m.MaintenanceDashboardPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'compensation-payment',
    loadChildren: () => import('./pages/compensation-payment/compensation-payment.module').then(m => m.CompensationPaymentPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'compensation-payment-detail',
    loadChildren: () => import('./pages/compensation-payment-detail/compensation-payment-detail.module').then(m => m.CompensationPaymentDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'car-report',
    loadChildren: () => import('./pages/car-report/car-report.module').then(m => m.CarReportPageModule),
    canActivate: [AuthGuard, AdminGuard, NonBuyerGuard]
  },
  {
    path: 'car-viewing',
    loadChildren: () => import('./pages/car-viewing/car-viewing.module').then(m => m.CarViewingPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'car-viewing-detail',
    loadChildren: () => import('./pages/car-viewing-detail/car-viewing-detail.module').then(m => m.CarViewingDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'charge',
    loadChildren: () => import('./pages/charge/charge.module').then(m => m.ChargePageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'charge-detail',
    loadChildren: () => import('./pages/charge-detail/charge-detail.module').then(m => m.ChargeDetailPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'prerent-order',
    loadChildren: () => import('./pages/prerent-order/prerent-order.module').then(m => m.PrerentOrderPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'prerent-order-detail',
    loadChildren: () => import('./pages/prerent-order-detail/prerent-order-detail.module').then(m => m.PrerentOrderDetailPageModule),
    canActivate:[AuthGuard, AdminGuard]
  },
  {
    path: 'supercharge',
    loadChildren: () => import('./pages/supercharge/supercharge.module').then(m => m.SuperchargePageModule),
    canActivate:[AuthGuard, AdminGuard]
  },

  {
    path: 'inspection',
    loadChildren: () => import('./pages/inspection/inspection.module').then(m => m.InspectionPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'inspection-detail',
    loadChildren: () => import('./pages/inspection-detail/inspection-detail.module').then(m => m.InspectionDetailPageModule),
    canActivate:[AuthGuard, AdminGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
