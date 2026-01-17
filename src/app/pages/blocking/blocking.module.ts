import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockingPageRoutingModule } from './blocking-routing.module';

import { BlockingPage } from './blocking.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlockingPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule,
    CalendarModule
  ],
  declarations: [BlockingPage]
})
export class BlockingPageModule {}
