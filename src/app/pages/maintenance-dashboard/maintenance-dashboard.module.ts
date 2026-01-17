import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceDashboardPageRoutingModule } from './maintenance-dashboard-routing.module';

import { MaintenanceDashboardPage } from './maintenance-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceDashboardPageRoutingModule
  ],
  declarations: [MaintenanceDashboardPage]
})
export class MaintenanceDashboardPageModule {}
