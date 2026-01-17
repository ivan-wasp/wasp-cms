import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlateDetailPageRoutingModule } from './plate-detail-routing.module';

import { PlateDetailPage } from './plate-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlateDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [PlateDetailPage]
})
export class PlateDetailPageModule {}
