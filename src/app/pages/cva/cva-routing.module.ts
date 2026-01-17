import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CvaPage } from './cva.page';

const routes: Routes = [
  {
    path: '',
    component: CvaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CvaPageRoutingModule {}
