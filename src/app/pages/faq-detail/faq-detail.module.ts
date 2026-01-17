import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqDetailPageRoutingModule } from './faq-detail-routing.module';

import { FaqDetailPage } from './faq-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [FaqDetailPage]
})
export class FaqDetailPageModule {}
