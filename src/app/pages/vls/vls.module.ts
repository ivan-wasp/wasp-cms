import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VlsPageRoutingModule } from './vls-routing.module';

import { VlsPage } from './vls.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VlsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [VlsPage]
})
export class VlsPageModule {}
