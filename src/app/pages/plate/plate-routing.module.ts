import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlatePage } from './plate.page';

const routes: Routes = [
  {
    path: '',
    component: PlatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatePageRoutingModule {}
