import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomPageDetailPageRoutingModule } from './custom-page-detail-routing.module';

import { CustomPageDetailPage } from './custom-page-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { NgxEditorModule } from 'ngx-editor';
import { IonicSelectableModule } from 'ionic-selectable';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomPageDetailPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    NgxEditorModule,
    IonicSelectableModule,
    ColorPickerModule
  ],
  declarations: [CustomPageDetailPage]
})
export class CustomPageDetailPageModule {}
