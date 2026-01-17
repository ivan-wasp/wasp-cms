import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VlsPage } from './vls.page';

const routes: Routes = [
  {
    path: '',
    component: VlsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VlsPageRoutingModule {}
