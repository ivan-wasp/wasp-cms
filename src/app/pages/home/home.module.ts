import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MaterialModule } from 'src/app/material.module';
import { NgCalendarModule } from 'ionic2-calendar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MaterialModule,
    NgCalendarModule,
    NgxChartsModule,
    SharedComponentsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
