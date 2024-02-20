import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor() {}

  /** 控制 sidebar 開闔 */
  public doSidebarExpandSubject = new Subject<boolean>();
  public doSidebarExpand$ = this.doSidebarExpandSubject.asObservable();

  /** 控制 sidebar 是否顯示 */
  public hideSidebarSubject = new BehaviorSubject<boolean>(false);
  public hideSidebar$ = this.hideSidebarSubject.asObservable();

  /** 訂閱 sidebar 寬度 */
  public sidebarWidthSubject = new BehaviorSubject<number>(215); // sidebar 200px + 開關按鈕 15px
  public sidebarWidth$ = this.sidebarWidthSubject.asObservable();

  /** sidebar mene觸發時是否詢問 */
  public warningBeforeNavigateSubject = new BehaviorSubject<string>('');
  public warningBeforeNavigate$ =
    this.warningBeforeNavigateSubject.asObservable();

  /** 控制 footer 顯示 */
  public hideFooterSubject = new Subject<boolean>();
  public hideFooter$ = this.hideFooterSubject.asObservable(); 
}
