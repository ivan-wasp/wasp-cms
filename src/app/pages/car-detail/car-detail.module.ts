import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarDetailPageRoutingModule } from './car-detail-routing.module';

import { CarDetailPage } from './car-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxEditorModule } from 'ngx-editor';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    ColorPickerModule,
    NgxEditorModule,
    TranslateModule
  ],
  declarations: [CarDetailPage]
})
export class CarDetailPageModule {}
