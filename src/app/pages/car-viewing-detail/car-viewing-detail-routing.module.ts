import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarViewingDetailPage } from './car-viewing-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CarViewingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarViewingDetailPageRoutingModule {}
