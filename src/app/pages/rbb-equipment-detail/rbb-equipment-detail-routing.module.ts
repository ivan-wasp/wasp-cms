import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RbbEquipmentDetailPage } from './rbb-equipment-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RbbEquipmentDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RbbEquipmentDetailPageRoutingModule {}
