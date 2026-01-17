import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlatePageRoutingModule } from './plate-routing.module';

import { PlatePage } from './plate.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlatePageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [PlatePage]
})
export class PlatePageModule {}
