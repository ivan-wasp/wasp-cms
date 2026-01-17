import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RdrPageRoutingModule } from './rdr-routing.module';

import { RdrPage } from './rdr.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RdrPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [RdrPage]
})
export class RdrPageModule {}
