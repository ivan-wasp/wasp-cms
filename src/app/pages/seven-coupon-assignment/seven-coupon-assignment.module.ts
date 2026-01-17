import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SevenCouponAssignmentPageRoutingModule } from './seven-coupon-assignment-routing.module';

import { SevenCouponAssignmentPage } from './seven-coupon-assignment.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SevenCouponAssignmentPageRoutingModule,
    SharedComponentsModule,
    IonicSelectableModule
  ],
  declarations: [SevenCouponAssignmentPage]
})
export class SevenCouponAssignmentPageModule {}
