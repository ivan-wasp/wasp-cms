import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompensationPaymentPage } from './compensation-payment.page';

const routes: Routes = [
  {
    path: '',
    component: CompensationPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompensationPaymentPageRoutingModule {}
