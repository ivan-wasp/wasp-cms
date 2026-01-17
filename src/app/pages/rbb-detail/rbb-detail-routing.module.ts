import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RbbDetailPage } from './rbb-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RbbDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RbbDetailPageRoutingModule {}
