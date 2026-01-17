import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DafPageRoutingModule } from './daf-routing.module';

import { DafPage } from './daf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DafPageRoutingModule
  ],
  declarations: [DafPage]
})
export class DafPageModule {}
