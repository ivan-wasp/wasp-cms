import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParkingDetailPageRoutingModule } from './parking-detail-routing.module';

import { ParkingDetailPage } from './parking-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParkingDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule,
    TranslateModule
  ],
  declarations: [ParkingDetailPage]
})
export class ParkingDetailPageModule {}
