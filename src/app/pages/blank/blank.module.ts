import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlankPageRoutingModule } from './blank-routing.module';

import { BlankPage } from './blank.page';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlankPageRoutingModule,
    MaterialModule
  ],
  declarations: [BlankPage]
})
export class BlankPageModule {}
