import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutstandingPaymentPage } from './outstanding-payment.page';

const routes: Routes = [
  {
    path: '',
    component: OutstandingPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutstandingPaymentPageRoutingModule {}
