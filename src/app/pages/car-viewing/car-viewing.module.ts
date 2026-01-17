import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarViewingPageRoutingModule } from './car-viewing-routing.module';

import { CarViewingPage } from './car-viewing.page';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarViewingPageRoutingModule,
    SharedComponentsModule,
    IonicSelectableModule,
    MaterialModule
  ],
  declarations: [CarViewingPage]
})
export class CarViewingPageModule {}
