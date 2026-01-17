import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminNotificationPageRoutingModule } from './admin-notification-routing.module';

import { AdminNotificationPage } from './admin-notification.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminNotificationPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule
  ],
  declarations: [AdminNotificationPage]
})
export class AdminNotificationPageModule {}
