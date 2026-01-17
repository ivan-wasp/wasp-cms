import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarViewingPage } from './car-viewing.page';

const routes: Routes = [
  {
    path: '',
    component: CarViewingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarViewingPageRoutingModule {}
