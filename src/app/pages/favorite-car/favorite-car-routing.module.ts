import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoriteCarPage } from './favorite-car.page';

const routes: Routes = [
  {
    path: '',
    component: FavoriteCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteCarPageRoutingModule {}
