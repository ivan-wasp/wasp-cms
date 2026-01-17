import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarOverviewPage } from './car-overview.page';

const routes: Routes = [
  {
    path: '',
    component: CarOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarOverviewPageRoutingModule {}
