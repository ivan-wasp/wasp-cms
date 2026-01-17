import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BannerSettingPage } from './banner-setting.page';

const routes: Routes = [
  {
    path: '',
    component: BannerSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BannerSettingPageRoutingModule {}
