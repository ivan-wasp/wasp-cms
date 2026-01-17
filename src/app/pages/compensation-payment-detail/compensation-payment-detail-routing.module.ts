import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompensationPaymentDetailPage } from './compensation-payment-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CompensationPaymentDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompensationPaymentDetailPageRoutingModule {}
