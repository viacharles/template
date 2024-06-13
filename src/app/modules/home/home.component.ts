import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { TranslateService } from '@core/services/translate.service';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { WindowService } from '@shared/service/window.service';
import { forkJoin, take, takeUntil, timer } from 'rxjs';
import { UnSubOnDestroy } from '@utilities/abstract/unSubOnDestroy.abstract';
import { OverlayService } from '@shared/service/overlay.service';
import { LayoutService } from '@shared/service/layout.service';
import { UsersService } from '@core/services/users.service';
import { HttpClient } from '@angular/common/http';
import { EFormPages, EModule } from '@utilities/enum/router.enum';
import { IUser } from '@utilities/interface/api/auth-api.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends UnSubOnDestroy implements OnInit {
  @ViewChild('tHead') tHead?: ElementRef<HTMLElement>;
  @ViewChild('tAnim1') tAnim1?: ElementRef<HTMLElement>;
  @ViewChild('tAnim2') tAnim2?: ElementRef<HTMLElement>;
  @ViewChild('tAnim3') tAnim3?: ElementRef<HTMLElement>;
  @ViewChild('tAnim4') tAnim4?: ElementRef<HTMLElement>;
  @ViewChild('tAnim5') tAnim5?: ElementRef<HTMLElement>;
  @ViewChild('tAnim6') tAnim6?: ElementRef<HTMLElement>;
  @ViewChild('tAnim7') tAnim7?: ElementRef<HTMLElement>;
  @ViewChild('tAnim8') tAnim8?: ElementRef<HTMLElement>;
  @ViewChild('tAnim9') tAnim9?: ElementRef<HTMLElement>;

  selectedLang: any;
  stats: any = {
    project_count_est: 140,
    tenant_count_est: 10,
    user_count_est: 30,
  };

  get isLoggedIn$() {
    return this.authService.isLoggedIn$;
  }

  constructor(
    private $window: WindowService,
    private $overlay: OverlayService,
    private $layout: LayoutService,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthenticationService,
    private $user: UsersService,
    private translate: TranslateService,
    private storage: StorageMap,
    private http: HttpClient
  ) {
    super();

    this.storage.get('lang').subscribe((val: any) => {
      if (!!val) this.selectedLang = val;
      else this.selectedLang = 'zh';
    });
  }

  private isLogin = false;
  private isHeadVirtual = true;
  private readonly headStyleChangePosition = 650;
  private readonly fadeInClass = 'fadeIn';

  ngOnInit() {
    this.http.get('assets/version.json').subscribe((res: any) => {
      if(localStorage.getItem('version') !== res.version) {
        localStorage.setItem('version', res.version);
        window.location.reload();
      }
    });
    this.$window.mainScroll$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(scroll => {
        this.setAnimation((scroll.target as HTMLElement).scrollTop);
      });

    this.authService.isLoggedIn$.subscribe(val => {
      this.isLogin = !!val;
    });
    this.storage.get('session').subscribe(
      (val: unknown) => {
        try {
          // atob function needs to be wrapped in try-catch due to unexpected exceptions
          if (!!val) {
            const value = `${val}`;
            const token = JSON.parse(atob(value.split('.')[1]));
            const exp = token.exp;
            const now = Math.round(Date.now() / 1000);
            if (now > exp) {
              this.authService.doLogout();
            }
          }
        } catch {
          /* empty */
        }
      },
      () => {
        // nothing to do, this key is expected to not exist in some cases
      }
    );
  }

  public sysMigrateBubbleChartData?: any;

  clickGo() {
    if (!this.isLogin) {
      this.callSso();
    } else {
      this.router.navigateByUrl(`${EModule.Table}`);
    };
  }

  public callSso(): void {
    forkJoin({
      userData: this.http.get<IUser>('assets/mock-data/user-data.json'),
    }).pipe(take(1)).subscribe(({ userData }) => {
      forkJoin([
        this.storage.set('userData', userData),
        this.storage.set('tenantData', userData.tenantRespDtos[0]),
        this.storage.set('token', 'token'),
        this.storage.set('session', 'session'),
        this.storage.set('settingInfo', {
          "chatEnable": "true",
          "isSamlTest": "true",
          "mockSamlLogoutPath": "http://34.80.186.63:8080/simplesaml/module.php/core/authenticate.php",
          "samlLogoutPath": "https://tw3.cath"
        }),
      ]).pipe(take(1)).subscribe(() => {
        this.router.navigateByUrl(`${EModule.Form}/${EFormPages.DynamicForm}`)
      })
    })
  }

  private setAnimation(scrollTop: number): void {
    if (
      scrollTop >= this.headStyleChangePosition &&
      this.isHeadVirtual === true
    ) {
      this.renderer.removeClass(this.tHead?.nativeElement, 'virtual');
      this.renderer.addClass(this.tHead?.nativeElement, 'entity');
      this.isHeadVirtual = false;
    } else if (
      scrollTop < this.headStyleChangePosition &&
      this.isHeadVirtual === false
    ) {
      this.renderer.removeClass(this.tHead?.nativeElement, 'entity');
      this.renderer.addClass(this.tHead?.nativeElement, 'virtual');
      this.isHeadVirtual = true;
    };

    this.setFadeInAnim(
      scrollTop,
      279,
      this.fadeInClass,
      this.tAnim1?.nativeElement
    );
    this.setFadeInAnim(
      scrollTop,
      315,
      this.fadeInClass,
      this.tAnim2?.nativeElement
    );
    this.setFadeInAnim(
      scrollTop,
      540,
      this.fadeInClass,
      this.tAnim3?.nativeElement
    );
    this.setFadeInAnim(
      scrollTop,
      575,
      this.fadeInClass,
      this.tAnim4?.nativeElement
    );
    this.setFadeInAnim(
      scrollTop,
      575,
      'popIn',
      this.tAnim5?.nativeElement,
      500
    );
    this.setFadeInAnim(
      scrollTop,
      1145,
      this.fadeInClass,
      this.tAnim6?.nativeElement
    );
    this.setFadeInAnim(
      scrollTop,
      1145,
      'popIn',
      this.tAnim7?.nativeElement,
      500
    );
    this.setFadeInAnim(
      scrollTop,
      1525,
      this.fadeInClass,
      this.tAnim8?.nativeElement
    );
    this.setFadeInAnim(
      scrollTop,
      1525,
      this.fadeInClass,
      this.tAnim9?.nativeElement,
      500
    );
    // if (scrollTop > 1525 && !this.tAnim8?.nativeElement?.classList.contains(this.fadeInClass)) {
    //   setTimeout(() => this.renderer.setStyle(this.tAnim8?.nativeElement, 'background-image',"url('assets/img/index/bg.png')"), 800)
    // };
  }

  private setFadeInAnim(
    currentScrollTop: number,
    scrollTopLimit: number,
    animClass: string,
    node?: HTMLElement,
    delay = 0
  ): void {
    if (
      currentScrollTop > scrollTopLimit &&
      !node?.classList.contains(animClass)
    ) {
      timer(delay).pipe(take(1)).subscribe(() => this.renderer.addClass(node, animClass));
    }
  }
}
