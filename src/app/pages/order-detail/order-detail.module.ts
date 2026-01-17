import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailPageRoutingModule } from './order-detail-routing.module';

import { OrderDetailPage } from './order-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { MaterialModule } from 'src/app/material.module';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    OrderDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    ColorPickerModule,
  ],
  declarations: [OrderDetailPage]
})
export class OrderDetailPageModule {}
