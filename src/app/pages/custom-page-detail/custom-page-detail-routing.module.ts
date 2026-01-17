import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomPageDetailPage } from './custom-page-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CustomPageDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomPageDetailPageRoutingModule {}
