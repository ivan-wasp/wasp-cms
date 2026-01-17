import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepositDetailPage } from './deposit-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DepositDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositDetailPageRoutingModule {}
