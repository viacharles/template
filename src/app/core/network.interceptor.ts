import {filter, take, takeUntil} from 'rxjs';
import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {LoaderService} from './services/loader.service';
import {NavigationStart, Router} from '@angular/router';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  totalRequests = 0;
  completedRequests = 0;
  readonly MaxRetryCounts = 3;
  readonly RetryDelayTime = 15000;

  constructor(
    private loader: LoaderService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    const HideLoading =
      request.url.split('?').length > 1
        ? request.url
            .split('?')[1]
            .split('&')
            .find(query => query.split('=')[0] === 'hideLoading')
            ?.split('=')[1] === 'true'
        : false;
    if (!HideLoading) {
      this.loader.show();
    }
    return next.handle(request).pipe(
      takeUntil(
        this.router.events.pipe(
          take(1),
          // 換頁時取消api
          filter(event => {
            return event instanceof NavigationStart && event.id !== 1;
          })
        )
      ),
      finalize(() => {
        this.completedRequests++;
        if (this.completedRequests === this.totalRequests) {
          this.completedRequests = 0;
          this.totalRequests = 0;
          this.loader.hide();
        }
      })
    );
  }
}
