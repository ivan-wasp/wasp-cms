import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DafPage } from './daf.page';

const routes: Routes = [
  {
    path: '',
    component: DafPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DafPageRoutingModule {}
