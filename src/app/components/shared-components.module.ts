import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PaymentSliderComponent } from './payment-slider/payment-slider.component';
import { FormsModule } from '@angular/forms';
import { RbbPaymentComponent } from './rbb-payment/rbb-payment.component';
import { StatusChipComponent } from './status-chip/status-chip.component';
import { EnvPipe } from '../pipes/env.pipe';
import { GallerySlidesComponent } from './gallery-slides/gallery-slides.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule
  ],
  exports: [
    EnvPipe,
    CommonModule,
    PaymentSliderComponent,
    RbbPaymentComponent,
    StatusChipComponent,
    GallerySlidesComponent
  ],
  declarations: [
    EnvPipe,
    PaymentSliderComponent,
    RbbPaymentComponent,
    StatusChipComponent,
    GallerySlidesComponent
  ],
})
export class SharedComponentsModule { }
