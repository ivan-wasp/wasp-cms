import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RbbEquipmentPageRoutingModule } from './rbb-equipment-routing.module';

import { RbbEquipmentPage } from './rbb-equipment.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RbbEquipmentPageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [RbbEquipmentPage]
})
export class RbbEquipmentPageModule {}
