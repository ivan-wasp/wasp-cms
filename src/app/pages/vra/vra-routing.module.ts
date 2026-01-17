import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VraPage } from './vra.page';

const routes: Routes = [
  {
    path: '',
    component: VraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VraPageRoutingModule {}
