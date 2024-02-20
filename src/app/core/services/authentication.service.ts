import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {BehaviorSubject, forkJoin, map, mergeMap, Observable, take, tap} from 'rxjs';
import {StorageMap} from '@ngx-pwa/local-storage';
import {LoaderService} from './loader.service';
import {OverlayService} from '@shared/service/overlay.service';
import {EContent} from '@utilities/enum/common.enum';
import {
  IExchangeTokens,
  ISettingInfo,
} from '@utilities/interface/api/auth-api.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public _isLoggedIn = new BehaviorSubject<boolean>(false);
  public readonly isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: StorageMap,
    private loader: LoaderService,
    private $overlay: OverlayService,
  ) {
    this.storage
      .watch('session')
      .subscribe(token => this._isLoggedIn.next(!!token));
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.storage.get('session').subscribe(data => {
        if (!!data) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      });
    });
  }

  doLogout(code?: string, isTestFromQueryParam?: boolean) {
    // debugger;
    this.loader.show();
    this.storage
      .get('settingInfo')
      .pipe(take(1))
      .subscribe(info => {
        const {samlLogoutPath, mockSamlLogoutPath, isSamlTest} =
          info as ISettingInfo;
        this.storage
          .clear()
          .pipe(take(1))
          .subscribe(() => {
            this.loader.hide();
            if (code === 'quiet') {
              /* empty */
            } else {
              this.$overlay.addToast(EContent.Success, {
                title: 'nav.logout-success',
              });
              this.router.navigateByUrl('home');
            }
          });
      });
  }

  getToken() {
    // KL:20220723 - deprecated; use getTokens() instead
    return this.storage.get('session');
  }

  getTokens() {
    return forkJoin([
      this.storage.get('session'), // login-session token
      this.storage.get('token'), // access/refresh token
    ]).pipe(
      map(val => {
        const result = {session: val[0] || '', token: val[1] || ''} as {
          session: string;
          token: string;
        };
        // console.log('getTokens', result);
        return result;
      })
    );
  }

  public callSso(): Observable<string> {
    return this.http.get<string>('api/auth/saml');
  }

  /** 登入時用code換取 JWT Token */
  public exchangeJwtToken(code: string): Observable<IExchangeTokens> {
    const body = {code};
    return this.http.post<IExchangeTokens>('api/auth/token', body);
  }

  /** 換token */
  public refresh(): Observable<any> {
    return this.getTokens().pipe(
      take(1),
      mergeMap(({token}) => {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + token,
          'x-access-token': token,
        });
        return this.http.post<any>('/api/auth/refresh', '', { headers }).pipe(
          tap({
            next: resp => {
              if (!environment.production) {
                console.log('login success, set storage items:', resp);
              }
              forkJoin([
                this.storage.set('token', resp.refreshToken),
                this.storage.set('session', resp.accessToken),
              ])
                .pipe(take(1))
                .subscribe(() => {});
            },
          })
        )
      })
    )
  }

  public getSettingInfoAndStore(): Promise<ISettingInfo> {
    return new Promise(resolve => {
      this.http.get<ISettingInfo>('/api/auth/setting-info').subscribe(info => {
        this.storage
          .set('settingInfo', info)
          .pipe(take(1))
          .subscribe(_ => resolve(info));
      });
    });
  }
}
