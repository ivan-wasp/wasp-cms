import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharityFormPageRoutingModule } from './charity-form-routing.module';

import { CharityFormPage } from './charity-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharityFormPageRoutingModule
  ],
  declarations: [CharityFormPage]
})
export class CharityFormPageModule {}
