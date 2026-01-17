import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharityFormPage } from './charity-form.page';

const routes: Routes = [
  {
    path: '',
    component: CharityFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharityFormPageRoutingModule {}
