import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor() {}


  public doSidebarExpandSubject = new Subject<boolean>();
  /** 控制 sidebar 開闔 */
  public doSidebarExpand$ = this.doSidebarExpandSubject.asObservable();

  public hideSidebarSubject = new Subject<boolean>();
   /** 控制 sidebar 是否隱藏 */
  public hideSidebar$ = this.hideSidebarSubject.asObservable();

  public sidebarWidthSubject = new BehaviorSubject<number>(215); // sidebar 200px + 開關按鈕 15px
  /** 訂閱 sidebar 寬度 */
  public sidebarWidth$ = this.sidebarWidthSubject.asObservable();


  public warningBeforeNavigateSubject = new BehaviorSubject<string>('');
   /** sidebar mene觸發時是否詢問 */
  public warningBeforeNavigate$ =
    this.warningBeforeNavigateSubject.asObservable();


  public hideFooterSubject = new Subject<boolean>();
  /** 控制 footer 顯示 */
  public hideFooter$ = this.hideFooterSubject.asObservable();
}
