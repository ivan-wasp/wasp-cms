import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RvrPage } from './rvr.page';

const routes: Routes = [
  {
    path: '',
    component: RvrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RvrPageRoutingModule {}
