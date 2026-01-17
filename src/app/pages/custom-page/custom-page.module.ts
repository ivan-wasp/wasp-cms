import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomPagePageRoutingModule } from './custom-page-routing.module';

import { CustomPagePage } from './custom-page.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomPagePageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [CustomPagePage]
})
export class CustomPagePageModule {}
