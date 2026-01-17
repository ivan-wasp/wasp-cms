import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SevenCouponPageRoutingModule } from './seven-coupon-routing.module';

import { SevenCouponPage } from './seven-coupon.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SevenCouponPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule,
    QRCodeModule
  ],
  declarations: [SevenCouponPage]
})
export class SevenCouponPageModule {}
