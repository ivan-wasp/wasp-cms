import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaqDetailPage } from './faq-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FaqDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqDetailPageRoutingModule {}
