import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperchargePageRoutingModule } from './supercharge-routing.module';

import { SuperchargePage } from './supercharge.page';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperchargePageRoutingModule,
    MaterialModule,
    IonicSelectableModule
  ],
  declarations: [SuperchargePage]
})
export class SuperchargePageModule {}
