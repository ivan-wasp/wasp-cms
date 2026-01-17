import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiftDetailPage } from './gift-detail.page';

const routes: Routes = [
  {
    path: '',
    component: GiftDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftDetailPageRoutingModule {}
