import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponPageRoutingModule } from './coupon-routing.module';

import { CouponPage } from './coupon.page';

import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule
    
  ],
  declarations: [CouponPage]
})
export class CouponPageModule {}
