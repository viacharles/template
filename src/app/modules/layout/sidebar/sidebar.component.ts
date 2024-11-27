import { environment } from 'src/environments/environment';
import { LoginPages, MenuItemFunctionMark } from '@utilities/enum/router.enum';
import { FormGroup, UntypedFormControl } from '@angular/forms';
import { MenuMap, LoginMap } from '@utilities/map/router.map';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { filter, forkJoin, takeUntil, timer } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { AuthenticationService } from '@core/services/authentication.service';
import { Modules } from '@utilities/enum/router.enum';
import { WindowService } from '@shared/service/window.service';
import { IMenuParams } from '@utilities/interface/router.interface';
import { LayoutService } from '@shared/service/layout.service';
import { HttpHelper } from '@utilities/helper/http.helper';
import { OverlayService } from '@shared/service/overlay.service';
import { WarnDialogComponent } from '@shared/components/overlay/warn-dialog/warn-dialog.component';
import { KeyValue } from '@angular/common';
import { Base } from '@utilities/base/base';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss', './components/trigger-area.scss'],
})
export class SidebarComponent
  extends Base
  implements OnInit, AfterViewInit {
  @Output() resize = new EventEmitter<number>();
  hasRole(val?: string[]) {
    if (val === undefined) {
      return true;
    }
    if (typeof val === 'string')
      return this.userData.role.includes(val);
    for (let i = 0; i < val.length; i++) {
      if (this.userData.role.includes(val[i])) return true;
    }
    return false;
  }

  /** menu data map */
  public mainMenu = MenuMap;
  public loginMenu = LoginMap;
  public menuForm = new UntypedFormControl(this.router.url);
  public activeRoute = '';
  timeStamp = new Date().getTime();
  profilePicSrc = 'assets/img/profile-pic1.png';
  userName = '';
  tenantName = '';
  menuIndex = '';
  userData: any;
  userId: any;
  tenantData: any;
  tempFilename = '';
  public isMenuExpand = true;
  public showMenuContent = true;
  private resizeObserver?: ResizeObserver;
  private warningBeforeNavigate = '';
  public mainMenuForm = new FormGroup({});
  public readonly version = environment.versionSubtext;

  constructor(
    public router: Router,
    private storage: StorageMap,
    public authService: AuthenticationService,
    private activatedRouter: ActivatedRoute,
    private $overlay: OverlayService,
    private $window: WindowService,
    private $layout: LayoutService,
    private renderer: Renderer2,
    private self: ElementRef
  ) {
    super();
    this.activeRoute = router.routerState.snapshot.url.split('?')[0];
    this.checkConditions();
    this.router.events
      .pipe(
        takeUntil(this.onDestroy$),
        filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((event: Event) => {
        this.activeRoute = (event as any).url.split('?')[0];
        this.checkConditions();
      });
  }

  protected override onInitBase(): void {
    this.authService._isLoggedIn;
    this.$layout.warningBeforeNavigate$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(is => {
        this.warningBeforeNavigate = is;
      });
    this.$layout.doSidebarExpand$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(is =>
        timer(0).subscribe(() => {
          this.isMenuExpand = is;
          this.showMenuContent = this.isMenuExpand;
        })
      );

    this.afterPageChanged();
    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe(_ => {
      this.afterPageChanged();
    });

  }

  protected override afterViewInitBase(): void {
    this.resizeObserver = this.$window.generateResizeObserver(entry => {
      this.resize.emit(entry.contentRect.width);
    });
    this.resizeObserver.observe(this.self.nativeElement);
  }

  protected override onDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  public isEnable(keyValue: KeyValue<Modules | string, IMenuParams>): boolean {
    return keyValue.value.path !== undefined || keyValue.value.functionMark !== undefined
  }

  public expandMenu(): void {
    if (this.isMenuExpand) {
      this.isMenuExpand = false;
      this.showMenuContent = false;
    } else {
      this.isMenuExpand = true;
      timer(200).subscribe(_ => (this.showMenuContent = true));
    };
  }

  /** menu 項目是否為當前頁面path */
  public isCurrentPage(path?: string): boolean {
    return '/' + path === this.activeRoute;
  }

  private changeBackgroundColor(): void {
    this.renderer.setStyle(this.self.nativeElement, 'background', '')
  }

  /** 母項目擁有子項目或本身有導頁功能的才顯示 */
  public showParentItem(parentItem: IMenuParams): boolean {
    return (
      !!parentItem.path ||
      (parentItem.subMenu
        ? Array.from(parentItem.subMenu!.values()).some(sub =>
          this.hasRole(sub.roles)
        )
        : false)
    );
  }

  /** 點擊 menu 項目
   * @param mainKey 主項目key
   * @param subKey 子項目key
   */
  public toggleMenu(
    mainKey: string,
    subKey?: string,
    mark?: MenuItemFunctionMark
  ): void {
    const Target =
      mainKey === LoginPages.Login || mainKey === LoginPages.Register
        ? this.loginMenu.get(mainKey as LoginPages)
        : subKey !== undefined
          ? this.mainMenu.get(mainKey as Modules)?.subMenu?.get(subKey)
          : this.mainMenu.get(mainKey as Modules);
    if (Target?.isExpand !== undefined) {
      Target!.isExpand = !Target!.isExpand;
    }
    if (Target?.path) {
      if (this.warningBeforeNavigate) {
        this.showWarn(Target?.path);
      } else {
        this.router.navigateByUrl(Target?.path);
      }
    }
    if (mark) {
      this.customFunction(mark);
    }
  }

  /** menu項目自訂功能 */
  public customFunction(mark?: MenuItemFunctionMark): void {
    const isSamlTest =
      this.activatedRouter.snapshot.queryParams['isSamlLogoutTest'];
    switch (mark) {
      case MenuItemFunctionMark.Logout:
        this.authService.doLogout(
          undefined,
          isSamlTest === undefined ? undefined : isSamlTest
        );
        break;
      case MenuItemFunctionMark.PortfolioOverview:
        this.router.navigateByUrl(
          `${Modules.Table}`
        );
    }
  }

  /** 為了讓MenuMap以本來的方式排序 */
  public asIsOrder() {
    return 0;
  }

  private showWarn(path: string): void {
    this.$overlay.addDialog(
      WarnDialogComponent,
      {
        title: this.warningBeforeNavigate,
        buttons: {
          confirm: {},
          cancel: {}
        }
      },
      {
        callback: {
          confirm: () => this.router.navigateByUrl(path),
          cancel: () => this.menuForm.setValue(this.router.url),
        },
      }
    );
  }

  checkConditions() {
    this.authService.isLoggedIn().subscribe(authenticated => {
      if (authenticated) {
        forkJoin([
          this.storage.get('userData'),
          this.storage.get('tenantData'),
          this.storage.get('lang'),
        ]).subscribe(data => {
          this.userData = data[0];
          this.tenantData = data[1];
          const lang = data[2];
          this.userName = this.userData.name;
          this.tenantName =
            lang === 'en'
              ? this.tenantData.tenantNameEn
              : this.tenantData.tenantNameCn;
        });
      } else {
        // user is unauthenticated
      }
    });

    // ensure nav-headings are selected on known-routes
    if (this.activeRoute.startsWith('/admin/')) {
      this.menuIndex = '1';
    } else if (this.activeRoute.startsWith('/projects')) {
      this.menuIndex = '2';
    } else if (this.activeRoute.startsWith('/portfolio')) {
      this.menuIndex = '3';
    } else if (this.activeRoute.startsWith('/settings')) {
      this.menuIndex = '4';
    }
  }

  public getUrlWithVersion(url: string): string {
    const urlModified = HttpHelper.replaceUrlByNewVersion(
      url,
      this.router,
      this.version
    );
    return urlModified;
  }

  /** 頁面切換後 */
  private afterPageChanged(): void {
    // if (this.router.url.split('?')[0] === `/${Modules.ProjectDashboard}`) {
    //   const dashboard = this.mainMenu.get(Modules.ProjectDashboard)!;
    //   this.mainMenu.set(Modules.ProjectDashboard, {
    //     ...dashboard,
    //     isExpand: true,
    //   });
    // } else {
    //   this.mainMenu.forEach((value, key) => {
    //     value.isExpand = this.router.url.split('/')[1] === key;
    //   });
    // }
    this.mainMenu.forEach((value, key) => {
      value.isExpand = this.router.url.split('/')[1] === key;
    });
    this.menuForm.setValue(this.router.url);
  }
}
