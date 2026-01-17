import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RbbEquipmentDetailPageRoutingModule } from './rbb-equipment-detail-routing.module';

import { RbbEquipmentDetailPage } from './rbb-equipment-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RbbEquipmentDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [RbbEquipmentDetailPage]
})
export class RbbEquipmentDetailPageModule {}
