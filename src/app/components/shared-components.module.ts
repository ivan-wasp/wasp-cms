import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PaymentSliderComponent } from './payment-slider/payment-slider.component';
import { FormsModule } from '@angular/forms';
import { RbbPaymentComponent } from './rbb-payment/rbb-payment.component';
import { StatusChipComponent } from './status-chip/status-chip.component';
import { EnvPipe } from '../pipes/env.pipe';
import { GallerySlidesComponent } from './gallery-slides/gallery-slides.component';
import { FleetMapComponent } from './fleet-map/fleet-map.component';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    GoogleMapsModule
  ],
  exports: [
    EnvPipe,
    CommonModule,
    PaymentSliderComponent,
    RbbPaymentComponent,
    StatusChipComponent,
    GallerySlidesComponent,
    FleetMapComponent
  ],
  declarations: [
    EnvPipe,
    PaymentSliderComponent,
    RbbPaymentComponent,
    StatusChipComponent,
    GallerySlidesComponent,
    FleetMapComponent
  ],
})
export class SharedComponentsModule { }
