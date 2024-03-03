import {Injectable} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {IRouterHistory} from '@utilities/interface/common.interface';
import {BehaviorSubject, filter, map, takeUntil} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {LayoutService} from './layout.service';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(
    private router: Router,
    private $layout: LayoutService
  ) {
    const HistoryStored = sessionStorage.getItem('history');
    if (HistoryStored) {
      this.history = JSON.parse(HistoryStored);
    }
    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationStart || event instanceof NavigationEnd
        ),
        map((event: any) => event as Event)
      )
      .subscribe(event => {
        this.currentUrl = (event as any).url;
        this.$layout.warningBeforeNavigateSubject.next('');
        this.handleRouterEvent(event);
      });
  }

  public currentUrl = '';
  private history: IRouterHistory[] = [];
  private historySubject = new BehaviorSubject<IRouterHistory[]>([]);
  public history$ = this.historySubject.asObservable();
  private readonly version = environment.versionSubtext;

  /** 回到第幾個url：0為最新 */
  public getHistory(index: number): IRouterHistory {
    return this.history[index];
  }

  /** 前往某頁
   * @param revertFilter 是否回復之前排序&過濾狀態
   * */
  public toPage(url: string, revertFilter = false): void {
    this.history.unshift({
      url,
      revertFilter,
      isBeforehand: true,
    });
    sessionStorage.setItem('history', JSON.stringify(this.history));
    this.router.navigateByUrl(url);
  }

  /** 回到上一頁
   * @param revertFilter 是否回復之前排序&過濾狀態
   * */
  public toLastUrl(revertFilter = false): void {
    if (this.history.length > 1) {
      this.history.shift();
      this.history[0] = {
        ...this.history[0],
        ...{revertFilter},
      };
      this.historySubject.next(this.history);
      sessionStorage.setItem('history', JSON.stringify(this.history));
      this.router.navigateByUrl(`${this.history[0].url}`);
    }
  }

  private handleRouterEvent(event: Event): void {
    const UrlWithoutVersion = (event as any).url.replace(
      `v=${this.version}`,
      ''
    );
    if (event instanceof NavigationEnd) {
      if (this.history.length > 3) {
        // 避免儲存過多資料
        this.history.pop();
      }
      const IsBeforehand = this.history[0] && this.history[0].isBeforehand;
      if (IsBeforehand) {
        delete this.history[0].isBeforehand;
      } else if (
        this.history.length === 0 ||
        (this.history[0] && this.history[0].url !== UrlWithoutVersion)
      ) {
        this.history.unshift({url: UrlWithoutVersion});
      }
      this.historySubject.next(this.history);
      sessionStorage.setItem('history', JSON.stringify(this.history));
    }
  }
}
