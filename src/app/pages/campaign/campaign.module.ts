import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignPageRoutingModule } from './campaign-routing.module';

import { CampaignPage } from './campaign.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampaignPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule
  ],
  declarations: [CampaignPage]
})
export class CampaignPageModule {}
