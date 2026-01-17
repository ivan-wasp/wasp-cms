import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompensationPaymentDetailPageRoutingModule } from './compensation-payment-detail-routing.module';

import { CompensationPaymentDetailPage } from './compensation-payment-detail.page';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompensationPaymentDetailPageRoutingModule,
    SharedComponentsModule,
    IonicSelectableModule,
    MaterialModule
  ],
  declarations: [CompensationPaymentDetailPage]
})
export class CompensationPaymentDetailPageModule {}
