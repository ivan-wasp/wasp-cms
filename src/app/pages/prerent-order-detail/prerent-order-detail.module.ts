import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrerentOrderDetailPageRoutingModule } from './prerent-order-detail-routing.module';

import { PrerentOrderDetailPage } from './prerent-order-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrerentOrderDetailPageRoutingModule,
    SharedComponentsModule,
    MaterialModule
  ],
  declarations: [PrerentOrderDetailPage]
})
export class PrerentOrderDetailPageModule {}
