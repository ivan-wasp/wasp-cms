import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentPageRoutingModule } from './equipment-routing.module';

import { EquipmentPage } from './equipment.page';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    
  ],
  declarations: [EquipmentPage]
})
export class EquipmentPageModule {}
