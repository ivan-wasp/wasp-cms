import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutstandingPaymentPageRoutingModule } from './outstanding-payment-routing.module';

import { OutstandingPaymentPage } from './outstanding-payment.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutstandingPaymentPageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [OutstandingPaymentPage]
})
export class OutstandingPaymentPageModule {}
