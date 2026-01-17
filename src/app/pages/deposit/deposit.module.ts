import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepositPageRoutingModule } from './deposit-routing.module';

import { DepositPage } from './deposit.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DepositPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule
  ],
  declarations: [DepositPage]
})
export class DepositPageModule {}
