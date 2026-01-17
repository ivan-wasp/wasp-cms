import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VraPageRoutingModule } from './vra-routing.module';

import { VraPage } from './vra.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VraPageRoutingModule,
    SharedComponentsModule,
    TranslateModule
  ],
  declarations: [VraPage]
})
export class VraPageModule {}
