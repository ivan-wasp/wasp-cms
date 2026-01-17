import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharityFormListPageRoutingModule } from './charity-form-list-routing.module';

import { CharityFormListPage } from './charity-form-list.page';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MaterialModule } from 'src/app/material.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharityFormListPageRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    IonicSelectableModule
  ],
  declarations: [CharityFormListPage]
})
export class CharityFormListPageModule {}
