import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { LayoutService } from '@shared/service/layout.service';
import { OverlayService } from '@shared/service/overlay.service';
import { WindowService } from '@shared/service/window.service';
import { UnSubOnDestroy } from '@utilities/abstract/unSubOnDestroy.abstract';
import { AssistantPages, FormPages, IndividualPages, Modules } from '@utilities/enum/router.enum';
import { IToast } from '@utilities/interface/overlay.interface';
import { Toast } from '@utilities/model/toast.model';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout-base',
  templateUrl: './layout-base.component.html',
  styleUrls: ['./layout-base.component.scss'],
})
export class LayoutBaseComponent
  extends UnSubOnDestroy
  implements OnInit, AfterViewInit {
  @ViewChild('tNav', { static: true }) tNav!: ElementRef;
  @ViewChild('tRouterOutlet', { static: true }) tRouterOutlet!: ElementRef;
  @ViewChild('tLayout', { static: true }) tLayout!: ElementRef;
  @ViewChild('tSidebar') tSidebar?: ElementRef<HTMLElement>;


  /** 需隱藏 sidebar 的頁面列表 */
  private readonly sidebarHidePages: string[] = [
    `${IndividualPages.Home}`,
  ]
  /** 需隱藏 footer 的頁面 */
  private hideFooterList = [`${AssistantPages.Chat}`, `${Modules.Form}/${FormPages.CustomComponent}`];

  public showSidebar = false;
  public hideFooter = false;
  /** 顯示主功能區 */
  showMain = false;

  constructor(
    public $window: WindowService,
    private $layout: LayoutService,
    private router: Router,
    private overlayService: OverlayService,
    private renderer: Renderer2
  ) {
    super();
    this.subscribeHideSidebar();
    this.router.events
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((routeEvent: Event) => {
        if (routeEvent instanceof NavigationEnd) {
          const path = routeEvent.urlAfterRedirects.replace(/^\/+|\/+$/g, '').split('?')[0]; //ex: form/select
          this.hideFooterByPath(path);
          this.hideSidebarByPath(path);

          if (path === 'home') {
            this.showMain = false;
            this.renderer.setStyle(this.tNav.nativeElement, 'width', `100vw`);
          } else if (/^login\/resetPassword\/([^\/]+)\/([^\/]+)$/.test(path)) {
            this.showMain = false;
          } else {
            this.showMain = true;
          }
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

  /** 依頁面隱藏 footer  */
  private hideFooterByPath(targetPath: string): void {
    this.hideFooter = this.hideFooterList.some(path => targetPath === path);
  }
  /** 依頁面隱藏 sidebar */
  private hideSidebarByPath(path: string): void {
    this.$layout.hideSidebarSubject.next(this.sidebarHidePages.some(pagePath => pagePath === path))
  }
  /** 訂閱 hideSidebar$ */
  private subscribeHideSidebar(): void {
    this.$layout.hideSidebar$.pipe(takeUntil(this.onDestroy$)).subscribe(is => {
      this.showSidebar = !is;
      if (is) {
        this.menuResize(0);
      };
    });
  }

  /** 當 menu 寬度改變時 */
  public menuResize(width: number): void {
    this.renderer.setStyle(
      this.tNav.nativeElement,
      'width',
      this.tSidebar ? `calc(100vw - ${width}px)` : '100vw'
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
