import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SevenCouponPage } from './seven-coupon.page';

const routes: Routes = [
  {
    path: '',
    component: SevenCouponPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SevenCouponPageRoutingModule {}
