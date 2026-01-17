import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CvaPageRoutingModule } from './cva-routing.module';

import { CvaPage } from './cva.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    CvaPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [CvaPage]
})
export class CvaPageModule {}
