import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharityFormListPage } from './charity-form-list.page';

const routes: Routes = [
  {
    path: '',
    component: CharityFormListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharityFormListPageRoutingModule {}
