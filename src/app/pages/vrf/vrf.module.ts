import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VrfPageRoutingModule } from './vrf-routing.module';

import { VrfPage } from './vrf.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VrfPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [VrfPage]
})
export class VrfPageModule {}
