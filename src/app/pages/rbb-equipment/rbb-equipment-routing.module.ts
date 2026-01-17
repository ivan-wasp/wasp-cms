import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RbbEquipmentPage } from './rbb-equipment.page';

const routes: Routes = [
  {
    path: '',
    component: RbbEquipmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RbbEquipmentPageRoutingModule {}
