import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RdrPage } from './rdr.page';

const routes: Routes = [
  {
    path: '',
    component: RdrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RdrPageRoutingModule {}
