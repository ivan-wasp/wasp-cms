import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChargePage } from './charge.page';

const routes: Routes = [
  {
    path: '',
    component: ChargePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChargePageRoutingModule {}
