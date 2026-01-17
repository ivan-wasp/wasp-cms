import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SevenCouponDetailPageRoutingModule } from './seven-coupon-detail-routing.module';

import { SevenCouponDetailPage } from './seven-coupon-detail.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SevenCouponDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule,
    QRCodeModule
  ],
  declarations: [SevenCouponDetailPage]
})
export class SevenCouponDetailPageModule {}
