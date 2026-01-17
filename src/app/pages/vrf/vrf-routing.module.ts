import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VrfPage } from './vrf.page';

const routes: Routes = [
  {
    path: '',
    component: VrfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VrfPageRoutingModule {}
