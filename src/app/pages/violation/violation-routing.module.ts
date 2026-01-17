import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViolationPage } from './violation.page';

const routes: Routes = [
  {
    path: '',
    component: ViolationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViolationPageRoutingModule {}
