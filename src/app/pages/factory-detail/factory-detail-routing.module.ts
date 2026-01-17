import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FactoryDetailPage } from './factory-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FactoryDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactoryDetailPageRoutingModule {}
