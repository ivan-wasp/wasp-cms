import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private alertController: AlertController,
        private authService: AuthService,
        private commonService: CommonService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.adminToken.value;
        const requestWithHeaders = request.clone({
            setHeaders: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: token ? `Bearer ${token}` : ''
            }
        });

        return next.handle(requestWithHeaders).pipe(
            catchError((error: HttpErrorResponse) => {
                this.commonService.isLoading = false;
                return throwError(error);
            })
        );

    }

    async presentAlert(status, reason) {
        const alert = await this.alertController.create({
            header: status + ' Error',
            // subHeader: 'Subtitle',
            message: reason,
            buttons: ['OK']
        });

        await alert.present();
    }

}
