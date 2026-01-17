import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrerentOrderDetailPage } from './prerent-order-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PrerentOrderDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrerentOrderDetailPageRoutingModule {}
