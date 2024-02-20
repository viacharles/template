import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {LayoutService} from '@shared/service/layout.service';
import {OverlayService} from '@shared/service/overlay.service';
import {WindowService} from '@shared/service/window.service';
import {UnSubOnDestroy} from '@utilities/abstract/unSubOnDestroy.abstract';
import { EAssistantPages, EFormPages, EModule } from '@utilities/enum/router.enum';
import {IToast} from '@utilities/interface/overlay.interface';
import {Toast} from '@utilities/model/toast.model';
import {takeUntil} from 'rxjs';

@Component({
  templateUrl: './layout-base.component.html',
  styleUrls: ['./layout-base.component.scss'],
})
export class LayoutBaseComponent
  extends UnSubOnDestroy
  implements OnInit, AfterViewInit, DoCheck
{
  @ViewChild('tNav', {static: true}) tNav!: ElementRef;
  @ViewChild('tRouterOutlet', {static: true}) tRouterOutlet!: ElementRef;
  @ViewChild('tLayout', {static: true}) tLayout!: ElementRef;
  @ViewChild('tSidebar') tSidebar?: ElementRef<HTMLElement>;
  /** 需隱藏 footer 的頁面 */
  private hideFooterList = [`${EAssistantPages.Chat}`, `${EModule.Form}/${EFormPages.Select}`];

  public showSidebar = false;
  public hideFooter = false;
  showNav = false;

  constructor(
    public $window: WindowService,
    private $layout: LayoutService,
    private router: Router,
    private overlayService: OverlayService,
    private renderer: Renderer2
  ) {
    super();
    this.router.events
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((routeEvent: Event) => {
        if (routeEvent instanceof NavigationEnd) {
          const path = routeEvent.urlAfterRedirects.replace('/^\/|\/$/g', '').split('?')[0]; //ex: form/select
          console.log('aa-path', path)
          this.hideFooterByPath(path);
          if (path === 'home') {
            this.showNav = false;
            this.renderer.setStyle(this.tNav.nativeElement, 'width', `100vw`);
          } else if (/^login\/resetPassword\/([^\/]+)\/([^\/]+)$/.test(path)) {
            this.showNav = false;
          } else {
            this.showNav = true;
          }
        }
      });
    this.$layout.hideSidebar$.pipe(takeUntil(this.onDestroy$)).subscribe(is => {
      this.showSidebar = !is;
      if (is) {
        setTimeout(() => {
          // 等sidebarWidthSubject跑完
          this.$layout.sidebarWidthSubject.next(0);
        });
      }
    });
    this.$layout.hideFooter$.pipe(takeUntil(this.onDestroy$)).subscribe(is => {
      this.hideFooter = is;
    })
  }

  public currentToasts: Toast[] = [];
  private windowResizeObserver?: ResizeObserver;
  private sidebarResizeObserver?: ResizeObserver;

  ngOnInit(): void {
    this.overlayService.toastQueue$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(toasts => this.afterToastsChanged(toasts));

    this.$window.scrollToTop$.pipe(takeUntil(this.onDestroy$)).subscribe(() =>
      this.tRouterOutlet.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    );
  }
  ngAfterViewInit(): void {
    this.windowResizeObserver = this.$window.generateResizeObserver(entry => {
      this.$window.windowWidthSubject.next(entry.contentRect.width);
    });
    this.windowResizeObserver.observe(this.tLayout.nativeElement);
  }

  ngDoCheck(): void {
    this.showSidebar = this.showNav;
    if (!this.showSidebar) {
      this.renderer.setStyle(this.tNav.nativeElement, 'width', '100vw');
    }
  }

  /** 依頁面隱藏 footer  */
  private hideFooterByPath(targetPath: string): void {
    this.hideFooter = this.hideFooterList.some(path => targetPath === path);
  }

  /** 當 menu 寬度改變時 */
  public menuResize(width: number): void {
    this.renderer.setStyle(
      this.tNav.nativeElement,
      'width',
      this.showSidebar ? `calc(100vw - ${width}px)` : '100vw'
    );
    this.$layout.sidebarWidthSubject.next(width + 15); // 開關按鈕 15px
  }

  public mainScroll(scroll: any): void {
    const ScrollEvent = scroll as UIEvent;
    this.$window.mainScrollSubject.next(ScrollEvent);
  }

  /** toast 序列來源發生改變後 */
  private afterToastsChanged(srcToasts: IToast[]): void {
    this.currentToasts = this.currentToasts.filter(toast =>
      srcToasts.some(srcToast => srcToast.id === toast.id)
    );
    srcToasts
      .filter(
        srcToast => !this.currentToasts.some(toast => srcToast.id === toast.id)
      )
      .forEach(toast =>
        this.currentToasts.unshift(new Toast(toast, this.overlayService))
      );
  }

  protected override onDestroy(): void {
    this.windowResizeObserver?.disconnect();
    this.sidebarResizeObserver?.disconnect();
  }
}
