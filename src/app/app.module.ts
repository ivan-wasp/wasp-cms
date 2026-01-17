import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgCalendarModule } from 'ionic2-calendar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgxEditorModule } from 'ngx-editor';
import { QRCodeModule } from 'angularx-qrcode';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeHk from '@angular/common/locales/zh-Hant-HK';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedComponentsModule } from './components/shared-components.module';

registerLocaleData(localeHk, 'zh-HK');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MaterialModule,
        NgxChartsModule,
        NgxMatDatetimePickerModule,
        NgCalendarModule,
        // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        ServiceWorkerModule.register('./offline-service-worker.js', { enabled: environment.production }),
        NgxEditorModule,
        QRCodeModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
            }
          }),

        SharedComponentsModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: MAT_DATE_LOCALE, useValue: 'zh-HK' },
        { provide: LOCALE_ID, useValue: 'zh-hk'},
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
