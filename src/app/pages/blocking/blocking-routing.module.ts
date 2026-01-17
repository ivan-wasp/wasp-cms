import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlockingPage } from './blocking.page';

const routes: Routes = [
  {
    path: '',
    component: BlockingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockingPageRoutingModule {}
