import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SevenCouponAssignmentPage } from './seven-coupon-assignment.page';

const routes: Routes = [
  {
    path: '',
    component: SevenCouponAssignmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SevenCouponAssignmentPageRoutingModule {}
