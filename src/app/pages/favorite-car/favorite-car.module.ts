import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoriteCarPageRoutingModule } from './favorite-car-routing.module';

import { FavoriteCarPage } from './favorite-car.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { CalendarModule } from 'ion2-calendar';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteCarPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule,
    CalendarModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [FavoriteCarPage]
})
export class FavoriteCarPageModule {}
