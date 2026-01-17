import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignDetailPageRoutingModule } from './campaign-detail-routing.module';

import { CampaignDetailPage } from './campaign-detail.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampaignDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule
  ],
  declarations: [CampaignDetailPage]
})
export class CampaignDetailPageModule {}
