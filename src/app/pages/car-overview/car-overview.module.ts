import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarOverviewPageRoutingModule } from './car-overview-routing.module';

import { CarOverviewPage } from './car-overview.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarOverviewPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
  ],
  declarations: [CarOverviewPage]
})
export class CarOverviewPageModule {}
