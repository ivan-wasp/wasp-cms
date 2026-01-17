import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RbbPageRoutingModule } from './rbb-routing.module';

import { RbbPage } from './rbb.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RbbPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule
  ],
  declarations: [RbbPage]
})
export class RbbPageModule {}
