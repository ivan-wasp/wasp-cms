import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentReportPageRoutingModule } from './equipment-report-routing.module';

import { EquipmentReportPage } from './equipment-report.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentReportPageRoutingModule,
    SharedComponentsModule,
    MaterialModule
  ],
  declarations: [EquipmentReportPage]
})
export class EquipmentReportPageModule {}
