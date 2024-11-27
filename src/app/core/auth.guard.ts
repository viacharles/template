import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, take, timer } from 'rxjs';

import { AuthenticationService } from './services/authentication.service';
import { UsersService } from './services/users.service';
import { EContent, ROLE } from '@utilities/enum/common.enum';
import { RouterService } from '@shared/service/router.service';
import { environment } from 'src/environments/environment.prod';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoginPages } from '@utilities/enum/router.enum';
import { OverlayService } from '@shared/service/overlay.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  mustHaveSpecificRole: any = {
    '/admin/project-access': [ROLE.TENANT_ADMIN],
    '/admin/invite': [ROLE.TENANT_ADMIN, ROLE.SITE_ADMIN],

    '/admin/authConfig': [ROLE.SITE_ADMIN, ROLE.TENANT_ADMIN, ROLE.CONSULTANT],
    '/admin/tenantConfig': [ROLE.SITE_ADMIN, ROLE.CONSULTANT],

    // '/portfolio/overview': [ROLE.REVIEWER, ROLE.SITE_ADMIN, ROLE.TENANT_ADMIN], // Dashboard 全角色都看得到
    '/portfolio/analytic': [ROLE.REVIEWER, ROLE.SITE_ADMIN, ROLE.TENANT_ADMIN],
  };

  constructor(
    private auth: AuthenticationService,
    private user: UsersService,
    private router: Router,
    private storage: StorageMap,
    private $overlay: OverlayService,
    private $router: RouterService
  ) { }

  private readonly version = environment.versionSubtext;

  showUnauthorized(redir: any) {
    alert("Unauthorized");
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Observable<boolean>(observer => {
      this.storage
        .get('isNeed')
        .pipe(take(1))
        .subscribe(is => {
          if (is !== undefined && is === 'true') {
            this.$overlay.addToast(EContent.Info, {
              title: 'common.need-register',
            });
            this.router.navigateByUrl(`login/${LoginPages.UserBasicInfo}`);
            return observer.next(false);
          } else {
            // KL: for some reason, the runtime doesn't like forkJoin here...
            this.auth.isLoggedIn().subscribe(isLoggedIn => {
              this.user.getUserRoles().subscribe(roles => {
                if (!isLoggedIn) {
                  this.storage
                    .clear()
                    .pipe(take(1))
                    .subscribe(_ => {
                      this.showUnauthorized('/home');
                      if (!environment.production)
                        console.log(
                          `path: ${state.url}, roles: ${roles}, UNAUTHORIZED`
                        );
                      return observer.next(false);
                    });
                } else {
                  // check special-permissions
                  const roleRequired = (this.mustHaveSpecificRole as any)[state.url as any] as ROLE;

                  if (!!roleRequired) {
                    if (
                      !roles.some((i: any) => roleRequired.indexOf(i) >= 0)
                    ) {
                      this.showUnauthorized('/projects');
                      if (!environment.production) {
                        console.log(
                          `path: ${state.url}, roles: ${roles}, DENIED`
                        );
                      }
                      return observer.next(false);
                    }
                  }
                  // if (!environment.production) console.log(`path: ${state.url}, roles: ${roles}, AUTHORIZED`);
                  return observer.next(true);
                }
              });
            });
          }
        });
    });
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.replaceUrlByNewVersion(state.url);
    return new Observable<boolean>(observer => {
      this.storage
        .get('isNeed')
        .pipe(take(1))
        .subscribe(is => {
          if (is !== undefined && is === 'true') {
            this.$overlay.addToast(EContent.Info, {
              title: 'common.need-register',
            });
            this.router.navigateByUrl(`login/${LoginPages.UserBasicInfo}`);
            return observer.next(false);
          } else {
            this.auth
              .isLoggedIn()
              .pipe(take(1))
              .subscribe(isLoggedIn => {
                this.user
                  .getUserRoles()
                  .pipe(take(1))
                  .subscribe(roles => {
                    if (!isLoggedIn) {
                      this.storage
                        .clear()
                        .pipe(take(1))
                        .subscribe(_ => {
                          this.showUnauthorized('/home');
                          if (!environment.production)
                            console.log(
                              `path: ${state.url}, roles: ${roles}, UNAUTHORIZED`
                            );
                          return observer.next(false);
                        });
                    } else {
                      const roleRequired = this.mustHaveSpecificRole[`${state.url}`];
                      if (!!roleRequired) {
                        if (
                          !roles.some(
                            (i: any) => roleRequired.indexOf(i) >= 0
                          )
                        ) {
                          this.showUnauthorized('/projects');
                          if (!environment.production) {
                            console.log(
                              `path: ${state.url}, roles: ${roles}, DENIED`
                            );
                          }
                          return observer.next(false);
                        }
                      }
                      return observer.next(true);
                    }
                  });
              });
          }
        });
    });
  }

  private replaceUrlByNewVersion(currentUrl: string): void {
    if (currentUrl) {
      let urlModified: string = currentUrl;
      const NewUrlParamVersion = `v=${this.version}`;
      const UrlParams: string = urlModified.substring(
        urlModified.indexOf('?') + 1
      );
      const OriginVersion = UrlParams.split('&').find(param =>
        param.includes('v=')
      );
      if (!currentUrl.includes(NewUrlParamVersion)) {
        if (!urlModified.includes('?')) {
          urlModified = urlModified + '?' + NewUrlParamVersion;
          this.router.navigateByUrl(urlModified);
        } else if (!UrlParams.includes('v=')) {
          urlModified = urlModified + '&' + NewUrlParamVersion;
          this.router.navigateByUrl(urlModified);
        } else if (OriginVersion && OriginVersion !== NewUrlParamVersion) {
          urlModified = urlModified.replace(/v=.*?(&|$)/, NewUrlParamVersion);
          this.router.navigateByUrl(urlModified);
        }
      }
    }
  }
}

@Injectable({ providedIn: 'root' })
export class NoAuthGuard {
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) { }

  private readonly version = environment.versionSubtext;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Observable<boolean>(observer => {
      this.auth.isLoggedIn().subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.auth.doLogout('quiet');
          if (!environment.production)
            console.log(`path: ${state.url}, LOGOUT`);
          timer(100).pipe(take(1)).subscribe(() => window.location.reload());
          return observer.next(true);
        }

        return observer.next(true);
      });
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Observable<boolean>(observer => {
      this.auth.isLoggedIn().subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.auth.doLogout('quiet');
          if (!environment.production)
            console.log(`path: ${state.url}, LOGOUT`);
          timer(100).pipe(take(1)).subscribe(() => window.location.reload());
          return observer.next(true);
        }

        return observer.next(true);
      });
    });
  }
}

@Injectable({ providedIn: 'root' })
export class DefaultGuard {
  constructor(private router: Router) { }

  private readonly version = environment.versionSubtext;

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Observable<boolean>(observer => {
      return observer.next(true);
    });
  }
}
