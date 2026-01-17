import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarReportPage } from './car-report.page';

const routes: Routes = [
  {
    path: '',
    component: CarReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarReportPageRoutingModule {}
