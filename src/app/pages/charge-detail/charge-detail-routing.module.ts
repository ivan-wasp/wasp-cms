import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChargeDetailPage } from './charge-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ChargeDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChargeDetailPageRoutingModule {}
