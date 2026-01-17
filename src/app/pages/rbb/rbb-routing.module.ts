import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RbbPage } from './rbb.page';

const routes: Routes = [
  {
    path: '',
    component: RbbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RbbPageRoutingModule {}
