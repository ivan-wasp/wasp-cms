import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminDetailPageRoutingModule } from './admin-detail-routing.module';

import { AdminDetailPage } from './admin-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [AdminDetailPage]
})
export class AdminDetailPageModule {}
