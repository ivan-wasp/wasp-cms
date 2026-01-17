import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarReportPageRoutingModule } from './car-report-routing.module';

import { CarReportPage } from './car-report.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarReportPageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [CarReportPage]
})
export class CarReportPageModule {}
