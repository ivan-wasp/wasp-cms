import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarViewingDetailPageRoutingModule } from './car-viewing-detail-routing.module';

import { CarViewingDetailPage } from './car-viewing-detail.page';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarViewingDetailPageRoutingModule,
    SharedComponentsModule,
    IonicSelectableModule,
    MaterialModule
  ],
  declarations: [CarViewingDetailPage]
})
export class CarViewingDetailPageModule {}
