import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { throwError } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

const TOKEN_KEY = 'USER_DATA';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private alertController: AlertController,
        private authService: AuthService,
        private commonService: CommonService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // return from(this.storage.get(TOKEN_KEY))
        return from(this.authService.adminToken.asObservable())
        .pipe(
            switchMap(token => {        
                // console.log(token);
                request = request.clone({ headers: request.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
                request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}` ) });
                request = request.clone({ url:request.url });
                // console.log(request);
                return next.handle(request).pipe(
                    map((event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {
                            // do nothing for now
                        }
                        return event;
                    }),
                    catchError((error: HttpErrorResponse) => {
                        const status =  error.status;
                        const reason = error && error.error.reason ? error.error.reason : '';

                        this.commonService.isLoading =false;
                        // this.presentAlert(status, reason);
                        return throwError(error);
                    })
                );
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