import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectionDetailPageRoutingModule } from './inspection-detail-routing.module';

import { InspectionDetailPage } from './inspection-detail.page';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspectionDetailPageRoutingModule,
    SharedComponentsModule,
    IonicSelectableModule,
    MaterialModule
  ],
  declarations: [InspectionDetailPage]
})
export class InspectionDetailPageModule { }
