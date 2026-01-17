import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentDetailPageRoutingModule } from './appointment-detail-routing.module';

import { AppointmentDetailPage } from './appointment-detail.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [AppointmentDetailPage]
})
export class AppointmentDetailPageModule {}
