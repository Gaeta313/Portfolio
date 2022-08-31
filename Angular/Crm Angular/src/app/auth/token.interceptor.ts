import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSrv: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authSrv.user$.pipe(
      take(1),
      switchMap((user) => {
        const newReq = request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${environment.token}`
          ).set(
            'X-TENANT-ID',
            'fe_0222a'
          )

        });
        return next.handle(newReq);
      }),
      catchError((err) => {
        if(err.error.message == "Error: Username is already taken!"){
          throw new Error("L'username è già utilizzato")
        }
        else if(err.error.message == "Error: Email is already in use!"){
          throw new Error("L'email è già utilizzata")
        }
       throw new Error('Errore nella richiesta');

      })
    );
  }
}
