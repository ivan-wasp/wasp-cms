import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductReportPageRoutingModule } from './product-report-routing.module';

import { ProductReportPage } from './product-report.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductReportPageRoutingModule,
    SharedComponentsModule,
    MaterialModule
  ],
  declarations: [ProductReportPage]
})
export class ProductReportPageModule {}
