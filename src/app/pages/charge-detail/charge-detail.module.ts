import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChargeDetailPageRoutingModule } from './charge-detail-routing.module';

import { ChargeDetailPage } from './charge-detail.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChargeDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [ChargeDetailPage]
})
export class ChargeDetailPageModule {}
