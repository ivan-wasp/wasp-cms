import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductReportPage } from './product-report.page';

const routes: Routes = [
  {
    path: '',
    component: ProductReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductReportPageRoutingModule {}
