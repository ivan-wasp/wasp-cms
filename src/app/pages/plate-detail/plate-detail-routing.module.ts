import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlateDetailPage } from './plate-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PlateDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlateDetailPageRoutingModule {}
