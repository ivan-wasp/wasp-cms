import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentReportPage } from './equipment-report.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentReportPageRoutingModule {}
