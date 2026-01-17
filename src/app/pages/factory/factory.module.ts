import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FactoryPageRoutingModule } from './factory-routing.module';

import { FactoryPage } from './factory.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FactoryPageRoutingModule,
    MaterialModule,
    SharedComponentsModule
  ],
  declarations: [FactoryPage]
})
export class FactoryPageModule {}
