import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrerentOrderPage } from './prerent-order.page';

const routes: Routes = [
  {
    path: '',
    component: PrerentOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrerentOrderPageRoutingModule {}
