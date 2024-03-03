import {LayoutService} from '@shared/service/layout.service';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StorageMap} from '@ngx-pwa/local-storage';
import {setTheme} from 'ngx-bootstrap/utils';
import {LoaderService} from './core/services/loader.service';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription, filter, map, takeUntil, tap} from 'rxjs';
import {WindowService} from '@shared/service/window.service';
import {UnSubOnDestroy} from '@utilities/abstract/unSubOnDestroy.abstract';
import {EIndividualPages} from '@utilities/enum/router.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends UnSubOnDestroy implements OnInit {
  @ViewChild('tOverlay') tOverlay?: ElementRef<HTMLElement>;
  title = 'channel-web-app';
  pageLoading$ = this.loader.loading$;
  componentLoading$ = this.loader.miniLoading$;
  private pageIsSubscribed = false;
  private sidebarWidthObservable = new Subscription();
  /** 儲存 setTimeout */
  private setTimeouts: any = [];

  constructor(
    private loader: LoaderService,
    private translate: TranslateService,
    private storage: StorageMap,
    private titleService: Title,
    private router: Router,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private $window: WindowService,
    private $layout: LayoutService
  ) {
    super();
  }

  ngOnInit() {
    this.setTimeouts.push(setTimeout(() => {
      // guard 為了在url上加版號連打兩次navigate，所以此處需延遲
      this.translate.addLangs(['en', 'zh']);
      this.translate.setDefaultLang('zh');
      this.storage.get('lang').subscribe(
        lang => {
          if (!!lang) this.translate.use(String(lang));
          else this.setDefaultLanguage();
        },
        () => {
          this.setDefaultLanguage();
        }
      );

      setTheme('bs4');
    }, 200));
    const appTitle = this.titleService.getTitle();
    this.router.events
      .pipe(
        takeUntil(this.onDestroy$),
        filter(event => event instanceof NavigationEnd),
        map((event: any) => event as NavigationEnd),
        tap(event => {
          if (
            event.url !== `/${EIndividualPages.Home}` &&
            !this.pageIsSubscribed
          ) {
            this.overlayWidthResponseWithSidebar();
          }
        }),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child?.firstChild) {
            child = child.firstChild;
          }
          if (child?.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      )
      .subscribe((val: string) => {
        this.titleService.setTitle(val);
      });
  }

  protected override onDestroy(): void {
    this.setTimeouts.forEach((s: any) => clearTimeout(s)) ;
  }

  @HostListener('click', ['$event']) windowClick(event: Event) {
    this.$window.clickSubject.next(event);
  }

  @HostListener('beforeUnload', ['$event']) tabClose(event: BeforeUnloadEvent) {
    this.$window.tabCloseSubject.next(event);
  }

  @HostListener('window:resize', ['$event']) windowResize(event: UIEvent) {
    // bug:會連續發送兩次
    this.$window.windowResizeSubject.next(event);
  }

  @HostListener('window:orientationchange', ['$event']) deviceDirection() {
    this.$window.deviceDirectionSubject.next(screen.orientation);
  }

  setDefaultLanguage() {
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|zh/) ? browserLang : 'en');
    this.storage.set('lang', this.translate.currentLang).subscribe(() => {
      // console.log('set language:', this.translate.currentLang);
    });
  }

  /** overlay不遮蓋sidebar */
  private overlayWidthResponseWithSidebar(): void {
    this.pageLoading$.pipe(takeUntil(this.onDestroy$)).subscribe(isLoading => {
      if (isLoading) {
        this.sidebarWidthObservable = this.$layout.sidebarWidth$
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(width => {
            this.setTimeouts.push(setTimeout(() => {
              if (this.tOverlay) {
                this.renderer.setStyle(
                  this.tOverlay?.nativeElement,
                  'width',
                  `calc(100vw - ${width}px)`
                );
              }
            }, 0));
          });
      } else {
        this.sidebarWidthObservable.unsubscribe();
      }
    });
    this.pageIsSubscribed = true;
  }
}
