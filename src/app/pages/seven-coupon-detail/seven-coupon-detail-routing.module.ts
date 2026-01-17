import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SevenCouponDetailPage } from './seven-coupon-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SevenCouponDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SevenCouponDetailPageRoutingModule {}
