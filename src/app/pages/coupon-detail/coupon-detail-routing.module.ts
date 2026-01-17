import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponDetailPage } from './coupon-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CouponDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponDetailPageRoutingModule {}
