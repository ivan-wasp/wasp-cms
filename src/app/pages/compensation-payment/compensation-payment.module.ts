import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompensationPaymentPageRoutingModule } from './compensation-payment-routing.module';

import { CompensationPaymentPage } from './compensation-payment.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompensationPaymentPageRoutingModule,
    SharedComponentsModule,
    IonicSelectableModule,
    MaterialModule
  ],
  declarations: [CompensationPaymentPage]
})
export class CompensationPaymentPageModule {}
