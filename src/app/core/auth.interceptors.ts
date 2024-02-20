import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { catchError, EMPTY, mergeMap, Observable, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { OverlayService } from '@shared/service/overlay.service';
import { EContent } from '@utilities/enum/common.enum';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /// WIP - following example from https://www.bezkoder.com/angular-12-refresh-token/
  /// maybe not needed for now, need to see how the current implementation is working...

  constructor(
    private $auth: AuthenticationService,
    private $overlay: OverlayService,
    private storage: StorageMap,
    private router: Router
  ) { }

  readonly MaxRetryCounts = 3;
  private status401Counts = 0;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.$auth.getTokens().pipe(
      mergeMap(data => {
        if (req.url !== '/api/auth/refresh') {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${data.session}`,
              SameSite: 'None',
              'x-access-token': data.session,
            },
          });
        }
        return next.handle(req).pipe(
          tap(val => {
            if (val instanceof HttpResponse) {
              // console.log('tap headers.keys', val.headers.keys());
              // console.log('tap headers.token', val.headers.get('x-access-token'));
              const newRefreshToken = val.headers.get('x-access-token');
              if (!!newRefreshToken) {
                if (!environment.production)
                  this.storage.set('token', newRefreshToken).subscribe();
              }
            }
          }),
          catchError(err => {
            if (!environment.production) {
              console.log(err);
            };
            if (err.error && err.error.code === 'U002') {
              this.router.navigate(['/home']);
            };
            if (err.status === 401) {
              if (this.status401Counts < this.MaxRetryCounts) {
                this.status401Counts++;
                return this.handle401Error(req, next);
              } else {
                this.status401Counts = 0;
                this.$auth.doLogout();
                return throwError(() => err);
              }
            } else if (err.status === 403) {
              if (req.url !== '/api/status/tag') {
                this.$auth.doLogout();
              };
              return EMPTY;
            } else {
              return throwError(() => err);
            };
          })

        );
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return this.$auth
      .refresh()
      .pipe(
        mergeMap(token => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token.accessToken}`,
              'x-access-token': token.accessToken,
            },
          });
          this.status401Counts = 0;
          return next.handle(request);
        }),
        catchError(() => {
          this.$overlay.addToast(EContent.Error, {
            title: 'common.update-token-fail',
          });
          return EMPTY;
        })
      )
  }
}
