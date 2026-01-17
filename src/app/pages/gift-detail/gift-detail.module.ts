import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftDetailPageRoutingModule } from './gift-detail-routing.module';

import { GiftDetailPage } from './gift-detail.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GiftDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule
  ],
  declarations: [GiftDetailPage]
})
export class GiftDetailPageModule {}
