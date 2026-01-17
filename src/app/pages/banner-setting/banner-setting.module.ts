import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BannerSettingPageRoutingModule } from './banner-setting-routing.module';

import { BannerSettingPage } from './banner-setting.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BannerSettingPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule,
    ColorPickerModule
  ],
  declarations: [BannerSettingPage]
})
export class BannerSettingPageModule {}
